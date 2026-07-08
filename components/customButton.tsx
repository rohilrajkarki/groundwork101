import { Pressable, StyleSheet, Text, View } from "react-native";

type CustomButtonProps = {
  title: string;
  onButtonPress: (value: boolean) => void;
};
const CustomButton = ({
  title = "click here",
  onButtonPress,
}: CustomButtonProps) => {
  return (
    <View>
      <Pressable
        onPress={() => onButtonPress(true)}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        {/* <Text style={styles.plusIcon}>+</Text> */}
        {title && <Text style={styles.text}>{title}</Text>}
      </Pressable>
    </View>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    backgroundColor: "#007AFF", // Modern blue
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25, // Rounded pill shape
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }], // Slight shrink effect when tapped
  },
  plusIcon: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
  },
  text: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
