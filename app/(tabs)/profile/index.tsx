import { View, Text, Button } from "react-native";
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
            Logg inn eller registrer →
          </Text>
        </Link>
      </View>
    );
  }

  // If logged in -> show profile info
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Hei, {user.navn} 👋</Text>

      <Button title="Logg ut" onPress={logout} />
    </View>
  );
}
