import CustomCard from "@/components/customCard";
import { getAllShifts } from "@/database/db";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  // const workData = [1, 2, 3];

  const [workData, setWorkData] = useState<any[]>([]);

  const loadShifts = async () => {
    const data = await getAllShifts();
    setWorkData(data);
    console.log(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadShifts();
    }, []),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {/* Home screen */}

        {workData.map((workData) => {
          return (
            <CustomCard
              title="Work Shift"
              start="6:00 AM"
              end="1:45 PM"
              // hours="8h"
              location="Aegis"
              key={workData.id}
            />
          );
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
  },
});
