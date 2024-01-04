// import { useNavigation } from "expo-router";
import { Button, Image, Text, TouchableOpacity, View } from "react-native";
import { storage } from "../../firebase";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";

import { useEffect, useState } from "react";
export default function RatingPage({ navigation }) {
  const [datajson, setDatajson] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);

  //this function returns the new rating of the player
  function calculateEloRating(playerRating, opponentRating, outcome) {
    // Constants
    const kFactor = 32; // Adjust this value based on desired sensitivity

    // Expected probability of winning for the player
    const expectedOutcome =
      1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));

    // Update the player's rating based on the outcome
    const newRating = playerRating + kFactor * (outcome - expectedOutcome);

    return Math.round(newRating);
  }

  //this function gets two random index
  function generateRandomNumbers(endingValue) {
    if (endingValue <= 0) {
      throw new Error("Ending value must be greater than 0");
    }

    let randomNumber1 = Math.floor(Math.random() * (endingValue + 1));
    let randomNumber2;

    // Ensure the second random number is different from the first one
    do {
      randomNumber2 = Math.floor(Math.random() * (endingValue + 1));
    } while (randomNumber2 === randomNumber1);

    return [randomNumber1, randomNumber2];
  }

  const uploadimage = () => {
    if (selectedImage == null) return;
    const imageref = ref(storage, `images/${selectedImage.name + v4()}`);
    const db = getFirestore();
    const colref = collection(db, "images");
    uploadBytes(imageref, selectedImage).then(() => {
      alert("image uploaded");
      getDownloadURL(imageref)
        .then((url) => {
          addDoc(colref, {
            imgurl: url,
            rating: 3000,
            probability: 0.5,
          });
        })
        .catch((er) => {
          console.log(er);
        });
    });
  };

  const fetchDoc = async () => {
    try {
      const db = getFirestore();
      const datafromdb = collection(db, "images");
      const snapshot = await getDocs(datafromdb);

      const randomindex = generateRandomNumbers(snapshot.size - 1);
      console.log(randomindex);
      const newData = [
        {
          ...snapshot.docs[randomindex[0]].data(),
          id: snapshot.docs[randomindex[0]].id,
        },
        {
          ...snapshot.docs[randomindex[1]].data(),
          id: snapshot.docs[randomindex[1]].id,
        },
      ];

      setDatajson(newData);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchDoc();
  }, []);
  const setimage = (file) => {
    setSelectedImage(file);
  };
  console.log(datajson)
  return (
    <View
      className="h-full w-full "
      style={{
        flex: 1,
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <View
        className="w-full  bg-red-600 h-[100px] flex justify-center items-center pt-[30px] shadow-xl"
        style={{
          position: "absolute",
          top: 0,
          height: 100,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "red",
          paddingTop: 30,
        }}
      >
        <Text
          className="text-white text-[30px]"
          style={{ color: "white", fontSize: 30 }}
        >
          Facesmash
        </Text>
      </View>
      <View
        className="w-full h-full flex flex-col justify-center items-center "
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Text className="text-[20px] mb-2" style={{ fontSize: 20 }}>
          Who is pretty?
        </Text>
        <Text>click to choose</Text>
        <View style={{ width: "100%", flexDirection: "row", gap: 2 }}>
        
          {datajson.map((data)=>(
            <TouchableOpacity
            style={{ height: "auto", width: "auto" }}
            onPress={() => {
              // console.log("hello");
              // Navigation.navigate("learderboard")
              // navigation.navigate("leaderboard");
              let clickedimagerating;
              clickedimagerating = data.rating;
              console.log(clickedimagerating);
              const imagelostdata = datajson.filter(
                (doc) => doc.id !== data.id
              );
              let lostimagerating = imagelostdata[0].rating;

              console.log(
                "initial clicked image ration:",
                clickedimagerating
              );
              console.log("Initial lost image rating:", lostimagerating);
              clickedimagerating = calculateEloRating(
                clickedimagerating,
                lostimagerating,
                1
              );
              lostimagerating = calculateEloRating(
                lostimagerating,
                clickedimagerating,
                0
              );
              console.log(
                "updated clicked image ration:",
                clickedimagerating
              );
              console.log("updated lost image rating:", lostimagerating);
              const db = getFirestore();
              console.log(imagelostdata);
              const imagewon = doc(db, "images", data.id);
              const imagelost = doc(db, "images", imagelostdata[0].id);

              updateDoc(imagewon, {
                rating: clickedimagerating,
              }).then(() => {
                console.log("updated the value", clickedimagerating);
              });
              updateDoc(imagelost, {
                rating: lostimagerating,
              }).then(() => {
                fetchDoc();
              });
            }}
          >
            <View
              className="w-[150px] h-[250px]"
              style={{ width: 150, height: 250 }}
            >
              <Image
              className="w-full h-full"
              style={{ width: "100%", height: "100%" }}
              source={{
                uri: data.imgurl,
              }}
            />
            </View>
          </TouchableOpacity>
          ))}
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 13 }}>Try uploading your image</Text>
          <Text style={{ fontSize: 13 }}>by clicking the button below</Text>
          <TouchableOpacity
            style={{
              padding: 5,
              paddingHorizontal: 3,
              backgroundColor: "#009dff",
              marginTop: 8,
              borderRadius: 5,
            }}
          >
            <Text style={{ marginHorizontal: 5, color: "white" }}>upload</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
