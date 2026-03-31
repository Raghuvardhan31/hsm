import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function WaitingScreen({ navigation }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [reason, setReason] = useState("");
  const email = global.ownerEmail;
    
  const fetchReason = async () => {
    try {
      if (!email) return;

      const res = await fetch(
        `http://192.168.1.28:8000/api/get_suspension_reason/${email}/`
      );

      const data = await res.json();
      setReason(data.reason || "");
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStatus = async () => {
    try {
      if (!email) return;

      const res = await fetch(
        `http://192.168.1.28:8000/api/check-owner-status/${email}/`
      );

      const data = await res.json();

      if (data.status === "active") {
        navigation.replace("OwnerLoginScreen");
      } else {
        setTimeLeft(Number(data.time_left_seconds) || 0);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchReason();

    const interval = setInterval(() => {
      fetchStatus();
      fetchReason();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <View style={styles.container}>
      {reason ? (
        <View style={styles.reasonContainer}>
          <Text style={styles.title}>Account Suspended</Text>
          <Text style={styles.reasonText}>Reason: {reason}</Text>
          <TouchableOpacity
            style={styles.reRegisterButton}
            onPress={() => navigation.replace("OwnerRegistrationScreen")}
          >
            <Text style={styles.reRegisterButtonText}>Re-Register</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
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
        </>
      )}
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
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
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
  reasonContainer: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  reasonText: {
    marginTop: 15,
    fontSize: 18,
    color: "#d9534f",
    textAlign: "center",
    fontWeight: "500",
  },
  reRegisterButton: {
    marginTop: 30,
    backgroundColor: "#3094c7",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  reRegisterButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});