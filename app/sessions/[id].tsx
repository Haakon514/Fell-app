import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";

type Session = {
  id: number;
  navn: string;
  date: string;
  user_id: number;
};

export default function SessionDetailScreen() {
  const db = useSQLiteContext();

  const [sessions, setSessions] = useState<Session[]>([]);

  // 👉 Load from SQLite
  async function loadData() {
    const rows = await db.getAllAsync<Session>(
      `SELECT * FROM sessions ORDER BY id DESC`
    );

    console.log("Loaded calculations:", rows);

    setSessions(rows);
  }

  useEffect(() => {
    loadData(); // Load on mount
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{"Sesjoner"}</Text>
      <Text style={styles.date}>📅</Text>

      {/* LIST */}
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.empty}>Ingen sessjoner</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <MaterialCommunityIcons name="tree" size={22} color="#6fbf73" />

            <View style={{ marginLeft: 12 }}>
              <Text style={styles.rowText}>
                Navn {item.navn} × Dato {item.date}
              </Text>
              <Text style={styles.small}>
                UserId {item.user_id} | SessionId {item.id}
              </Text>
            </View>
          </View>
        )}
      />

      {/* TOTAL
      <Text style={styles.total}>Total: {totalVolume.toFixed(3)} m³</Text>*/}

      {/* BACK */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
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
    fontWeight: "bold",
    color: "#fff",
  },
  date: {
    color: "#aaa",
    marginBottom: 20,
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
  volume: {
    marginLeft: "auto",
    color: "#6fbf73",
    fontWeight: "bold",
    fontSize: 18,
  },
  total: {
    marginTop: 20,
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
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
