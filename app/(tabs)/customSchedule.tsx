import CustomCalendar from "@/components/customCalendar";
import { getAllShifts, insertShift, Shift } from "@/database/db";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type FormData = Omit<Shift, "id" | "createdAt">;

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dateKey = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const formatTime = (isoString: string) => {
  if (!isoString) return "--";
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const calcHours = (start: string, end: string) => {
  if (!start || !end) return 0;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  let diff = e - s;
  if (diff < 0) diff += 24 * 60 * 60 * 1000;
  return diff / 1000 / 3600;
};

type ShiftRecord = Omit<Shift, "id" | "createdAt">;

const emptyForm = (): FormData => ({
  name: "",
  location: "",
  rate: 0,
  start: "",
  end: "",
  shiftDate: "",
  notes: "",
  shiftType: "",
});

export default function CalendarScreen() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [shifts, setShifts] = useState<Record<string, ShiftRecord[]>>({});
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm());

  // Time picker state (simple text inputs for RN compatibility without native pickers)
  const [startTimeText, setStartTimeText] = useState("");
  const [endTimeText, setEndTimeText] = useState("");

  useEffect(() => {
    const loadShifts = async () => {
      const allShifts = await getAllShifts(); // your DB query function
      const grouped: Record<string, ShiftRecord[]> = {};
      allShifts.forEach((s) => {
        const key = s.shiftDate.slice(0, 10).replace(/-/g, "-");
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(s);
      });
      setShifts(grouped);
    };
    loadShifts();
  }, []);

  const changeMonth = (dir: number) => {
    let m = currentMonth + dir;
    let y = currentYear;
    if (m > 11) {
      m = 0;
      y++;
    }
    if (m < 0) {
      m = 11;
      y--;
    }
    setCurrentMonth(m);
    setCurrentYear(y);
  };

  const handleDayPress = (y: number, m: number, d: number) => {
    const key = dateKey(y, m, d);
    setSelectedKey(key);
    setSelectedDate(new Date(y, m, d));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "rate" ? Number(value) : value,
    }));
  };

  const parseTimeInput = (timeStr: string, baseDate: Date): string => {
    // Accepts "9:00 AM", "14:30", "9am", etc.
    const cleaned = timeStr.trim().toUpperCase();
    const match = cleaned.match(/^(\d{1,2}):?(\d{2})?\s*(AM|PM)?$/);
    if (!match) return "";
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2] || "0");
    const period = match[3];
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);
    return date.toISOString();
  };

  const handleSave = async () => {
    if (!selectedKey || !selectedDate) return;

    if (!formData.name.trim()) {
      Alert.alert("Validation", "Please enter a shift name.");
      return;
    }

    const startISO = parseTimeInput(startTimeText, selectedDate);
    const endISO = parseTimeInput(endTimeText, selectedDate);

    const shift: FormData = {
      ...formData,
      shiftDate: selectedDate.toISOString(),
      start: startISO,
      end: endISO,
    };

    try {
      await insertShift(shift);

      setShifts((prev) => ({
        ...prev,
        [selectedKey]: [...(prev[selectedKey] || []), shift],
      }));

      Alert.alert("Success", "Shift saved!");
      setFormData(emptyForm());
      setStartTimeText("");
      setEndTimeText("");
      setShowModal(false);
    } catch (error) {
      console.error("Insert failed:", error);
      Alert.alert("Database Error", "Failed to save shift.");
    }
  };

  const handleDeleteShift = (key: string, index: number) => {
    Alert.alert("Delete Shift", "Remove this shift?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setShifts((prev) => {
            const updated = [...(prev[key] || [])];
            updated.splice(index, 1);
            return { ...prev, [key]: updated };
          });
        },
      },
    ]);
  };

  // Build calendar grid
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrev = new Date(currentYear, currentMonth, 0).getDate();
  console.log("firstdat", firstDay, daysInMonth, daysInPrev);

  const cells: {
    year: number;
    month: number;
    day: number;
    current: boolean;
  }[] = [];

  // Leading cells from previous month
  for (let i = 0; i < firstDay; i++) {
    cells.push({
      year: currentYear,
      month: currentMonth - 1,
      day: daysInPrev - firstDay + 1 + i,
      current: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      year: currentYear,
      month: currentMonth,
      day: d,
      current: true,
    });
  }

  // Trailing cells to fill last row
  const remainder = cells.length % 7;
  if (remainder > 0) {
    for (let d = 1; d <= 7 - remainder; d++) {
      cells.push({
        year: currentYear,
        month: currentMonth + 1,
        day: d,
        current: false,
      });
    }
  }

  const selectedShifts = selectedKey ? shifts[selectedKey] || [] : [];
  const selectedDateLabel = selectedDate
    ? selectedDate.toLocaleDateString([], {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <View style={styles.container}>
      <CustomCalendar />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.navBtn} onPress={() => changeMonth(-1)}>
          <Text style={styles.navBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthLabel}>
          {MONTHS[currentMonth]} {currentYear}
        </Text>
        <TouchableOpacity style={styles.navBtn} onPress={() => changeMonth(1)}>
          <Text style={styles.navBtnText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Day labels */}
      <View style={styles.dayRow}>
        {DAYS.map((d) => (
          <Text key={d} style={styles.dayLabel}>
            {d}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.grid}>
        {cells.map((cell, idx) => {
          const normYear =
            cell.month < 0
              ? cell.year - 1
              : cell.month > 11
                ? cell.year + 1
                : cell.year;
          const normMonth = ((cell.month % 12) + 12) % 12;
          const key = dateKey(normYear, normMonth, cell.day);
          const isToday =
            normYear === today.getFullYear() &&
            normMonth === today.getMonth() &&
            cell.day === today.getDate();
          const isSelected = selectedKey === key;
          const dayShifts = shifts[key] || [];

          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.cell,
                !cell.current && styles.cellOther,
                isToday && styles.cellToday,
                isSelected && styles.cellSelected,
              ]}
              onPress={() => handleDayPress(normYear, normMonth, cell.day)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.cellNum,
                  !cell.current && styles.cellNumOther,
                  isToday && styles.cellNumToday,
                  isSelected && styles.cellNumSelected,
                ]}
              >
                {cell.day}
              </Text>
              {dayShifts.slice(0, 2).map((s, i) => (
                <View key={i} style={styles.shiftPill}>
                  <Text style={styles.shiftPillText} numberOfLines={1}>
                    {s.name}
                  </Text>
                </View>
              ))}
              {dayShifts.length > 2 && (
                <Text style={styles.moreText}>+{dayShifts.length - 2}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Detail panel when a grid item is selected */}
      {selectedKey && (
        <View style={styles.detailPanel}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle} numberOfLines={1}>
              {selectedDateLabel}
            </Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => {
                setFormData({
                  ...emptyForm(),
                  shiftDate: selectedDate?.toISOString() ?? "",
                });
                setStartTimeText("");
                setEndTimeText("");
                setShowModal(true);
              }}
            >
              <Text style={styles.addBtnText}>+ Add Shift</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.shiftScroll}
            showsVerticalScrollIndicator={true}
          >
            {selectedShifts.length === 0 ? (
              <Text style={styles.emptyText}>No shifts on this day.</Text>
            ) : (
              selectedShifts.map((s, idx) => {
                const hrs = calcHours(s.start, s.end);
                const earn =
                  hrs > 0 && s.rate > 0
                    ? `$${(hrs * s.rate).toFixed(2)}`
                    : null;
                return (
                  <View key={idx} style={styles.shiftItem}>
                    <View style={styles.shiftIconBox}>
                      <Text style={styles.shiftIcon}>💼</Text>
                    </View>
                    <View style={styles.shiftInfo}>
                      <Text style={styles.shiftName}>
                        {s.name || "Unnamed shift"}
                      </Text>
                      <Text style={styles.shiftMeta}>
                        {s.location ? `${s.location} · ` : ""}
                        {formatTime(s.start)} – {formatTime(s.end)}
                        {earn ? ` · ${earn}` : ""}
                      </Text>
                      {s.notes ? (
                        <Text style={styles.shiftNotes}>{s.notes}</Text>
                      ) : null}
                    </View>
                    {s.rate > 0 && (
                      <Text style={styles.shiftRate}>${s.rate}/hr</Text>
                    )}
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDeleteShift(selectedKey, idx)}
                    >
                      <Text style={styles.deleteBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      )}

      {/* Add Shift Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.overlay}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
            >
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Add Shift</Text>
                {selectedDateLabel && (
                  <Text style={styles.modalDateLabel}>{selectedDateLabel}</Text>
                )}

                <Text style={styles.label}>Name</Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(t) => handleInputChange("name", t)}
                  placeholder="e.g. Barista shift"
                  style={styles.input}
                  placeholderTextColor="#aaa"
                />

                <Text style={styles.label}>Location</Text>
                <TextInput
                  value={formData.location}
                  onChangeText={(t) => handleInputChange("location", t)}
                  placeholder="e.g. Main St Café"
                  style={styles.input}
                  placeholderTextColor="#aaa"
                />

                <Text style={styles.label}>Hourly Rate ($)</Text>
                <TextInput
                  value={formData.rate ? String(formData.rate) : ""}
                  onChangeText={(t) => handleInputChange("rate", t)}
                  placeholder="0.00"
                  keyboardType="numeric"
                  style={styles.input}
                  placeholderTextColor="#aaa"
                />

                <View style={styles.twoCol}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Start Time</Text>
                    <TextInput
                      value={startTimeText}
                      onChangeText={setStartTimeText}
                      placeholder="e.g. 9:00 AM"
                      style={styles.input}
                      placeholderTextColor="#aaa"
                    />
                  </View>
                  <View style={{ width: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>End Time</Text>
                    <TextInput
                      value={endTimeText}
                      onChangeText={setEndTimeText}
                      placeholder="e.g. 5:00 PM"
                      style={styles.input}
                      placeholderTextColor="#aaa"
                    />
                  </View>
                </View>

                <Text style={styles.label}>Notes (optional)</Text>
                <TextInput
                  value={formData.notes}
                  onChangeText={(t) => handleInputChange("notes", t)}
                  placeholder="Any extra details..."
                  multiline
                  numberOfLines={3}
                  style={[styles.input, styles.textArea]}
                  placeholderTextColor="#aaa"
                />

                <View style={styles.buttonRow}>
                  <Pressable
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSave}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// ─── Dark theme colour tokens ───────────────────────────────────────────────
const C = {
  bg: "#0D0D0F", // page background — near-black
  surface: "#18181C", // card / cell surface
  surfaceAlt: "#111114", // dimmed cells (other-month)
  border: "#2A2A30", // subtle borders
  borderStrong: "#3A3A44", // stronger borders
  accent: "#4F8EF7", // blue accent (today, selected, buttons)
  accentDim: "#1A2D4A", // accent tinted background (selected cell)
  accentPill: "#172440", // shift pill background
  accentPillTx: "#7EB3FF", // shift pill text
  textPrimary: "#F0F0F5", // headings & body text
  textSecond: "#8A8A9A", // secondary / meta text
  textMuted: "#4A4A58", // muted / other-month numbers
  inputBg: "#1E1E24", // form input background
  cancelBg: "#26262E", // cancel button background
  overlay: "rgba(0,0,0,0.72)",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
    paddingTop: Platform.OS === "ios" ? 56 : 24,
    paddingHorizontal: 12,
    paddingBottom: 18,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.surface,
  },
  navBtnText: {
    fontSize: 22,
    color: C.textPrimary,
    lineHeight: 26,
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: C.textPrimary,
  },

  // Day labels
  dayRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  dayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
    color: C.textMuted,
    paddingVertical: 4,
  },

  // Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: "14.285%",
    minHeight: 68,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: C.border,
    padding: 5,
    marginBottom: 4,
    backgroundColor: C.surface,
  },
  cellOther: {
    backgroundColor: C.surfaceAlt,
  },
  cellToday: {
    borderColor: C.accent,
    borderWidth: 1.5,
  },
  cellSelected: {
    backgroundColor: C.accentDim,
    borderColor: C.accent,
    borderWidth: 1.5,
  },
  cellNum: {
    fontSize: 13,
    color: C.textPrimary,
    marginBottom: 3,
    fontWeight: "400",
  },
  cellNumOther: {
    color: C.textMuted,
  },
  cellNumToday: {
    color: C.accent,
    fontWeight: "600",
  },
  cellNumSelected: {
    color: C.accent,
    fontWeight: "600",
  },
  shiftPill: {
    backgroundColor: C.accentPill,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginBottom: 2,
  },
  shiftPillText: {
    fontSize: 9,
    color: C.accentPillTx,
    fontWeight: "500",
  },
  moreText: {
    fontSize: 9,
    color: C.textSecond,
  },

  // Detail panel
  detailPanel: {
    marginTop: 14,
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: C.border,
    maxHeight: 260,
    overflow: "hidden",
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: C.textPrimary,
    flex: 1,
    marginRight: 10,
  },
  addBtn: {
    backgroundColor: C.accent,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  shiftScroll: {
    paddingHorizontal: 16,
  },
  emptyText: {
    textAlign: "center",
    color: C.textMuted,
    fontSize: 14,
    paddingVertical: 24,
  },
  shiftItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
    gap: 10,
  },
  shiftIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.accentDim,
    alignItems: "center",
    justifyContent: "center",
  },
  shiftIcon: {
    fontSize: 16,
  },
  shiftInfo: {
    flex: 1,
    minWidth: 0,
  },
  shiftName: {
    fontSize: 14,
    fontWeight: "600",
    color: C.textPrimary,
  },
  shiftMeta: {
    fontSize: 12,
    color: C.textSecond,
    marginTop: 1,
  },
  shiftNotes: {
    fontSize: 12,
    color: C.textMuted,
    marginTop: 1,
    fontStyle: "italic",
  },
  shiftRate: {
    fontSize: 12,
    color: C.textSecond,
  },
  deleteBtn: {
    padding: 6,
  },
  deleteBtnText: {
    fontSize: 14,
    color: C.textMuted,
  },

  // Modal
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: C.overlay,
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 420,
    backgroundColor: C.surface,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.borderStrong,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: C.textPrimary,
    textAlign: "center",
    marginBottom: 4,
  },
  modalDateLabel: {
    fontSize: 13,
    color: C.textSecond,
    textAlign: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: C.textSecond,
    marginBottom: 5,
    marginLeft: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 12,
    fontSize: 15,
    color: C.textPrimary,
    backgroundColor: C.inputBg,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  twoCol: {
    flexDirection: "row",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: C.cancelBg,
  },
  saveButton: {
    backgroundColor: C.accent,
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 15,
    color: "#fff",
  },
});
