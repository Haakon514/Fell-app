import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function AuthLandingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Velkommen 🌲</Text>
      <Text style={styles.subtitle}>Fortsett for å bruke appen</Text>

      {/* LOGIN */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/auth/login")}
      >
        <Text style={styles.buttonText}>Logg inn</Text>
      </TouchableOpacity>

      {/* REGISTER */}
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => router.push("/auth/register")}
      >
        <Text style={styles.buttonText}>Registrer</Text>
      </TouchableOpacity>

      {/* BACK */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>← Tilbake</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    color: "#ccc",
    textAlign: "center",
    marginBottom: 50,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2e7d32",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
  },
  secondaryButton: {
    backgroundColor: "#33691e",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  backButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  backText: {
    color: "#aaa",
    fontSize: 16,
  },
});
