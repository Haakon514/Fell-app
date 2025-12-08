import React, { use, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

export default function NewSessionScreen() {
  const db = useSQLiteContext(); // important
  const [name, setName] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  const createSession = async () => {
    const userId = await SecureStore.getItemAsync("user_id"); // get user id from secure store

    try {
      const result = await db.runAsync(
        `INSERT INTO sessions (navn, date, user_id) VALUES (?, ?, ?)`,
        [name, today, userId ?? null]
      );

      const id = result.lastInsertRowId;

      router.push({
        pathname: "/sessions/[id]",
        params: { id, name, date: today },
      });
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ny hogst-sesjon 🌲</Text>

      <Text style={styles.label}>Dato</Text>
      <View style={styles.dateBox}>
        <Text style={styles.date}>{today}</Text>
      </View>

      <Text style={styles.label}>Navn (valgfritt)</Text>
      <TextInput
        id="name-text-input"
        style={styles.input}
        placeholder="F.eks: Østskogen dag 2"
        placeholderTextColor="#bbb"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.button} onPress={createSession}>
        <MaterialCommunityIcons name="folder-plus" size={26} color="#fff" />
        <Text style={styles.buttonText}>Start sesjon</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        <Text style={styles.backText}>Tilbake</Text>
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
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    color: "#aaa",
    marginBottom: 6,
    fontSize: 16,
  },
  dateBox: {
    backgroundColor: "#333",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  date: {
    color: "#fff",
    fontSize: 18,
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#444",
    fontSize: 18,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#2e7d32",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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
