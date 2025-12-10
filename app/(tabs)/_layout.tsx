import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Octicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1a185bff",
        header: () => null,
        tabBarShowLabel: false,

        tabBarStyle: {
          position: "absolute",
          bottom: 50,
          paddingHorizontal: 20,
          marginHorizontal: 20,

          height: 65,
          borderRadius: 35,

          backgroundColor: "#ffffffff",

          borderWidth: 2,
          borderColor: "#d5d5d8ff",

          // Shadow / elevation
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 6,

          paddingBottom: 10,
          paddingTop: 10,
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
