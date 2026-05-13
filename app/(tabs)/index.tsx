import CustomCard from "@/components/customCard";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {/* Home screen */}
        <CustomCard
          title="Work Shift"
          start="6:00 AM"
          end="1:45 PM"
          // hours="8h"
          location="Aegis"
        />
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
