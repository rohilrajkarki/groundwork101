import CustomCard from "@/components/customCard";
import { getAllShifts, getTodaysShifts, Shift } from "@/database/db";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function Index() {
  // const workData = [1, 2, 3];

  const [workData, setWorkData] = useState<Shift[]>([]);
  const [todaysData, setTodaysData] = useState<Shift[]>([]);

  const loadShifts = async () => {
    const data = await getAllShifts();

    const todaysData = await getTodaysShifts();
    setTodaysData(todaysData);
    setWorkData(data);

    // console.log("getting shifts data:", data);
    console.log("Todays shift:", todaysData);
  };

  useFocusEffect(
    useCallback(() => {
      loadShifts();
    }, []),
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Home screen */}

        {todaysData.map((todaysData) => {
          console.log("todaysdata here:", todaysData.id);
          return <CustomCard {...todaysData} key={todaysData.id} />;
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
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
