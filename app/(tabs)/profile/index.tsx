import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "@/lib/auth";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ProfileTab() {
  const { user, logout } = useAuth();

  // Not logged in -> show buttons
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Du er ikke logget inn 🔒</Text>

        <Link href="/auth/login" asChild>
          <TouchableOpacity style={styles.button}>
            <MaterialCommunityIcons name="login" size={22} color="#fff" />
            <Text style={styles.buttonText}>Logg inn</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/auth/register" asChild>
          <TouchableOpacity style={styles.buttonSecondary}>
            <MaterialCommunityIcons name="account-plus" size={22} color="#fff" />
            <Text style={styles.buttonText}>Registrer</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  // Logged in -> show profile
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hei, {user.navn ?? "Ukjent"} 👋</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>E-post:</Text>
        <Text style={styles.value}>{user.email}</Text>

        {user.addresse && (
          <>
            <Text style={styles.label}>Adresse:</Text>
            <Text style={styles.value}>{user.addresse}</Text>
          </>
        )}

        {user.kommune_nummer && (
          <>
            <Text style={styles.label}>Kommune nr:</Text>
            <Text style={styles.value}>{user.kommune_nummer}</Text>
          </>
        )}

        {user.gårds_nummer && (
          <>
            <Text style={styles.label}>Gårds nr:</Text>
            <Text style={styles.value}>{user.gårds_nummer}</Text>
          </>
        )}

        {user.bruks_nummer && (
          <>
            <Text style={styles.label}>Bruks nr:</Text>
            <Text style={styles.value}>{user.bruks_nummer}</Text>
          </>
        )}

        {user.leverandør_nummer && (
          <>
            <Text style={styles.label}>Leverandør nr:</Text>
            <Text style={styles.value}>{user.leverandør_nummer}</Text>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <MaterialCommunityIcons name="logout" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logg ut</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 20,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },

  infoBox: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
  },

  label: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 10,
  },

  value: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },

  button: {
    flexDirection: "row",
    backgroundColor: "#2e7d32",
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  buttonSecondary: {
    flexDirection: "row",
    backgroundColor: "#4169e1",
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },

  logoutBtn: {
    flexDirection: "row",
    backgroundColor: "#a62828",
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
});
