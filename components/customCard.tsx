import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const CustomCard = ({ title, start, end, location }) => {
  const calculateHours = (start, end) => {
    const parseTime = (time) => {
      const [t, modifier] = time.split(" ");
      let [hours, minutes] = t.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      return hours * 60 + minutes; // convert to minutes
    };

    const startMinutes = parseTime(start);
    const endMinutes = parseTime(end);

    const diff = endMinutes - startMinutes;

    return `${diff / 60}h`;
  };

  const hours = calculateHours(start, end);

  return (
    <View style={styles.card}>
      {/* Left accent bar */}
      <View style={styles.accent} />

      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.title}>{title}</Text>

        {/* Time Row */}
        <View style={styles.row}>
          <Ionicons name="time-outline" size={16} color="#555" />
          <Text style={styles.text}>
            {start} - {end} ({hours})
          </Text>
        </View>

        {/* Location Row */}
        <View style={styles.row}>
          <Ionicons name="location-outline" size={16} color="#555" />
          <Text style={styles.text} numberOfLines={1}>
            {location}
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
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    padding: 14,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  accent: {
    width: 6,
    borderRadius: 6,
    backgroundColor: "#4285F4", // Google blue style
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
