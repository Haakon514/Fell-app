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
import SessionCalculations from "@/components/sessionsCalculations";

type Session = {
  id: number;
  navn: string;
  date: string;
  user_id: number;
};

export default function SessionDetailScreen() {
  const db = useSQLiteContext();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // 👉 Load from SQLite
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

      {/* SESSION LIST */}
      <FlatList
        data={sessions}
        style={{ maxHeight: 100 }}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.empty}>Ingen sessjoner</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.row,
              selectedSession?.id === item.id && styles.selectedRow,
            ]}
            onPress={() => setSelectedSession(item)}
          >
            <MaterialCommunityIcons name="pine-tree" size={22} color="#6fbf73" />

            <View style={{ marginLeft: 12 }}>
              <Text style={styles.rowText}>
                {item.navn || "Uten navn"}
              </Text>
              <Text style={styles.small}>📅 {item.date}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* SHOW CALCULATIONS FOR SELECTED SESSION */}
      {selectedSession && (
        <View style={{ flex: 1, marginTop: 20 }}>
          <Text style={styles.subtitle}>
            Kalkulasjoner for: {selectedSession.navn || selectedSession.date}
          </Text>

          <SessionCalculations sessionId={selectedSession.id} />
        </View>
      )}
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
  subtitle: {
    fontSize: 18,
    color: "#a4a0a0ff",
    marginBottom: 10,
    marginTop: 10,
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
  selectedRow: {
    backgroundColor: "#445",
  },
  rowText: {
    color: "#fff",
    fontSize: 16,
  },
  small: {
    color: "#aaa",
    fontSize: 13,
  },
  backBtn: {
    marginTop: 30,
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
