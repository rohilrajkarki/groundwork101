import { Shift } from "@/database/db";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const CustomCard = (workData: Shift) => {
  const durationMs =
    new Date(workData.end).getTime() - new Date(workData.start).getTime();

  const hours = durationMs / (1000 * 60 * 60);

  // format time
  const formattedStart = new Date(workData.start).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const formattedEnd = new Date(workData.end).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  // format date
  const formattedShiftDate = new Date(workData.shiftDate).toLocaleDateString(
    [],
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );

  console.log("shift date", workData.shiftDate);
  return (
    <View style={styles.card}>
      <View style={styles.accent} />

      <View style={styles.content}>
        <Text style={styles.title}>{workData.name}</Text>

        {/* Shift Date */}
        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={16} color="#555" />

          <Text style={styles.text}>{formattedShiftDate}</Text>
        </View>

        {/* Time */}
        <View style={styles.row}>
          <Ionicons name="time-outline" size={16} color="#555" />

          <Text style={styles.text}>
            {formattedStart} - {formattedEnd} ({hours.toFixed(2)}h)
          </Text>
        </View>

        {/* Location */}
        <View style={styles.row}>
          <Ionicons name="location-outline" size={16} color="#555" />

          <Text style={styles.text} numberOfLines={1}>
            {workData.location}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CustomCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#E0E0E0",
    borderRadius: 16,
    margin: 16,
    padding: 14,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  accent: {
    width: 6,
    borderRadius: 6,
    backgroundColor: "#4285F4",
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#202124",
    marginBottom: 8,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  text: {
    fontSize: 13,
    color: "#5f6368",
    marginLeft: 6,
    flexShrink: 1,
  },
});
