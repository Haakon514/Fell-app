import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import * as SecureStore from "expo-secure-store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Crypto from "expo-crypto";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Password helpers ---
async function generateSalt() {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    Math.random().toString()
  );
}

export async function hashPassword(password: string, salt: string) {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + salt
  );
}

export default function NewProfileScreen() {
  const db = useSQLiteContext();

  const [brukerNavn, setBrukerNavn] = useState("");
  const [password, setPassword] = useState("");
  const [kommuneNr, setKommuneNr] = useState("");
  const [gårdsNr, setGårdsNr] = useState("");
  const [bruksNr, setBruksNr] = useState("");
  const [leverandørNr, setLeverandørNr] = useState("");

  const resetForm = () => {
    setBrukerNavn("");
    setPassword("");
    setKommuneNr("");
    setGårdsNr("");
    setBruksNr("");
    setLeverandørNr("");
  };

  const createUser = async () => {
    if (!brukerNavn || !password) {
      alert("Brukernavn og passord må fylles ut");
      return;
    }

    const salt = await generateSalt();
    const passwordHash = await hashPassword(password, salt);

    try {
      const result = await db.runAsync(
        `
        INSERT INTO users 
        (bruker_navn, passord_hash, salt, kommune_nummer, gårds_nummer, bruks_nummer, leverandør_nummer)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          brukerNavn,
          passwordHash,
          salt,
          kommuneNr || null,
          gårdsNr || null,
          bruksNr || null,
          leverandørNr || null,
        ]
      );

      const newUserId = result.lastInsertRowId.toString();
      await SecureStore.setItemAsync("user_id", newUserId);

      resetForm();
      router.replace("/");
    } catch (error) {
      console.error("Feil ved oppretting av bruker:", error);
    }
  };

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Opprett profil</Text>

        <Field label="Brukernavn" value={brukerNavn} onChange={setBrukerNavn} />
        <Field label="Passord" value={password} onChange={setPassword} secure />
        <Field label="Kommune nr" value={kommuneNr} onChange={setKommuneNr} />
        <Field label="Gårds nr" value={gårdsNr} onChange={setGårdsNr} />
        <Field label="Bruks nr" value={bruksNr} onChange={setBruksNr} />
        <Field label="Leverandør nr" value={leverandørNr} onChange={setLeverandørNr} />

        {/* Save Button */}
        <TouchableOpacity style={styles.button} onPress={createUser}>
          <MaterialCommunityIcons name="account-check" size={24} color="#fff" />
          <Text style={styles.buttonText}>Lagre profil</Text>
        </TouchableOpacity>
      </ScrollView>
  );
}

function Field({ label, value, onChange, secure = false }: any) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={label}
        placeholderTextColor="#777"
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: "#1a1a1a",
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
    padding: 20,
  },
  label: {
    color: "#aaa",
    marginBottom: 4,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#4b54c8ff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  buttonText: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
});
