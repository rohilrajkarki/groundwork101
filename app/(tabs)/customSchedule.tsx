import CustomButton from "@/components/customButton";
import { insertShift } from "@/database/db";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// type WorkData = {
//   id: number;
//   title: string;
//   name: string;
//   start: string;
//   end: string;
//   location: string;
//   rate: number;
// };

// type CustomScheduleProps = {
//   workData: WorkData[];
// };

// const CustomSchedule = ({ workData }: CustomScheduleProps) => {

type FormData = {
  name: string;
  location: string;
  rate: number;
  start: string;
  end: string;
  shiftDate: string;
  notes: string;
  createdAt?: string;
};

type CustomScheduleProps = {
  title?: string;
  isFloating?: boolean;
};

const CustomSchedule = ({
  title = "Add Item",
  isFloating = false,
}: CustomScheduleProps) => {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    location: "",
    rate: 0,
    start: "",
    end: "",
    shiftDate: "",
    notes: "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // const payload = {
      //   ...formData,
      // };

      await insertShift(formData);

      Alert.alert("Success", "Product added successfully");

      setFormData({
        name: "",
        location: "",
        rate: 0,
        start: "",
        end: "",
        shiftDate: "",
        notes: "",
      });
    } catch (error) {
      console.error("Insert failed:", error);
      Alert.alert("Database Error", "Failed to save the product.");
    }
  };

  return (
    <View
      style={isFloating ? styles.floatingContainer : styles.inlineContainer}
    >
      <CustomButton title={title} onButtonPress={setShowModal} />

      <Modal visible={showModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.overlay}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Add Work Shift</Text>

                <Text style={styles.label}>Name</Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(text) => handleInputChange("name", text)}
                  placeholder="Enter name"
                  style={styles.input}
                />

                <Text style={styles.label}>Location</Text>
                <TextInput
                  value={formData.location}
                  onChangeText={(text) => handleInputChange("location", text)}
                  placeholder="Enter location"
                  style={styles.input}
                />

                <Text style={styles.label}>Hourly Rate ($)</Text>
                <TextInput
                  value={formData.rate.toString()}
                  onChangeText={(text) => handleInputChange("rate", text)}
                  placeholder="Enter hourly rate"
                  keyboardType="numeric"
                  style={styles.input}
                />

                <Text style={styles.label}>Start Time</Text>
                <TextInput
                  value={formData.start}
                  onChangeText={(text) => handleInputChange("start", text)}
                  placeholder="6:00 AM"
                  style={styles.input}
                />

                <Text style={styles.label}>End Time</Text>
                <TextInput
                  value={formData.end}
                  onChangeText={(text) => handleInputChange("end", text)}
                  placeholder="1:45 PM"
                  style={styles.input}
                />

                <View style={styles.buttonRow}>
                  <Pressable
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSave}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default CustomSchedule;

const styles = StyleSheet.create({
  inlineContainer: {
    marginVertical: 10,
    alignSelf: "center",
  },

  floatingContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
    zIndex: 1000,
    elevation: 8,
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },

  modalContainer: {
    width: "90%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 10,
  },

  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  cancelButton: {
    backgroundColor: "#999",
  },

  saveButton: {
    backgroundColor: "#007AFF",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    marginLeft: 4,
  },
});
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#25292e",
//     padding: 16,
//   },

//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//   },

//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
// });
