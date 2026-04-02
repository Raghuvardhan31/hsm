import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

export default function WaitingScreen({ navigation, route }) {
  const email = route?.params?.email || "";
  const [timeLeft, setTimeLeft] = useState(0);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  const removeReason = async () => {
    try {
      if (!email) return false;

      const res = await fetch(
        `http://192.168.1.28:8000/api/get_suspension_reason/${email}/`,
        {
          method: "DELETE",
        }
      );

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok) {
        console.log("Reason deleted:", data);
        return true;
      } else {
        console.log("Delete failed:", data);
        return false;
      }
    } catch (err) {
      console.log("Delete error:", err);
      return false;
    }
  };

  const handleReRegister = async () => {
    const deleted = await removeReason();

    if (deleted) {
      navigation.replace("OwnerRegistrationScreen");
    } else {
      Alert.alert("Error", "Failed to delete suspension reason");
    }
  };

  const fetchReason = async () => {
    try {
      if (!email) return;

      const res = await fetch(
        `http://192.168.1.28:8000/api/get_suspension_reason/${email}/`
      );

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      console.log("Reason API response:", data);

      if (res.ok) {
        setReason(data.reason || "");
      } else {
        setReason("");
      }
    } catch (err) {
      console.log("fetchReason error:", err);
      setReason("");
    }
  };

  const fetchStatus = async () => {
    try {
      if (!email) return;

      const res = await fetch(
        `http://192.168.1.28:8000/api/check-owner-status/${email}/`
      );

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      console.log("Status API response:", data);

      if (data.status === "active") {
        navigation.replace("OwnerLoginScreen");
        return;
      }

      setTimeLeft(Number(data.time_left_seconds) || 0);
    } catch (err) {
      console.log("fetchStatus error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!email) {
      Alert.alert("Error", "Email not found");
      setLoading(false);
      return;
    }

    fetchStatus();
    fetchReason();

    const statusInterval = setInterval(() => {
      fetchStatus();
      fetchReason();
    }, 10000);

    return () => clearInterval(statusInterval);
  }, [email]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formatTime = (value) => String(value).padStart(2, "0");

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {reason ? (
        <View style={styles.reasonContainer}>
          <Text style={styles.title}>Account Suspended</Text>
          <Text style={styles.reasonText}>Reason: {reason}</Text>

          <TouchableOpacity
            style={styles.reRegisterButton}
            onPress={handleReRegister}
          >
            <Text style={styles.reRegisterButtonText}>Re-Register</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Image
            source={require("../../../assets/images/hourglass.png")}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.title}>Account Under Review</Text>

          <Text style={styles.subtitle}>
            We will get back to you within 2 days
          </Text>

          <Text style={styles.timer}>
            {formatTime(hours)}h : {formatTime(minutes)}m : {formatTime(seconds)}s
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
    paddingHorizontal: 20,
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
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: "#131724",
    textAlign: "center",
  },
  timer: {
    marginTop: 20,
    fontSize: 22,
    color: "#3094c7",
    fontWeight: "bold",
    textAlign: "center",
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