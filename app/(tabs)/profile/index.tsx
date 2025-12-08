import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "@/lib/auth";
import { Link } from "expo-router";

export default function ProfileTab() {
  const { user, logout } = useAuth();

  // If not logged in -> show auth route
  if (!user) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20 }}>Du er ikke logget inn 🔒</Text>

        <Link href="/auth/login">
          <Text style={{ marginTop: 20, color: "blue" }}>
            Logg inn
          </Text>
        </Link>
        <Link href="/auth/register">
          <Text style={{ marginTop: 20, color: "blue" }}>
            registrer
          </Text>
        </Link>
      </View>
    );
  }

  // If logged in -> show profile info
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hei, {user.navn ?? "Ukjent"} 👋</Text>

      {/* INFO FIELDS */}
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

      <Button title="Logg ut" onPress={logout} />
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
});

