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

export default function NewProfileScreen() {
  const db = useSQLiteContext();

  const [navn, setNavn] = useState("");
  const [email, setEmail] = useState("");
  const [adresse, setAdresse] = useState("");
  const [kommuneNr, setKommuneNr] = useState("");
  const [gårdsNr, setGårdsNr] = useState("");
  const [bruksNr, setBruksNr] = useState("");
  const [leverandørNr, setLeverandørNr] = useState("");

  const createUser = async () => {
    try {
      const result = await db.runAsync(
        `INSERT INTO users (navn, email, addresse, kommune_nummer, gårds_nummer, bruks_nummer, leverandør_nummer)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          navn,
          email,
          adresse,
          kommuneNr,
          gårdsNr,
          bruksNr,
          leverandørNr,
        ]
      );

      const newUserId = result.lastInsertRowId.toString();

      // Store for later use
      await SecureStore.setItemAsync("user_id", newUserId);

      router.replace("/"); // back to home

    } catch (error) {
      console.error("Feil ved oppretting av bruker:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Opprett profil 🧑‍🌾</Text>

      <Field label="Navn" value={navn} onChange={setNavn} />
      <Field label="E-post" value={email} onChange={setEmail} />
      <Field label="Adresse" value={adresse} onChange={setAdresse} />
      <Field label="Kommune nr" value={kommuneNr} onChange={setKommuneNr} />
      <Field label="Gårds nr" value={gårdsNr} onChange={setGårdsNr} />
      <Field label="Bruks nr" value={bruksNr} onChange={setBruksNr} />
      <Field label="Leverandør nr" value={leverandørNr} onChange={setLeverandørNr} />

      <TouchableOpacity style={styles.button} onPress={createUser}>
        <MaterialCommunityIcons name="account-check" size={24} color="#fff" />
        <Text style={styles.buttonText}>Lagre profil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
        <Text style={styles.backText}>Tilbake</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Field({ label, value, onChange }: any) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={label}
        placeholderTextColor="#bbb"
        value={value}
        onChangeText={onChange}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    color: "#aaa",
    marginBottom: 4,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#444",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#2e7d32",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  backBtn: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    marginLeft: 8,
    color: "#fff",
    fontSize: 18,
  },
});
