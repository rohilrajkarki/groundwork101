import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

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
const CustomSchedule = ({ title = "Add Item", isFloating = false }) => {

  const [showModal, setShowModal] = useState(false)
  return (

    // <View style={styles.container}>
    //   <FlatList
    //     data={workData}
    //     keyExtractor={(item) => item.id.toString()}
    //     renderItem={({ item }) => (
    //       <View style={styles.card}>
    //         <Text style={styles.title}>{item.title}</Text>
    //         <Text>Role: {item.name}</Text>
    //         <Text>
    //           {item.start} - {item.end}
    //         </Text>
    //         <Text>Location: {item.location}</Text>
    //         <Text>Rate: ${item.rate}/hr</Text>
    //       </View>
    //     )}
    //   />
    // </View>

    <View style={isFloating ? styles.floatingContainer : styles.inlineContainer}>
      <Pressable
        onPress={() => setShowModal(true)}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressed
        ]}
      >
        <Text style={styles.plusIcon}>+</Text>
        {title && <Text style={styles.text}>{title}</Text>}
      </Pressable>

      {showModal &&
        <Modal>
          <Text>hello</Text>
          <Pressable onPress={() => setShowModal(false)}>
            <Text> Close Modal</Text></Pressable>
        </Modal>
        // <CustomCard
        //   title="Work Shift"
        //   start="6:00 AM"
        //   end="1:45 PM"
        //   // hours="8h"
        //   location="Aegis"
        // // key={workData}
        // />
      }
    </View>
  );
}


export default CustomSchedule;

const styles = StyleSheet.create({
  inlineContainer: {
    marginVertical: 10,
    alignSelf: 'center',
  },
  floatingContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    zIndex: 1000,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    // Shadow for Android
    elevation: 8,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#007AFF', // Modern blue
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25, // Rounded pill shape
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }], // Slight shrink effect when tapped
  },
  plusIcon: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
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
