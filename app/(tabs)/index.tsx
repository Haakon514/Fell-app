import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProfileCircle from "../../components/profileCircle";
import { useAuth } from "@/lib/auth";
import RecentNumbers from "@/components/recentNumbers";
import GradientBackground from "@/components/gradientBackround";
import { BlurView } from "expo-blur";


export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <GradientBackground>
        {/* Profile Top Left */}
        <TouchableOpacity
          style={styles.profileWrapper}
          onPress={() => router.push("/profile")}
        >
          <ProfileCircle
            name={user ? user.navn : null}
            leverandørNr={user ? user.leverandør_nummer : null}
          />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.cardsContainer}>

          {/* BIG CARD */}
          <Link href="/volume" asChild>
            <TouchableOpacity style={styles.bigCard}>
              <MaterialCommunityIcons name="ruler" size={50} color="#fff" />
              <Text style={styles.bigTitle}>Volum Kalkulator</Text>
              <Text style={styles.bigDescription}>Regn ut volum på hogst</Text>
            </TouchableOpacity>
          </Link>

          {/* 2 SMALL CARDS SIDE BY SIDE */}
          <View style={styles.row}>
            
            <Link href="/reglement" asChild>
              <TouchableOpacity style={styles.smallCard}>
                <MaterialCommunityIcons name="book" size={30} color="#fff" />
                <Text style={styles.smallTitle}>Reglement</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/sessions/[id]" asChild>
              <TouchableOpacity style={styles.smallCard}>
                <MaterialCommunityIcons name="calendar-clock" size={30} color="#fff" />
                <Text style={styles.smallTitle}>Økter</Text>
              </TouchableOpacity>
            </Link>

          </View>

          <Link href="/nylig" asChild>
            <TouchableOpacity style={styles.recentCard}>
              {/* background behind blur */}
              <View style={styles.recentCardBackground} />

              {/* blur overlay */}
              <BlurView
                intensity={40}
                tint="dark"
                style={styles.recentBlur}
              >
                <RecentNumbers value={150} label={"kubikk"} />
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
    top: 20,
    left: 20,
    zIndex: 100,
  },

  cardsContainer: {
    top: 100,
    paddingHorizontal: 20,
    paddingBottom: 60,
    gap: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },

  // BIG CARD
  bigCard: {
    backgroundColor: "rgba(72, 121, 142, 0.85)",
    borderRadius: 26,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  bigTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginTop: 12,
  },

  bigDescription: {
    fontSize: 14,
    color: "#dcdcdc",
    marginTop: 4,
  },

  // SMALL CARDS
  smallCard: {
    flex: 1,
    backgroundColor: "rgba(72, 121, 142, 0.85)",
    borderRadius: 22,
    paddingVertical: 20,
    alignItems: "center",
  },

  smallTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginTop: 8,
  },

  recentCard: {
    borderRadius: 22,
    overflow: "hidden",       // IMPORTANT
    minHeight: 120,
    position: "relative",
  },

  recentCardBackground: {
    ...StyleSheet.absoluteFillObject, // something to blur
  },

  recentBlur: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 22,
  },
});
