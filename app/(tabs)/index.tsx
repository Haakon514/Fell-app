import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProfileCircle from "../../components/profileCircle";
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
    <SafeAreaView style={styles.container} edges={["top", "bottom"]} mode="padding">
      
      {/* Profile Button */}
      <TouchableOpacity
        style={[styles.profileWrapper, { top: insets.top + 10 }]}
        onPress={() => router.push("/profile")}
      >
        <ProfileCircle
          
        />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={[
          styles.cardsContainer,
          {
            paddingTop: insets.top + 110,
            paddingBottom: insets.bottom + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.clickableCards}>

          <RecentNumbersCard />

          <View style={styles.row}>
            
            {/* REGLEMENT */}
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

            {/* VOLUM */}
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

          {/* SESSIONS */}
          <Link href="/sessions" asChild>
            <TouchableOpacity style={styles.sessionsCard}>
              <LinearGradient
                colors={GRADIENT_CARD}
                style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
              />
              <MaterialCommunityIcons name="clock" size={30} color="#fff" />
              <Text style={styles.smallTitle}>Økter</Text>
            </TouchableOpacity>
          </Link>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#0f0f0f",
  },

  profileWrapper: {
    position: "absolute",
    left: 20,
    zIndex: 100,
  },

  cardsContainer: {
    paddingHorizontal: 20,
    gap: 22,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  clickableCards: {
    gap: 15,
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
