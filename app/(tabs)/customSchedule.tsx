import CustomButton from "@/components/customButton";
import { insertShift, Shift } from "@/database/db";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
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
  View,
} from "react-native";

type FormData = Omit<Shift, "id" | "createdAt">;

type CustomScheduleProps = {
  title?: string;
  isFloating?: boolean;
};

const CustomSchedule = ({
  title = "Add Item",
  isFloating = false,
}: CustomScheduleProps) => {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    location: "",
    rate: 0,
    start: "",
    end: "",
    shiftDate: "",
    notes: "",
    shiftType: "",
  });

  // date + time states
  const [shiftDate, setShiftDate] = useState(new Date());

  const [startTime, setStartTime] = useState(new Date());

  const [endTime, setEndTime] = useState(new Date());

  // picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showStartPicker, setShowStartPicker] = useState(false);

  const [showEndPicker, setShowEndPicker] = useState(false);

  // formatting
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "rate" ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    try {
      await insertShift(formData);

      Alert.alert("Success", "Shift added successfully");

      // reset form
      setFormData({
        name: "",
        location: "",
        rate: 0,
        start: "",
        end: "",
        shiftDate: "",
        notes: "",
        shiftType: "",
      });

      setShowModal(false);
    } catch (error) {
      console.error("Insert failed:", error);

      Alert.alert("Database Error", "Failed to save shift.");
    }
  };

  return (
    <View
      style={isFloating ? styles.floatingContainer : styles.inlineContainer}
    >
      <CustomButton title={title} onButtonPress={setShowModal} />

      <Modal visible={showModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.overlay}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Add Work Shift</Text>

                {/* Name */}
                <Text style={styles.label}>Name</Text>

                <TextInput
                  value={formData.name}
                  onChangeText={(text) => handleInputChange("name", text)}
                  placeholder="Enter name"
                  style={styles.input}
                />

                {/* Location */}
                <Text style={styles.label}>Location</Text>

                <TextInput
                  value={formData.location}
                  onChangeText={(text) => handleInputChange("location", text)}
                  placeholder="Enter location"
                  style={styles.input}
                />

                {/* Rate */}
                <Text style={styles.label}>Hourly Rate ($)</Text>

                <TextInput
                  value={String(formData.rate)}
                  onChangeText={(text) => handleInputChange("rate", text)}
                  placeholder="Enter rate"
                  keyboardType="numeric"
                  style={styles.input}
                />

                {/* Shift Date */}
                <Text style={styles.label}>Shift Date</Text>

                <Pressable
                  style={styles.input}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text>
                    {formData.shiftDate
                      ? formatDate(new Date(formData.shiftDate))
                      : "Select shift date"}
                  </Text>
                </Pressable>

                {showDatePicker && (
                  <DateTimePicker
                    value={shiftDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);

                      if (selectedDate) {
                        setShiftDate(selectedDate);

                        setFormData((prev) => ({
                          ...prev,
                          shiftDate: selectedDate.toISOString(),
                        }));
                      }
                    }}
                  />
                )}

                {/* Start Time */}
                <Text style={styles.label}>Start Time</Text>

                <Pressable
                  style={styles.input}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Text>
                    {formData.start
                      ? formatTime(new Date(formData.start))
                      : "Select start time"}
                  </Text>
                </Pressable>

                {showStartPicker && (
                  <DateTimePicker
                    value={startTime}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowStartPicker(false);

                      if (selectedDate) {
                        const date = new Date(shiftDate);

                        date.setHours(selectedDate.getHours());

                        date.setMinutes(selectedDate.getMinutes());

                        setStartTime(selectedDate);

                        setFormData((prev) => ({
                          ...prev,
                          start: date.toISOString(),
                        }));
                      }
                    }}
                  />
                )}

                {/* End Time */}
                <Text style={styles.label}>End Time</Text>

                <Pressable
                  style={styles.input}
                  onPress={() => setShowEndPicker(true)}
                >
                  <Text>
                    {formData.end
                      ? formatTime(new Date(formData.end))
                      : "Select end time"}
                  </Text>
                </Pressable>

                {showEndPicker && (
                  <DateTimePicker
                    value={endTime}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowEndPicker(false);

                      if (selectedDate) {
                        const date = new Date(shiftDate);

                        date.setHours(selectedDate.getHours());

                        date.setMinutes(selectedDate.getMinutes());

                        setEndTime(selectedDate);

                        setFormData((prev) => ({
                          ...prev,
                          end: date.toISOString(),
                        }));
                      }
                    }}
                  />
                )}

                {/* Notes */}
                {/* <Text style={styles.label}>Notes</Text>

                <TextInput
                  value={formData.notes}
                  onChangeText={(text) => handleInputChange("notes", text)}
                  placeholder="Optional notes"
                  multiline
                  numberOfLines={3}
                  style={[
                    styles.input,
                    {
                      height: 90,
                      textAlignVertical: "top",
                    },
                  ]}
                /> */}

                {/* Buttons */}
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
};

export default CustomSchedule;

const styles = StyleSheet.create({
  inlineContainer: {
    marginVertical: 10,
    alignSelf: "center",
  },

  floatingContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
    zIndex: 1000,
    elevation: 8,
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },

  modalContainer: {
    width: "90%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
    justifyContent: "center",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    marginLeft: 4,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  cancelButton: {
    backgroundColor: "#999",
  },

  saveButton: {
    backgroundColor: "#007AFF",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
