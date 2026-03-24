import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import OwnerHomeScreen from "../screens/owner/OwnerHomeScreen";
import OwnerIssuesScreen from "../screens/owner/OwnerIssuesScreen";
import OwnerPaymentScreen from "../screens/owner/OwnerPaymentScreen";
import OwnerProfileScreen from "../screens/owner/OwnerProfileScreen";
import { BookingContext } from "../context/BookingContext";

import COLORS from "../theme/colors";

const Tab = createBottomTabNavigator();

export default function OwnerNavigation({ route }) {
 
const { requests } = useContext(BookingContext);
  // Count pending requests for badge
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName = "";
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Payment") iconName = "card";
          else if (route.name === "Issues") iconName = "alert-circle";
          else if (route.name === "Profile") iconName = "person";

          // Add badge only for Issues tab
          if (route.name === "Issues" && pendingCount > 0) {
            return (
              <View>
                <Ionicons name={iconName} size={size} color={color} />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{pendingCount}</Text>
                </View>
              </View>
            );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={OwnerHomeScreen} />
      <Tab.Screen name="Issues" component={OwnerIssuesScreen} />
      <Tab.Screen name="Payment" component={OwnerPaymentScreen} />
      <Tab.Screen name="Profile" component={OwnerProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "red",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});