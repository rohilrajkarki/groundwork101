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
  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      // day: "numeric",
      weekday: "short",
      dayPeriod: "long",
    });
  };

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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

  const firstDay = new Date(changeYear, changeMonth, 1).getDay();

  console.log("todayyyy=>", firstDay);
  return (
    <ScrollView
      contentContainerStyle={styles.calendarListContainer}
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.monthHeader}>
        <CustomButton title="<" onButtonPress={() => changeCurrMonth("prev")} />

        <View style={styles.titleContainer}>
          <Text style={styles.monthText}>{monthNames[changeMonth]}2</Text>
          <Text style={styles.yearText}>{changeYear}</Text>
        </View>

        <CustomButton title=">" onButtonPress={() => changeCurrMonth("next")} />
      </View>
      <View style={styles.weekDays}>
        {weekdays.map((day) => (
          <Text key={day} style={styles.dayText}>
            {day}
          </Text>
        ))}
      </View>
      {numbers.map((num) => (
        <Pressable onPress={() => setShowModal(!showModal)} key={num}>
          <View style={num === today ? styles.todaysBox : styles.daysBox}>
            <Text style={styles.dayText}>{monthNames[changeMonth]}</Text>
            <Text style={styles.dayText}>{num}</Text>
          </View>
        </Pressable>
      ))}
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
      {/* <ScrollView
        contentContainerStyle={styles.calendarListContainer}
        showsVerticalScrollIndicator={true}
      >
        {allShifts.map((shiftData) => (
          <View key={shiftData.id} style={styles.box}>
            <Text>{shiftData.name}</Text>
            <Text>{formatDate(new Date(shiftData.shiftDate))}</Text>
          </View>
        ))}
      </ScrollView> */}
    </ScrollView>
  );
};

export default CustomCalendar;

const styles = StyleSheet.create({
  weekDays: {
    flexDirection: "row",
    width: "100%",
  },
  daysBox: {
    width: 50,
    height: 100,
    backgroundColor: "#BDBDBD",
  },
  todaysBox: {
    width: 50,
    height: 100,
    backgroundColor: "grey",
  },

  monthHeader: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    color: "#555",
  },

  dayText: {
    flex: 1,
    textAlign: "center",
  },
  calanderContainer: {
    backgroundColor: "green",
    width: 200,
    height: 200,
  },
  calendarListContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    padding: 12,
    // backgroundColor: "red",
  },
  box: {
    width: "48%",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
    padding: 12,
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
