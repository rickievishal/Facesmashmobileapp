import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const Leaderboard = () => {
  function sortArrayOfObjectsDescending(arr, variable) {
    // Check if the array is not empty and contains objects
    if (arr.length === 0 || typeof arr[0][variable] === "undefined") {
      // Return a copy of the original array to avoid modification
      return [...arr];
    }

    // Use the Array.sort() method with a custom comparator function
    const sortedArray = arr.slice().sort((a, b) => {
      // Compare the values of the specified variable in descending order
      return b[variable] - a[variable];
    });

    return sortedArray;
  }

  const [datajson, setDataJson] = useState([]);

  useEffect(() => {
    const getJson = async () => {
      try {
        const db = getFirestore();
        const datafromdb = collection(db, "images");
        const snapshot = await getDocs(datafromdb);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const sortedData = sortArrayOfObjectsDescending(data, "rating");

        setDataJson(sortedData);
      } catch (err) {
        console.log(err);
      }
    };

    getJson();
  }, []);

  console.log(datajson);
  return (
    // <ScrollView>
    //   {datajson.map((data) => (
    //     <View
    //       key={data.id}
    //       style={{ width: "30%", height: 200, backgroundColor: "red" }}
    //     >
    //       <Image
    //         source={{ uri: data.imgurl }}
    //         style={{ width: "100%", height: "100%" }}
    //       />
    //     </View>
    //   ))}
    // </ScrollView>
    <FlatList
    data={datajson}
    numColumns={2}
    keyExtractor={(data) => data.id}
    renderItem={({ item, index }) => (
      <View style={styles.gridItem}>
        <View style={styles.round}>
          <Text style={styles.text}>
            #{index + 1}
          </Text>
        </View>
        <Image source={{ uri: item.imgurl }} style={styles.image} />
      </View>
    )}
  />
);
};

const styles = StyleSheet.create({
gridItem: {
  flex: 1,
  margin: 2,
  alignItems: "center",
  position: "relative",
},
round: {
  width: 40,
  height: 40,
  borderRadius: 20,
  position: "absolute",
  top: 10,
  left: 10,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "white",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,

  zIndex: 10,
},
text: {
  fontSize: 16,
  fontWeight: "bold",
  color:"red"
},
image: {
  width: "100%",
  height: 300,
},
});
export default Leaderboard;
