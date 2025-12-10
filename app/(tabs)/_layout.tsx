import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Octicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
    
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",

          backgroundColor: "#fff",

          // 🔑 Rounded only on top
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,

          height: 60, // give it thickness
          paddingBottom: 10,
          paddingTop: 10,

          borderWidth: 0, // remove border
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
