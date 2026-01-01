import React, { useEffect, useMemo, useState } from "react";
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
import { useQueries } from "@/lib/useQueries";
import ConfirmDeleteModal from "./modals/confirmDeleteModal";

type Props = {
  sessionId: number;
};

export default function SessionCalculations({ sessionId }: Props) {
  const db = useSQLiteContext();
  const { deleteTreeCalculation } = useQueries();

  const [loading, setLoading] = useState(true);
  const [calculations, setCalculations] = useState<TreeCalculation[]>([]);
  const [selectedSortiment, setSelectedSortiment] = useState<string | null>(null);

  // ✅ modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const SORTIMENT_LIST = [
    { label: "Sagtømmer Gran (SK 142)", value: "142" },
    { label: "Sagtømmer Furu (SK 242)", value: "242" },
    { label: "Massevirke Gran (SK 102)", value: "102" },
    { label: "Massevirke Furu (SK 202)", value: "202" },
    { label: "Bio Gran/Furu/Lauv (SK 932)", value: "932" },
    { label: "Pallevirke Gran (SK 131)", value: "131" },
    { label: "Pallevirke Furu (SK 231)", value: "231" },
  ];

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

  function openDeleteModal(id: number) {
    setDeleteId(id);
    setDeleteOpen(true);
  }

  function closeDeleteModal() {
    setDeleteOpen(false);
    setDeleteId(null);
  }

  // ✅ called from modal confirm
  async function confirmDelete() {
    if (deleteId == null) return;

    const id = deleteId;

    // optimistic update
    setCalculations((prev) => prev.filter((c) => c.id !== id));
    closeDeleteModal();
    
    await deleteTreeCalculation(id);
  }

  const filteredCalculations = useMemo(() => {
    if (!selectedSortiment) return calculations;
    return calculations.filter((c) => String(c.sortiment_kode) === String(selectedSortiment));
  }, [selectedSortiment, calculations]);

  const sortimentCodes = useMemo(() => {
    const setCodes = new Set(calculations.map((c) => String(c.sortiment_kode)));
    return Array.from(setCodes);
  }, [calculations]);

  const totalVolume = useMemo(() => {
    return filteredCalculations.reduce((sum, c) => sum + (Number(c.volum) || 0), 0);
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
      {/* ✅ Confirm delete modal */}
      <ConfirmDeleteModal
        visible={deleteOpen}
        message="Vil du virkelig slette dette elementet?"
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />

      <Text style={styles.title}>
        Kalkulasjoner ({filteredCalculations.length}) — Totalt {totalVolume.toFixed(2)} m³
      </Text>

      <Text style={{ fontSize: 15, color: "#838383ff", paddingVertical: 10 }}>
        Sorter basert på sortiment (SK)
      </Text>

      {/* FILTER BAR */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          onPress={() => setSelectedSortiment(null)}
          style={[styles.filterButton, selectedSortiment === null && styles.filterSelected]}
          activeOpacity={0.85}
        >
          <Text style={styles.filterText}>Alle</Text>
        </TouchableOpacity>

        {sortimentCodes.map((code) => (
          <TouchableOpacity
            key={code}
            onPress={() => setSelectedSortiment(code)}
            style={[styles.filterButton, selectedSortiment === code && styles.filterSelected]}
            activeOpacity={0.85}
          >
            <Text style={styles.filterText}>{SORTIMENT_LIST.find((s) =>
              String(s.value) === String(code))?.label ?? 'Ukjent'
            }</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}
      <FlatList
        style={{ flex: 1 }}
        data={filteredCalculations}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>Ingen kalkulasjoner</Text>}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => {
          const volume = Number(item.volum ?? 0);

          return (
            <View style={styles.rowWrap}>
              {/* main content */}
              <View style={styles.rowMain}>
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                  <MaterialCommunityIcons name="calculator" size={18} color="#ffffffff" />
                  <View style={{ marginLeft: 10, flex: 1 }}>
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

              {/* delete button */}
              <TouchableOpacity
                style={styles.trashBtn}
                onPress={() => openDeleteModal(item.id)}
                activeOpacity={0.8}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialCommunityIcons name="trash-can" size={18} color="#e72121ff" />
              </TouchableOpacity>
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

  rowWrap: {
    flexDirection: "row",
    alignItems: "stretch",
    marginBottom: 8,
  },

  rowMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#242424ff",
    padding: 12,
    borderRadius: 10,
    justifyContent: "space-between",
  },

  trashBtn: {
    marginLeft: 10,
    width: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1f1f1fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
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
    marginLeft: 10,
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
