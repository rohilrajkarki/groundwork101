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
      year: "numeric",
      month: "short",
      // day: "numeric",
      weekday: "short",
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

  const [currentFullDate, setCurrentFullDate] = useState(new Date());

  const currentMonthName = new Date().toLocaleString("default", {
    month: "long",
  });

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

  const changeMonth = currentFullDate.getMonth();
  const changeYear = currentFullDate.getFullYear();
  const today = currentFullDate.getDay();
  const numberOfDays = new Date(2026, 1);
  console.log(
    formatDate(currentFullDate),
    "number of days in month=>",
    numberOfDays,
  );
  return (
    <ScrollView
      contentContainerStyle={styles.calendarListContainer}
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.monthHeader}>
        <CustomButton title="<" onButtonPress={() => changeCurrMonth("prev")} />

        <View style={styles.titleContainer}>
          <Text style={styles.monthText}>
            {monthNames[changeMonth]}
            Days:{today}
          </Text>
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
        <View key={num} style={styles.daysBox}>
          <Text style={styles.dayText}>{currentMonthName}</Text>
          <Text style={styles.dayText}></Text>
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
