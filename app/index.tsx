import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Skogshjelper 🌲</Text>

      <Link href="/volume" asChild>
        <TouchableOpacity style={styles.card}>
          <MaterialCommunityIcons name="ruler" size={40} color="#fff" />
          <Text style={styles.cardTitle}>Tre-volum</Text>
          <Text style={styles.cardDescription}>Regn ut volum på trær</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/sessions/new" asChild>
        <TouchableOpacity style={styles.card}>
          <MaterialCommunityIcons name="plus-circle" size={40} color="#fff" />
          <Text style={styles.cardTitle}>Ny sesjon</Text>
          <Text style={styles.cardDescription}>Start en hogst-dag</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/sessions" asChild>
        <TouchableOpacity style={styles.card}>
          <MaterialCommunityIcons
            name="calendar-clock"
            size={40}
            color="#fff"
          />
          <Text style={styles.cardTitle}>Tidligere sesjoner</Text>
          <Text style={styles.cardDescription}>Se hva du har hogd 🚜</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#1a1a1a",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#2e7d32",
    padding: 20,
    borderRadius: 18,
    marginBottom: 20,
    alignItems: "center",
    elevation: 4,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginTop: 10,
  },

  cardDescription: {
    fontSize: 14,
    color: "#f2f2f2",
    marginTop: 4,
  },
});
