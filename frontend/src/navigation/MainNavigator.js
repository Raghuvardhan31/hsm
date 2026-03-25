import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import OwnerLoginScreen from "../screens/auth/OwnerLoginScreen";
import OwnerRegistrationScreen from "../screens/auth/OwnerRegistrationScreen";
import TenantLoginScreen from "../screens/auth/TenantLoginScreen";
import TenantRegisterScreen from "../screens/auth/TenantRegisterScreen";
import OwnerNavigation  from "./OwnerNavigaton";
import OwnerNotificationScreen from "../screens/owner/OwnerNotificationScreen";
import RoleSection from "./RoleSection";
import TenantNavigation from "./TenantNavigation";
import TenantNotificationScreen from "../screens/tenant/TenantNotificationScreen";



 
import TenantHomeScreen from "../screens/tenant/TenantHomeScreen";
import TenantIssuesScreen from "../screens/tenant/TenantIssuesScreen";
import TenantPaymentScreen from "../screens/tenant/TenantPaymentScreen";
import TenantProfileScreen from "../screens/tenant/TenantProfileScreen";

import PaymentScreen from "../screens/tenant/PaymentScreen";
import WaitingScreen from "../screens/auth/WaitingScreen"
const Stack = createStackNavigator();
export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      <Stack.Screen name="RoleSection" component={RoleSection} />

      <Stack.Screen name="TenantLoginScreen" component={TenantLoginScreen} />

      <Stack.Screen name="OwnerLoginScreen" component={OwnerLoginScreen} />

      <Stack.Screen
        name="TenantRegisterScreen"
        component={TenantRegisterScreen}
      />

      <Stack.Screen
        name="OwnerRegistrationScreen"
        component={OwnerRegistrationScreen}
      />

      <Stack.Screen name="OwnerNavigation" component={OwnerNavigation} />

      <Stack.Screen name="TenantNavigation" component={TenantNavigation} />

      <Stack.Screen name="TenantHomeScreen" component={TenantHomeScreen} />
      <Stack.Screen
  name="OwnerNotificationScreen"
  component={OwnerNotificationScreen}
/>
<Stack.Screen
  name="TenantNotification"
  component={TenantNotificationScreen}
/>

      {/* ✅ KEEP ONLY ONE */}
      <Stack.Screen name="IssuesScreen" component={TenantIssuesScreen} />

      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />

      <Stack.Screen name="ProfileScreen" component={TenantProfileScreen} />
        <Stack.Screen name="WaitingScreen" component={WaitingScreen} />

    </Stack.Navigator>
  );
}