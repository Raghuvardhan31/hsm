import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BookingContext } from "@/src/context/BookingContext";

const TenantNotificationScreen = () => {
  const { requests, setRequests } = useContext(BookingContext);

  // MARK ALL AS SEEN
  useEffect(() => {
    const updated = requests.map((item) => {
      if (
        (item.status === "accepted" || item.status === "rejected") &&
        !item.seen
      ) {
        return { ...item, seen: true };
      }
      return item;
    });

    setRequests(updated);
  }, []);

  // Notification Data
  const getData = (item) => {
    if (item.status === "accepted") {
      return {
        title: "Booking Confirmed",
        message: "Your request has been approved",
        icon: "checkmark",
        bg: "#E9F9EE",
        color: "#27ae60",
      };
    }
    if (item.status === "rejected") {
      return {
        title: "Booking Rejected",
        message: "Your request was not accepted",
        icon: "close",
        bg: "#FDECEA",
        color: "#e74c3c",
      };
    }
    return {
      title: "Pending Request",
      message: "Waiting for owner approval",
      icon: "time",
      bg: "#FFF4E5",
      color: "#f39c12",
    };
  };

  // Sort latest first
  const sortedRequests = [...requests].reverse();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {sortedRequests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-outline" size={50} color="#bbb" />
            <Text style={styles.noData}>No notifications yet</Text>
          </View>
        ) : (
          sortedRequests.map((item) => {
            const data = getData(item);

            return (
              <View
                key={item.id}
                style={[
                  styles.card,
                  !item.seen && styles.unseenCard,
                ]}
              >
                <View style={[styles.iconBox, { backgroundColor: data.bg }]}>
                  <Ionicons name={data.icon} size={18} color={data.color} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{data.title}</Text>
                  <Text style={styles.message}>{data.message}</Text>
                  <Text style={styles.name}>
                    {item.propertyName || item.name}
                  </Text>
                </View>

                {/* Unread Dot */}
                {!item.seen && <View style={styles.dot} />}

                <Ionicons name="chevron-forward" size={18} color="#ccc" />
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },

  header: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 6,
    padding: 14,
    borderRadius: 12,
  },

  unseenCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#4a6cf7",
    backgroundColor: "#f0f4ff",
  },

  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },

  message: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },

  name: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff3b30",
    marginRight: 8,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },

  noData: {
    marginTop: 10,
    color: "#999",
    fontSize: 14,
  },
});

export default TenantNotificationScreen;