import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProfileCircle from "../../components/profileCircle";
import { useAuth } from "@/lib/auth";
import GradientBackground from "@/components/gradientBackround";
import { LinearGradient } from "expo-linear-gradient";
import RecentNumbersCard from "@/components/recentNumbersCard";
import { SafeAreaView } from "react-native-safe-area-context";

const BLUE_CARD = ["#f8ecdcff", "#e3d8ceff"];
const PINK_CARD = ["#f8ecdcff", "#e3d0c0ff"];
const GREEN_CARD = ["#f8ecdcff", "#d4bfacff"];

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1 }}  edges={["bottom"]} >
      <View style={styles.container}>
        <GradientBackground>
          
          {/* Profile Top Left
          <TouchableOpacity
            style={styles.profileWrapper}
            onPress={() => router.push("/profile")}
          >
            <ProfileCircle
              name={user ? user.navn : null}
              leverandørNr={user ? user.leverandør_nummer : null}
            />
          </TouchableOpacity> */}

          <ScrollView contentContainerStyle={styles.cardsContainer}>
            <View style={styles.clickableCards}>
              {/* ⭐ RECENT CARD */}
              <RecentNumbersCard />

              {/* ⭐ TWO SMALL CARDS */}
              <View style={styles.row}>
                
                {/* REGLEMENT — PINK CARD */}
                <Link href="/reglement" asChild>
                  <TouchableOpacity style={styles.smallCard}>
                    <LinearGradient
                      colors={PINK_CARD}
                      style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
                    />

                    <MaterialCommunityIcons name="book" size={30} color="#fff" />
                    <Text style={styles.smallTitle}>Reglement</Text>
                  </TouchableOpacity>
                </Link>

                {/* ØKTER — GREEN CARD */}
                <Link href="/volume" asChild>
                  <TouchableOpacity style={styles.smallCard}>
                    <LinearGradient
                      colors={GREEN_CARD}
                      style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
                    />

                    <MaterialCommunityIcons name="calculator" size={30} color="#fff" />
                    <Text style={styles.smallTitle}>Volum Kalkulator</Text>
                  </TouchableOpacity>
                </Link>

              </View>
            </View>
          </ScrollView>
        </GradientBackground>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  profileWrapper: {
    position: "absolute",
    left: 20,
    top: 40,
    zIndex: 100,
  },

  cardsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 150,
    paddingBottom: 120, 
    gap: 22,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  clickableCards: {
    gap: 15,
    bottom: 100,
  },

  /* ⭐ BIG CARD WITH GRADIENT & SHADOW */
  bigCard: {
    borderRadius: 28,
    paddingVertical: 26,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    top: 50,
  },

  bigTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginTop: 4,
  },

  bigDescription: {
    fontSize: 14,
    color: "#f5f5f5",
    opacity: 0.9,
    marginTop: 6,
  },

  /* ⭐ SMALL CARDS */
  smallCard: {
    flex: 1,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  smallTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    marginTop: 6,
    opacity: 0.95,
  },
});
