import { Shift } from "@/database/db";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import CustomButton from "./customButton";

interface CustomCalendarProps {
  allShifts: Shift[];
}

const CustomCalendar = ({ allShifts }: CustomCalendarProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const numbers = Array.from({ length: 30 }, (_, i) => i + 1);

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

  const currYear = new Date().getFullYear();
  const currMonth = new Date().getMonth();

  const [selectedMonth, setSelectedMonth] = useState(currMonth);
  const currentMonthName = new Date().toLocaleString("default", {
    month: "long",
  });

  console.log(currentMonthName);
  const changeCurrMonth = (text?: string) => {
    console.log("changemonth", text);
    if (text === "prev") {
      setSelectedMonth((prev) => prev - 1);
    } else if (text === "next") {
      setSelectedMonth((prev) => prev + 1);
    }

    if (selectedMonth <= 0) {
      setSelectedMonth(11);
    } else if (selectedMonth >= 11) {
      setSelectedMonth(0);
    }
  };
  return (
    <ScrollView
      contentContainerStyle={styles.calendarListContainer}
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.monthHeader}>
        <CustomButton title="<" onButtonPress={() => changeCurrMonth("prev")} />

        <View style={styles.titleContainer}>
          <Text style={styles.monthText}>{monthNames[selectedMonth]}</Text>
          <Text style={styles.yearText}>{currYear}</Text>
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
        <View key={num} style={styles.daysBox}>
          <Text style={styles.dayText}>{currentMonthName}</Text>
        </View>
      ))}
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
    backgroundColor: "green",
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
    backgroundColor: "red",
  },
  box: {
    width: "48%",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
    padding: 12,
  },
});
