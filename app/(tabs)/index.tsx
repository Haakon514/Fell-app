import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProfileCircle from "../../components/profileCircle";
import { useAuth } from "@/lib/auth";
import RecentNumbers from "@/components/recentNumbers";
import GradientBackground from "@/components/gradientBackround";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const BLUE_CARD = ["#7BA7FF", "#4C6FE8"];
const PINK_CARD = ["#FFB4D6", "#FF6F91"];
const GREEN_CARD = ["#A8E6CF", "#56C596"];

export default function HomeScreen() {
  const { user } = useAuth();

  return (
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
            
            {/* ⭐ BIG CARD — BLUE gradient */}
            <Link href="/volume" asChild>
              <TouchableOpacity style={styles.bigCard}>
                <LinearGradient
                  colors={BLUE_CARD}
                  style={[StyleSheet.absoluteFill, { borderRadius: 28 }]}
                />

                <Text style={styles.bigTitle}>Volum Kalkulator</Text>
                <Text style={styles.bigDescription}>Regn ut volum på hogst</Text>
              </TouchableOpacity>
            </Link>

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
              <Link href="/sessions" asChild>
                <TouchableOpacity style={styles.smallCard}>
                  <LinearGradient
                    colors={GREEN_CARD}
                    style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
                  />

                  <MaterialCommunityIcons name="calendar-clock" size={30} color="#fff" />
                  <Text style={styles.smallTitle}>Økter</Text>
                </TouchableOpacity>
              </Link>

            </View>
          </View>

          {/* ⭐ RECENT CARD */}
          <Link href="/nylig" asChild>
            <TouchableOpacity style={styles.recentCard}>
              {/* Background to blur */}
              <LinearGradient
                colors={["#f8f8f9ff", "#e9e6f2ff"]}
                style={styles.recentCardBackground}
              />

              {/* Blur effect */}
              <BlurView
                intensity={30}
                tint="dark"
                experimentalBlurMethod="dimezisBlurView" // helps Android
                style={styles.recentBlur}
              >
                <RecentNumbers value={150} label="kubikk" />
              </BlurView>
            </TouchableOpacity>
          </Link>

        </ScrollView>
      </GradientBackground>
    </View>
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
    gap: 16,
  },

  clickableCards: {
    gap: 22,
    bottom: 100,
  },

  /* ⭐ BIG CARD WITH GRADIENT & SHADOW */
  bigCard: {
    borderRadius: 28,
    paddingVertical: 26,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
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
    borderRadius: 24,
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  smallTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    marginTop: 6,
    opacity: 0.95,
  },

  /* ⭐ RECENT CARD */
recentCard: {
  borderRadius: 26,
  overflow: "hidden",     // MUST for BlurView to reveal the blur correctly
  top: 80,
  minHeight: 140,
  position: "relative",

  backgroundColor: "rgba(255,255,255,0.05)", // subtle translucent base (fix)
},

recentCardBackground: {
  ...StyleSheet.absoluteFillObject,
  opacity: 0.4,                                // important: content to blur!
},

recentBlur: {
  ...StyleSheet.absoluteFillObject,
  justifyContent: "center",
  alignItems: "center",
  padding: 20,

  backgroundColor: "transparent",              // REQUIRED
},
});
