import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";

type Props = {
  sessionId: number;
  userId?: number | null;
};

type Calc = {
  id: number;
  sortiment_kode: number;
  diameter: number;
  lengde: number;
  volum: number;
  timestamp: string;
};

export default function SessionCalculations({ sessionId }: Props) {
  const db = useSQLiteContext();

  const [loading, setLoading] = useState(true);
  const [calculations, setCalculations] = useState<Calc[]>([]);

  // 👉 Load data
  async function loadData() {
    try {
      const rows = await db.getAllAsync<Calc>(
        `SELECT * FROM treecalculations WHERE session_id = ? ORDER BY id DESC`,
        [sessionId]
      );
      setCalculations(rows);
    } catch (err) {
      console.error("Failed to get calculations:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [sessionId]);

  // 👉 Total volume
  //const totalVolume = calculations.reduce((sum, c) => sum + c.volum, 0);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6fbf73" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
    
    <Text style={styles.title}>Kalkulasjoner ({calculations.length})</Text>

    <FlatList
      style={{ flex: 1 }}              // 👈 ADD THIS
      data={calculations}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={
        <Text style={styles.empty}>Ingen kalkulasjoner i denne sesjonen</Text>
      }
      renderItem={({ item }) => {
        const volume = Number(item.volum ?? item.volum ?? 0);

        return (
          <View style={styles.row}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="pine-tree"
                size={22}
                color="#6fbf73"
              />

              <View style={{ marginLeft: 12 }}>
                <Text style={styles.rowText}>
                  Ø {item.diameter}cm × {item.lengde}m
                </Text>
                <Text style={styles.small}>
                  SK {item.sortiment_kode} — {item.timestamp}
                </Text>
              </View>

              </View>
                <Text style={styles.volume}>
                  {volume.toFixed(3)} m³
                </Text>
              </View>
        );
        }}
        />

        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 4,
    marginBottom: 40,
  },

  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    justifyContent: "space-between",
  },

  rowText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },

  small: {
    color: "#aaa",
    fontSize: 12,
  },

  volume: {
    color: "#6fbf73",
    fontSize: 18,
    fontWeight: "bold",
  },

  empty: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 40,
  },

  totalBox: {
    marginTop: 20,
    backgroundColor: "#2e7d32",
    padding: 18,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  totalLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  totalValue: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  loading: {
    padding: 20,
    alignItems: "center",
  },
});
