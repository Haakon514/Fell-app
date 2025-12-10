import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProfileCircle from "../../components/profileCircle";
import { useAuth } from "@/lib/auth";

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>

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

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    backgroundColor: "#f4f5f8",
  },

  profileWrapper: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 100,
  },

  cardsContainer: {
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
    backgroundColor: "#503dff",
    borderRadius: 26,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 8,
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
    backgroundColor: "#6c5ce7",
    borderRadius: 22,
    paddingVertical: 20,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },

  smallTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginTop: 8,
  },
});
