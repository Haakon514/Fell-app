import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { hashPassword } from "./register";
import { User } from "@/types/user";
import { useAuth } from "@/lib/auth";

export default function LoginScreen() {
  const db = useSQLiteContext();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const submitLogin = async () => {
    try {
      const user: User | null | undefined = await db.getFirstAsync<User>(
        `SELECT * FROM users WHERE bruker_navn = ?`,
        [userName]
      );

      if (!user) {
        Alert.alert("Feil", "Bruker ikke funnet");
        return;
      }

      const passwordHash = await hashPassword(password, user.salt);

      if (passwordHash !== user.passord_hash) {
        Alert.alert("Feil", "Feil passord");
        return;
      }

      // user in logged in state:
      login(user);

      Alert.alert("Logget inn!", `Velkommen tilbake ${user.navn}`);

      // reset form
      setUserName("");
      setPassword("");

      // go home:
      router.replace("/");
    } catch (err) {
      console.error(err);
      Alert.alert("Feil", "Kunne ikke logge inn");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logg inn</Text>

      {/* EMAIL */}
      <TextInput
        style={styles.input}
        placeholder="Brukernavn"
        placeholderTextColor="#777"
        autoCapitalize="none"
        value={userName}
        onChangeText={setUserName}
      />

      {/* PASSWORD */}
      <TextInput
        style={styles.input}
        placeholder="Passord"
        placeholderTextColor="#777"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* SUBMIT BUTTON */}
      <TouchableOpacity style={styles.button} onPress={submitLogin}>
        <MaterialCommunityIcons name="login" size={22} color="#fff" />
        <Text style={styles.buttonText}>Logg inn</Text>
      </TouchableOpacity>

      {/* BACK */}
      <TouchableOpacity
        style={styles.backBtn}
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
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#444",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#4b54c8ff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  backBtn: {
    marginTop: 30,
    alignSelf: "center",
  },
  backText: {
    color: "#aaa",
    fontSize: 16,
  },
});
