import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HomeScreenGreeting from "../../components/homeScreenGreeting";
import { LinearGradient } from "expo-linear-gradient";
import RecentNumbersCard from "@/components/recentNumbersCard";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useProfile } from "@/lib/profile";
import { useEffect, useState } from "react";
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
    <SafeAreaView style={styles.container}>

      {/* 🔝 TOP SECTION — Greeting stays fixed at the top */}
      <View style={[styles.topSection]}>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <HomeScreenGreeting />
        </TouchableOpacity>

        {/* Recent numbers stays in top section, but below greeting */}
        <View>
          <RecentNumbersCard />
        </View>
      </View>

      {/* 🔽 Scrollable bottom content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollSection,
          { paddingBottom: insets.bottom }
        ]}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.row}>
          <Link href="/reglement" asChild>
            <TouchableOpacity style={styles.smallCard}>
              <LinearGradient
                colors={GRADIENT_CARD}
                style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
              />
              <MaterialCommunityIcons name="book" size={30} color="#fff" />
              <Text style={styles.smallTitle}>Reglement</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/volume" asChild>
            <TouchableOpacity style={styles.smallCard}>
              <LinearGradient
                colors={GRADIENT_CARD}
                style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
              />
              <MaterialCommunityIcons name="calculator" size={30} color="#fff" />
              <Text style={styles.smallTitle}>Volum Kalkulator</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <Link href="/sessions" asChild>
          <TouchableOpacity style={styles.sessionsCard}>
            <LinearGradient
              colors={GRADIENT_CARD}
              style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
            />
            <MaterialCommunityIcons name="clock" size={30} color="#fff" />
            <Text style={styles.smallTitle}>Hogst Økter</Text>
          </TouchableOpacity>
        </Link>

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
    marginBottom: 10,
  },

  scrollSection: {
    marginTop: 50,
    paddingHorizontal: 20,
    gap: 10,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  smallCard: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  smallTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    marginTop: 6,
    opacity: 0.95,
  },

  sessionsCard: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
