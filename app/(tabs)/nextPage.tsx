import { StyleSheet, Text, View } from "react-native";

const NextPage = () => {
  return (
    <View style={styles.calendarGrid}>
      <Text style={styles.weekBox}>weekbox</Text>
      <View style={styles.calendarContainer}>
        {/* Wrap text inside Views for consistent grid layout sizing */}
        <View style={styles.singleBox}>
          <Text>boxes here</Text>
        </View>
        <View style={styles.singleBox}>
          <Text>boxes here</Text>
        </View>
        <View style={styles.singleBox}>
          <Text>boxes here</Text>
        </View>
        <View style={styles.singleBox}>
          <Text>boxes here</Text>
        </View>
        <View style={styles.singleBox}>
          <Text>boxes here</Text>
        </View>
        <View style={styles.singleBox}>
          <Text>boxes here</Text>
        </View>
        <View style={styles.singleBox}>
          <Text>boxes here</Text>
        </View>
        <View style={styles.singleBox}>
          <Text>boxes here</Text>
        </View>
        <View style={styles.singleBox}>
          <Text>boxes here</Text>
        </View>
        <View style={styles.singleBox}>
          <Text>boxes here</Text>
        </View>
      </View>
    </View>
  );
};

export default NextPage;

const styles = StyleSheet.create({
  calendarGrid: {
    height: "100%",
    borderWidth: 5,
    borderColor: "green",
  },
  weekBox: {
    borderColor: "purple",
    borderWidth: 5,
    width: "100%",
  },
  calendarContainer: {
    borderWidth: 5,
    borderColor: "yellow",
    flexDirection: "row", // Line items up horizontally
    flexWrap: "wrap", // Force items onto a new row when they fill the width
  },
  singleBox: {
    borderColor: "red",
    borderWidth: 5,
    width: "33.33%", // Forces exactly 3 boxes per row
    padding: 10, // Adds spacing inside the box for text
    alignItems: "center", // Centers text horizontally
  },
});
