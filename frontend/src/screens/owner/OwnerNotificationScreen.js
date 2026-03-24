// import React, { useEffect, useState, useContext } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   TouchableOpacity,
//   StatusBar,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context"; // ✅ IMPORTANT
// import { TenantContext } from "@/src/context/TenantContext";
// import { BookingContext } from "@/src/context/BookingContext";
// import { Ionicons } from "@expo/vector-icons";

// const OwnerNotificationScreen = ({ route }) => {
//   const routeEmail = route?.params?.email;
//   const { tenantEmail } = useContext(TenantContext);
//   const email = routeEmail || tenantEmail;

//   const { setRequests: setGlobalRequests } = useContext(BookingContext);

//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   if (!email) {
//     return (
//       <View style={styles.loading}>
//         <Text>No email provided. Please login first.</Text>
//       </View>
//     );
//   }

//   const fetchRequests = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `http://192.168.1.15:8000/api/tenantdetails/${encodeURIComponent(email)}/`
//       );
//       const text = await res.text();

//       let data;
//       try {
//         data = JSON.parse(text);
//       } catch {
//         Alert.alert("Error", "Invalid server response");
//         setRequests([]);
//         return;
//       }

//       setRequests(data);
//       setGlobalRequests(data);
//     } catch (error) {
//       Alert.alert("Error", "Cannot reach server");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, [email]);

//   const handleAction = (action, id) => {
//     const updated = requests.map((item) =>
//       item.id === id ? { ...item, status: action } : item
//     );

//     setRequests(updated);
//     setGlobalRequests(updated);

//     Alert.alert(
//       action === "accepted" ? "Accepted ✅" : "Rejected ❌",
//       `Booking ${action}`
//     );
//   };

//   const getStatusColor = (status) => {
//     if (status === "accepted") return "#2ecc71";
//     if (status === "rejected") return "#e74c3c";
//     return "#f39c12";
//   };

//   if (loading) {
//     return (
//       <View style={styles.loading}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />

//       {/* 🔥 HEADER */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Requests</Text>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {requests.length === 0 ? (
//           <Text style={styles.noData}>No Requests</Text>
//         ) : (
//           requests.map((item) => (
//             <View key={item.id} style={styles.card}>
              
//               {/* Top Row */}
//               <View style={styles.row}>
//                 <Text style={styles.name}>{item.name}</Text>

//                 <View
//                   style={[
//                     styles.statusBadge,
//                     { backgroundColor: getStatusColor(item.status) },
//                   ]}
//                 >
//                   <Text style={styles.statusText}>
//                     {item.status || "pending"}
//                   </Text>
//                 </View>
//               </View>

//               {/* Details */}
//               <Text style={styles.text}>📞 {item.phone}</Text>
//               <Text style={styles.text}>📧 {item.email}</Text>
//               <Text style={styles.text}>👤 {item.gender}</Text>

//               {/* Buttons */}
//               {!item.status && (
//                 <View style={styles.buttons}>
//                   <TouchableOpacity
//                     style={[styles.btn, styles.acceptBtn]}
//                     onPress={() => handleAction("accepted", item.id)}
//                   >
//                     <Ionicons name="checkmark" size={18} color="#fff" />
//                     <Text style={styles.btnText}>Accept</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={[styles.btn, styles.rejectBtn]}
//                     onPress={() => handleAction("rejected", item.id)}
//                   >
//                     <Ionicons name="close" size={18} color="#fff" />
//                     <Text style={styles.btnText}>Reject</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>
//           ))
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#f7f8fa",
//   },

//   header: {
//     padding: 15,
//     backgroundColor: "#fff",
//     borderBottomWidth: 0.5,
//     borderBottomColor: "#ddd",
//   },

//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },

//   card: {
//     backgroundColor: "#fff",
//     margin: 12,
//     padding: 15,
//     borderRadius: 12,
//   },

//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },

//   name: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },

//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 20,
//   },

//   statusText: {
//     color: "#fff",
//     fontSize: 12,
//     textTransform: "capitalize",
//   },

//   text: {
//     fontSize: 13,
//     color: "#555",
//     marginTop: 2,
//   },

//   buttons: {
//     flexDirection: "row",
//     marginTop: 12,
//     justifyContent: "space-between",
//   },

//   btn: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 8,
//     paddingHorizontal: 18,
//     borderRadius: 8,
//   },

//   acceptBtn: {
//     backgroundColor: "#2ecc71",
//   },

//   rejectBtn: {
//     backgroundColor: "#e74c3c",
//   },

//   btnText: {
//     color: "#fff",
//     marginLeft: 5,
//     fontWeight: "600",
//   },

//   noData: {
//     textAlign: "center",
//     marginTop: 50,
//     color: "#888",
//   },

//   loading: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// export default OwnerNotificationScreen;

import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { TenantContext } from "@/src/context/TenantContext";
import { BookingContext } from "@/src/context/BookingContext";
import { Ionicons } from "@expo/vector-icons";

const OwnerNotificationScreen = ({ route }) => {
  const routeEmail = route?.params?.email;
  const { tenantEmail } = useContext(TenantContext);
  const email = routeEmail || tenantEmail;

  const { setRequests: setGlobalRequests } = useContext(BookingContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!email) {
    return (
      <View style={styles.loading}>
        <Text>No email provided. Please login first.</Text>
      </View>
    );
  }

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://192.168.1.45:8000/api/tenantdetails/${encodeURIComponent(email)}/`
      );

      const data = await res.json();

      setRequests(data);
      setGlobalRequests(data);
    } catch (error) {
      Alert.alert("Error", "Cannot reach server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [email]);

  const handleAction = async (action, id) => {
    try {
      await fetch("http://192.168.1.45:8000/api/update_status/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          status: action,
        }),
      });

      // Update locally also
      const updated = requests.map((item) =>
        item.id === id ? { ...item, status: action } : item
      );

      setRequests(updated);
      setGlobalRequests(updated);

      Alert.alert(
        action === "accepted" ? "Accepted ✅" : "Rejected ❌",
        `Booking ${action}`
      );
    } catch (error) {
      Alert.alert("Error updating status");
    }
  };

  const getStatusColor = (status) => {
    if (status === "accepted") return "#22c55e";
    if (status === "rejected") return "#ef4444";
    return "#f39c12";
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Requests</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {requests.length === 0 ? (
          <Text style={styles.noData}>No Requests</Text>
        ) : (
          requests.map((item) => {
            const status = (item.status || "pending").toLowerCase();

            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.name}>{item.name}</Text>

                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(status) },
                    ]}
                  >
                    <Text style={styles.statusText}>{status}</Text>
                  </View>
                </View>

                <Text style={styles.text}>📞 {item.phone}</Text>
                <Text style={styles.text}>📧 {item.email}</Text>
                <Text style={styles.text}>👤 {item.gender}</Text>

                {/* Buttons */}
                {status === "pending" ? (
                  <View style={styles.buttons}>
                    <TouchableOpacity
                      style={[styles.btn, styles.acceptBtn]}
                      onPress={() => handleAction("accepted", item.id)}
                    >
                      <Ionicons name="checkmark" size={18} color="#fff" />
                      <Text style={styles.btnText}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.btn, styles.rejectBtn]}
                      onPress={() => handleAction("rejected", item.id)}
                    >
                      <Ionicons name="close" size={18} color="#fff" />
                      <Text style={styles.btnText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text
                    style={{
                      marginTop: 10,
                      fontWeight: "600",
                      color:
                        status === "accepted" ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {status === "accepted"
                      ? "Tenant Approved"
                      : "Tenant Rejected"}
                  </Text>
                )}
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
    backgroundColor: "#f4f6f8",
  },

  header: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  card: {
    backgroundColor: "#ffffff",
    marginHorizontal: 12,
    marginTop: 12,
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  text: {
    fontSize: 13,
    color: "#4b5563",
    marginTop: 3,
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  btn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  acceptBtn: {
    backgroundColor: "#22c55e",
  },

  rejectBtn: {
    backgroundColor: "#ef4444",
  },

  btnText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
  },

  noData: {
    textAlign: "center",
    marginTop: 60,
    color: "#9ca3af",
    fontSize: 14,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default OwnerNotificationScreen;
