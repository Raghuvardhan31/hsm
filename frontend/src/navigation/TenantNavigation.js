import React, { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Screens
import TenantHomeScreen from "../screens/tenant/TenantHomeScreen";
import IssuesScreen1 from "../screens/tenant/IssuesScreen1";
import TenantIssuesScreen from "../screens/tenant/TenantIssuesScreen";
import PaymentScreen from "../screens/tenant/PaymentScreen";
import TenantPaymentScreen from "../screens/tenant/TenantPaymentScreen";
import ProfileScreen from "../screens/tenant/TenantProfileScreen";

// Context
import { BookingContext } from "../context/BookingContext";
import COLORS from "../theme/colors";

const Tab = createBottomTabNavigator();

// Wrapper components to decide which screen to show
function IssuesWrapper() {
  const { requests = [] } = useContext(BookingContext);
  const isApproved = requests.some((r) => r.status === "accepted");
  return isApproved ? <TenantIssuesScreen /> : <IssuesScreen1 />;
}

function PaymentWrapper() {
  const { requests = [] } = useContext(BookingContext);
  const isApproved = requests.some((r) => r.status === "accepted");
  return isApproved ? <TenantPaymentScreen /> : <PaymentScreen />;
}

export default function TenantNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName = "";
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Issues") iconName = "alert-circle";
          else if (route.name === "Payment") iconName = "card";
          else if (route.name === "Profile") iconName = "person";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={TenantHomeScreen} />
      <Tab.Screen name="Issues" component={IssuesWrapper} />
      <Tab.Screen name="Payment" component={PaymentWrapper} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}