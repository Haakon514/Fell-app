import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Octicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          shadowColor: "#5B78F4",
          position: "absolute",
          margin: 20, // 👈 sit at the bottom
          backgroundColor: "#ffffffff",
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
          borderColor: "#f5f6fcff",
          borderRadius: 100
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Octicons
              name={focused ? "home-fill" : "home"}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profil",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tabs>
  );
}
