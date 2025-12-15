import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useProfile } from "@/lib/profile";
import type { Profile } from "@/types/profile";

export default function ProfileCircle() {
  const { getProfile } = useProfile();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  const initials =
    profile?.navn && profile.navn.trim().length > 0
      ? profile.navn
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "?";

  return (
    <View style={styles.circle}>
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#4e4b4bff",
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});
