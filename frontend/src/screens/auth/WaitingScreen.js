// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import LottieView from "lottie-react-native";

// export default function WaitingScreen({ navigation }) {
//   const [timeLeft, setTimeLeft] = useState(0);

//   const email = global.ownerEmail;

//   useEffect(() => {
//     const interval = setInterval(async () => {
//       try {
//         const res = await fetch(
//           `http://192.168.1.13:8000/api/check-owner-status/${email}/`
//         );

//         const data = await res.json();

//         if (data.status === "active") {
//           navigation.replace("OwnerLoginScreen");
//         } else {
//           setTimeLeft(data.time_left_seconds);
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   const hours = Math.floor(timeLeft / 3600);
//   const minutes = Math.floor((timeLeft % 3600) / 60);
//   const seconds = timeLeft % 60;

//   return (
//     <View style={styles.container}>
      
//       {/* 🔥 Hourglass Animation
//       <LottieView
//         source={require("../../../assets/images/animations/hourglass.json")}
//         autoPlay
//         loop
//         style={styles.animation}
//       /> */}

//       <Text style={styles.title}>Account Under Review</Text>

//       <Text style={styles.subtitle}>
//         We will get back to you within 2 days
//       </Text>

//       <Text style={styles.timer}>
//         {hours}h : {minutes}m : {seconds}s
//       </Text>

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#2b395a",
//   },
//   animation: {
//     width: 200,
//     height: 200,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#fff",
//     marginTop: 10,
//   },
//   subtitle: {
//     marginTop: 10,
//     color: "#cbd5f5",
//   },
//   timer: {
//     marginTop: 20,
//     fontSize: 20,
//     color: "#38bdf8",
//     fontWeight: "bold",
//   },
// });





// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Animated,
//   Easing,
// } from "react-native";

// export default function WaitingScreen({ navigation }) {
//   const [timeLeft, setTimeLeft] = useState(0);

//   const email = global.ownerEmail;

//   // 🔥 Animation setup
//   const spinValue = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.timing(spinValue, {
//         toValue: 1,
//         duration: 2000,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       })
//     ).start();
//   }, []);

//   const spin = spinValue.interpolate({
//     inputRange: [0, 1],
//     outputRange: ["0deg", "360deg"],
//   });

//   // 🔥 API call
//   useEffect(() => {
//     const interval = setInterval(async () => {
//       try {
//         const res = await fetch(
//           `http://192.168.1.13:8000/api/check-owner-status/${email}/`
//         );

//         const data = await res.json();

//         if (data.status === "active") {
//           navigation.replace("OwnerLoginScreen");
//         } else {
//           setTimeLeft(data.time_left_seconds);
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   const hours = Math.floor(timeLeft / 3600);
//   const minutes = Math.floor((timeLeft % 3600) / 60);
//   const seconds = timeLeft % 60;

//   return (
//     <View style={styles.container}>
      
//       {/* 🔥 Hourglass Image Animation */}
//       <Animated.Image
//         source={require("../../../assets/images/hourglass.png")}
//         style={[styles.image, { transform: [{ rotate: spin }] }]}
//       />

//       <Text style={styles.title}>Account Under Review</Text>

//       <Text style={styles.subtitle}>
//         We will get back to you within 2 days
//       </Text>

//       <Text style={styles.timer}>
//         {hours}h : {minutes}m : {seconds}s
//       </Text>

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#2b395a",
//   },
//   image: {
//     width: 120,
//     height: 120,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#fff",
//     marginTop: 10,
//   },
//   subtitle: {
//     marginTop: 10,
//     color: "#cbd5f5",
//   },
//   timer: {
//     marginTop: 20,
//     fontSize: 20,
//     color: "#38bdf8",
//     fontWeight: "bold",
//   },
// });


// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   // Animated,
//   image,
//   // Easing,
// } from "react-native";

// export default function WaitingScreen({ navigation }) {
//   const [timeLeft, setTimeLeft] = useState(0);

//   const email = global.ownerEmail;

//   // 🔥 Tilt Animation setup (instead of full rotate)
//   // const tiltValue = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(tiltValue, {
//           toValue: 1,
//           duration: 1000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(tiltValue, {
//           toValue: -1,
//           duration: 1000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   }, []);

//   const tilt = tiltValue.interpolate({
//     inputRange: [-1, 1],
//     outputRange: ["-15deg", "15deg"], // 👈 tilt angle
//   });

//   // 🔥 API call
//   useEffect(() => {
//     const interval = setInterval(async () => {
//       try {
//         const res = await fetch(
//           `http://192.168.1.6:8000/api/check-owner-status/${email}/`
//         );

//         const data = await res.json();

//         if (data.status === "active") {
//           navigation.replace("OwnerLoginScreen");
//         } else {
//           setTimeLeft(data.time_left_seconds);
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   // const hours = Math.floor(timeLeft / 3600);
//   // const minutes = Math.floor((timeLeft % 3600) / 60);
//   // const seconds = timeLeft % 60;


//   const safeTime = Number(timeLeft) || 0;

// const hours = Math.floor(safeTime / 3600);
// const minutes = Math.floor((safeTime % 3600) / 60);
// const seconds = safeTime % 60;
//   return (
//     <View style={styles.container}>
      
//       {/* 🔥 Hourglass Tilt Animation */}
//       {/* <Animated.Image
//         source={require("../../../assets/images/hourglass.png")}
//         style={[styles.image, { transform: [{ rotate: tilt }] }]}
//       /> */}

//       <Image
//   source={require("../../../assets/images/hourglass.png")}
//   style={styles.image}
// />

//       <Text style={styles.title}>Account Under Review</Text>

//       <Text style={styles.subtitle}>
//         We will get back to you within 2 days
//       </Text>

//       <Text style={styles.timer}>
//         {hours}h : {minutes}m : {seconds}s
//       </Text>

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#ffffff",
//   },
//   image: {
//     width: 140,
//     height: 140,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 30,
//     fontWeight: "bold",
//     color: "#fff",
//     marginTop: 10,
//   },
//   subtitle: {
//     marginTop: 10,
//     color: "#131724",
//   },
//   timer: {
//     marginTop: 20,
//     fontSize: 20,
//     color: "#3094c7",
//     fontWeight: "bold",
//   },
// });


import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function WaitingScreen({ navigation }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const email = global.ownerEmail;

  const fetchStatus = async () => {
    try {
      if (!email) {
        console.log("Email is missing");
        return;
      }

      const res = await fetch(
        `http://192.168.1.31:8000/api/check-owner-status/${email}/`
      );

      const data = await res.json();
      console.log("API Response:", data);

      if (data.status === "active") {
        navigation.replace("OwnerLoginScreen");
      } else {
        setTimeLeft(Number(data.time_left_seconds) || 0);
      }
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchStatus();

    const statusInterval = setInterval(() => {
      fetchStatus();
    }, 10000);

    return () => clearInterval(statusInterval);
  }, [email]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/hourglass.png")}
        style={styles.image}
      />

      <Text style={styles.title}>Account Under Review</Text>

      <Text style={styles.subtitle}>
        We will get back to you within 2 days
      </Text>

      <Text style={styles.timer}>
        {hours}h : {minutes}m : {seconds}s
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  image: {
    width: 160,   // 👈 increased size
    height: 160,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",  // 👈 fixed visibility
    marginTop: 10,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: "#131724",
  },
  timer: {
    marginTop: 20,
    fontSize: 22,
    color: "#3094c7",
    fontWeight: "bold",
  },
});