import React, { useEffect, useState, useMemo } from "react";
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
import { TreeCalculation } from "@/types/treeCalculation";

type Props = {
  sessionId: number;
};

export default function SessionCalculations({ sessionId }: Props) {
  const db = useSQLiteContext();

  const [loading, setLoading] = useState(true);
  const [calculations, setCalculations] = useState<TreeCalculation[]>([]);
  const [selectedSortiment, setSelectedSortiment] = useState<string | null>(null); // ⭐ ADDED

  // 👉 Load data
  async function loadData() {
    try {
      const rows = await db.getAllAsync<TreeCalculation>(
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

  // ⭐ Filtered data
  const filteredCalculations = useMemo(() => {
    if (!selectedSortiment) return calculations;
    return calculations.filter(
      (c) => c.sortiment_kode === selectedSortiment
    );
  }, [selectedSortiment, calculations]);

  // ⭐ Extract list of unique sortiment codes
  const sortimentCodes = useMemo(() => {
    const setCodes = new Set(calculations.map((c) => c.sortiment_kode));
    return Array.from(setCodes);
  }, [calculations]);

  // ⭐ Recalculate total based on filtered list
  const totalVolume = useMemo(() => {
    return filteredCalculations.reduce(
      (sum, c) => sum + (Number(c.volum) || 0),
      0
    );
  }, [filteredCalculations]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6fbf73" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Kalkulasjoner ({filteredCalculations.length}) — Totalt{" "}
        {totalVolume.toFixed(2)} m³
      </Text>

      <Text style={{ fontSize: 15, color: '#838383ff', paddingVertical: 10 }}>
        Sorter basert på sortiment (SK)
      </Text>

      {/* ⭐ FILTER BAR */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          onPress={() => setSelectedSortiment(null)}
          style={[
            styles.filterButton,
            selectedSortiment === null && styles.filterSelected,
          ]}
        >
          <Text style={styles.filterText}>Alle</Text>
        </TouchableOpacity>

        {sortimentCodes.map((code) => (
          <TouchableOpacity
            key={code}
            onPress={() => setSelectedSortiment(code)}
            style={[
              styles.filterButton,
              selectedSortiment === code && styles.filterSelected,
            ]}
          >
            <Text style={styles.filterText}>SK {code}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}
      <FlatList
        style={{ flex: 1 }}
        data={filteredCalculations}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.empty}>Ingen kalkulasjoner</Text>
        }
        renderItem={({ item }) => {
          const volume = Number(item.volum ?? 0);

          return (
            <View style={styles.row}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="calculator"
                  size={18}
                  color="#ffffffff"
                />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.rowText}>
                    Ø {item.diameter}cm × {item.lengde}m
                  </Text>
                  <Text style={styles.small}>
                    SK {item.sortiment_kode} — {item.timestamp}
                  </Text>
                </View>
              </View>

              <Text style={styles.volume}>{volume.toFixed(2)} m³</Text>
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
    marginTop: 10,
    marginBottom: 20,
  },

  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },

  // ⭐ FILTER BAR
  filterBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15,
  },
  filterButton: {
    backgroundColor: "#3d3d3dff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filterSelected: {
    backgroundColor: "#5f6ddaff",
  },
  filterText: {
    color: "#fff",
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#242424ff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    justifyContent: "space-between",
  },

  rowText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },

  small: {
    color: "#aaa",
    fontSize: 15,
  },

  volume: {
    color: "#6e7ffeff",
    fontSize: 22,
    fontWeight: "bold",
  },

  empty: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 40,
  },

  loading: {
    padding: 20,
    alignItems: "center",
  },
});
