import { Shift } from "@/database/db";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CustomButton from "./customButton";

interface CustomCalendarProps {
  allShifts: Shift[];
}

const CustomCalendar = ({ allShifts }: CustomCalendarProps) => {
  // const formatDate = (date: Date) => {
  //   return date.toLocaleDateString([], {
  //     year: "numeric",
  //     month: "short",
  //     // day: "numeric",
  //     weekday: "short",
  //     dayPeriod: "long",
  //   });
  // };

  const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const monthNames = [
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

  const [currentFullDate, setCurrentFullDate] = useState(new Date());

  const [showModal, setShowModal] = useState(false);
  // const currentMonthName = new Date().toLocaleString("default", {
  //   month: "long",
  // });

  const changeCurrMonth = (text?: string) => {
    if (text === "next") {
      setCurrentFullDate((prev) => {
        const d = new Date(prev);
        d.setMonth(d.getMonth() + 1);
        return d;
      });
    } else if (text === "prev") {
      setCurrentFullDate((prev) => {
        const d = new Date(prev);
        d.setMonth(d.getMonth() - 1);
        return d;
      });
    }
  };

  const getNumberOfDays = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const changeMonth = currentFullDate.getMonth();
  const changeYear = currentFullDate.getFullYear();
  const today = new Date().getDate();
  console.log("dfdf", changeYear, changeMonth);

  const numbers = Array.from(
    { length: getNumberOfDays(changeYear, changeMonth) },
    (_, i) => i + 1,
  );

  //-1 to make the starting day monday for the week.
  const firstDay = new Date(changeYear, changeMonth, 1).getDay() - 1;
  const daysInMonth = new Date(changeYear, changeMonth + 1, 0).getDate();
  const prevMonthDays = new Date(changeYear, changeMonth - 1, 0).getDate();

  const calendarDays = [...Array(firstDay).fill(null), ...numbers];

  console.log("todayyyy=>", firstDay);
  return (
    <ScrollView
      contentContainerStyle={styles.calendarListContainer}
      showsVerticalScrollIndicator={true}
    >
      {/* Month header */}
      <View style={styles.monthHeader}>
        <CustomButton title="<" onButtonPress={() => changeCurrMonth("prev")} />

        <View style={styles.titleContainer}>
          <Text style={styles.monthText}>
            {prevMonthDays}--
            {monthNames[changeMonth]}
            {firstDay}
          </Text>
          <Text style={styles.yearText}>
            {changeYear}-----
            {daysInMonth}
          </Text>
        </View>

        <CustomButton title=">" onButtonPress={() => changeCurrMonth("next")} />
      </View>

      {/* Calendar */}
      <View style={styles.calanderGrid}>
        {/* Weekday headings */}
        <View style={styles.weekDays}>
          {weekdays.map((day) => (
            <View key={day} style={styles.calendarCell}>
              <Text style={styles.weekdayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Date boxes */}
        <View style={styles.daysGrid}>
          {calendarDays.map((num) => (
            <Pressable
              key={num}
              style={styles.calendarCell}
              onPress={() => setShowModal(true)}
            >
              <View
                style={[
                  styles.daysBox,
                  num === today && { backgroundColor: "grey" },
                ]}
              >
                <Text style={styles.dateText}>{num}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Shift Details</Text>
                <Text style={styles.modalSubtitle}>Monday, 10 August</Text>
              </View>

              <Pressable
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            {/* Shift information */}
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📍 Location</Text>
                <Text style={styles.detailValue}>Aegis Aged Care</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>🕐 Time</Text>
                <Text style={styles.detailValue}>9:00 AM - 5:00 PM</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>💰 Rate</Text>
                <Text style={styles.detailValue}>$32 / hour</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📋 Shift Type</Text>
                <Text style={styles.detailValue}>Day Shift</Text>
              </View>
            </View>

            {/* Close button */}
            <Pressable
              style={styles.doneButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.doneButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default CustomCalendar;

const styles = StyleSheet.create({
  // const styles = StyleSheet.create({
  calendarListContainer: {
    padding: 12,
    gap: 12,
  },

  calanderGrid: {
    width: "100%",
  },

  weekDays: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 6,
  },

  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },

  // Shared by weekday headings and date cells
  calendarCell: {
    width: `${100 / 7}%`,
    padding: 2,
  },

  weekdayText: {
    textAlign: "center",
    fontWeight: "600",
    paddingVertical: 10,
  },

  dateText: {
    textAlign: "center",
    fontSize: 15,
  },

  daysBox: {
    height: 105,
    width: "100%",
    // aspectRatio: 1,
    backgroundColor: "#BDBDBD",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  todaysBox: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "grey",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  monthHeader: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "green",
  },

  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  monthText: {
    fontSize: 18,
    fontWeight: "700",
  },

  yearText: {
    fontSize: 14,
    color: "#a89c9c",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 35,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 25,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222222",
  },

  modalSubtitle: {
    fontSize: 14,
    color: "#777777",
    marginTop: 5,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
  },

  closeText: {
    fontSize: 16,
    color: "#555555",
  },

  detailsContainer: {
    backgroundColor: "#F7F7F7",
    borderRadius: 16,
    padding: 16,
    marginBottom: 25,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  detailLabel: {
    fontSize: 15,
    color: "#666666",
  },

  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222222",
  },

  doneButton: {
    backgroundColor: "#222222",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },

  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
