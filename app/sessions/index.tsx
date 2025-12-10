import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { Session } from "@/types/session";

export default function SessionsScreen() {
  const db = useSQLiteContext();
  const [sessions, setSessions] = useState<Session[]>([]);

  async function loadData() {
    const rows = await db.getAllAsync<Session>(
      `SELECT * FROM sessions ORDER BY id DESC`
    );
    setSessions(rows);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sesjoner</Text>

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.empty}>Ingen sessjoner</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push(`/sessions/${item.id}`)}
          >
            <MaterialCommunityIcons name="pine-tree" size={22} color="#6fbf73" />

            <View style={{ marginLeft: 12 }}>
              <Text style={styles.rowText}>
                {item.navn || "Uten navn"}
              </Text>
              <Text style={styles.small}>
                📅 {item.date} Bruker:{" "}
                {item.user_id ? item.user_id : "Anonym Bruker"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  empty: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 40,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  rowText: {
    color: "#fff",
    fontSize: 16,
  },
  small: {
    color: "#aaa",
    fontSize: 13,
  },
});
