import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "@/lib/auth";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileTab() {
  const { user, logout } = useAuth();

  // --- NOT LOGGED IN ---
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.authCard}>
          <Text style={styles.subtitle}>Logg inn eller registrer deg</Text>

          <Link href="/auth/login" asChild>
            <TouchableOpacity style={styles.buttonPrimary}>
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
      </View>
    );
  }

  // --- LOGGED IN ---
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hei, {user.bruker_navn ?? "Ukjent"} 👋</Text>

      {/* Profile info card */}
      <LinearGradient colors={["#171717ff", "#181818ff"]} style={styles.profileCard}>
        <Text style={styles.cardTitle}>Profilinformasjon</Text>

        <ProfileRow label="Brukernavn" value={user.bruker_navn} />
        {user.kommune_nummer && <ProfileRow label="Kommune nummer" value={user.kommune_nummer} />}
        {user.gårds_nummer && <ProfileRow label="Gårds nummer" value={user.gårds_nummer} />}
        {user.bruks_nummer && <ProfileRow label="Bruks nummer" value={user.bruks_nummer} />}
        {user.leverandør_nummer && (
          <ProfileRow label="Leverandør nummer (Fram tre)" value={user.leverandør_nummer} />
        )}
      </LinearGradient>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <MaterialCommunityIcons name="logout" size={22} color="#8d1616ff" />
        <Text style={styles.logoutText}>Logg ut</Text>
      </TouchableOpacity>
    </View>
  );
}

/* Reusable profile row */
function ProfileRow({ label, value }: { label: string; value: any }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: "flex-start",
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 24,
  },

  subtitle: {
    color: "#ccc",
    fontSize: 18,
    marginBottom: 28,
    textAlign: "center",
    fontWeight: "500",
  },

  /* Auth card (not logged in) */
  authCard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },

  /* Profile card */
  profileCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    elevation: 4,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },

  row: {
    marginBottom: 16,
  },

  label: {
    color: "#888",
    fontSize: 14,
  },

  value: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 2,
  },

  /* Buttons */
  buttonPrimary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3a4bff",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "85%",
    justifyContent: "center",
    marginBottom: 14,
  },

  buttonSecondary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#251e9d",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "85%",
    justifyContent: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "600",
  },

  /* Logout */
  logoutBtn: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#8d2d2dff",
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: "#901e1eff",
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "600",
  },
});
