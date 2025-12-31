import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HomeScreenGreeting from "../../components/homeScreenGreeting";
import { LinearGradient } from "expo-linear-gradient";
import RecentNumbersCard from "@/components/recentNumbersCard";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useProfile } from "@/lib/profile";
import type { Profile } from "@/types/profile";

const GRADIENT_CARD = ["#27272aff", "#1a191cff"];

export default function HomeScreen() {
  const { getProfile } = useProfile();
  const [profile, setProfile] = useState<Profile | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header (fixed) */}
      <View style={[styles.topSection, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity onPress={() => router.push("/profile")} activeOpacity={0.85}>
          <HomeScreenGreeting />
        </TouchableOpacity>

        {/* Buttons */}
        <View style={styles.row}>
          <Link href="/reglement" asChild>
            <TouchableOpacity style={styles.smallCard} activeOpacity={0.85}>
              <LinearGradient
                colors={GRADIENT_CARD}
                style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
              />
              <MaterialCommunityIcons name="book" size={28} color="#fff" />
              <Text style={styles.smallTitle}>Reglement</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/volume" asChild>
            <TouchableOpacity style={styles.smallCard} activeOpacity={0.85}>
              <LinearGradient
                colors={GRADIENT_CARD}
                style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
              />
              <MaterialCommunityIcons name="calculator" size={28} color="#fff" />
              <Text style={styles.smallTitle}>Volum</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/sessions" asChild>
            <TouchableOpacity style={styles.smallCard} activeOpacity={0.85}>
              <LinearGradient
                colors={GRADIENT_CARD}
                style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
              />
              <MaterialCommunityIcons name="clock" size={28} color="#fff" />
              <Text style={styles.smallTitle}>Økter</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Body (single scroll - smooth) */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        bounces
      >
        <RecentNumbersCard />
        {/* Add more cards/sections here later without changing structure */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },

  topSection: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
    // subtle separation so it feels like a sticky header
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  smallCard: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    minHeight: 76,
  },

  smallTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#fff",
    marginTop: 6,
    opacity: 0.95,
    textAlign: "center",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 12,
  },
});
