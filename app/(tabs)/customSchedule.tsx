import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

type WorkData = {
  id: number;
  title: string;
  name: string;
  start: string;
  end: string;
  location: string;
  rate: number;
};

type CustomScheduleProps = {
  workData: WorkData[];
};

const CustomSchedule = ({ workData }: CustomScheduleProps) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={workData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>

            <Text>Role: {item.name}</Text>
            <Text>
              {item.start} - {item.end}
            </Text>
            <Text>Location: {item.location}</Text>
            <Text>Rate: ${item.rate}/hr</Text>
          </View>
        )}
      />
    </View>
  );
};

export default CustomSchedule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
