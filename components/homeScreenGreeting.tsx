import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useProfile } from "@/lib/profile";
import type { Profile } from "@/types/profile";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function ProfileGreeting() {
  const { getProfile } = useProfile();
  const [profile, setProfile] = useState<Profile | null>(null);

  // 🔥 Laster profilen hver gang skjermen får fokus
  useFocusEffect(
    useCallback(() => {
      getProfile().then(setProfile);
    }, [])
  );

  const navn = profile?.navn?.trim();
  const greetingName = navn && navn.length > 0 ? navn : "";

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Hei{greetingName ? `, ${greetingName}` : ""} 👋
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
  },
  leverandør: {
    fontSize: 20,
    fontWeight: "600",
    color: "#dededeff",
  }
});
