import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { Session } from "@/types/session";
import { useQueries } from "@/lib/useQueries";
import ConfirmDeleteModal from "@/components/modals/confirmDeleteModal";
import { appEvents } from "@/lib/events";

export default function SessionsScreen() {
  const [showModalToDeleteSession, setShowModalToDeleteSession] = useState(false);
  const db = useSQLiteContext();
  const { deleteAllCalculationsFromAGivenSession } = useQueries();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  function toggleSection(title: string) {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  }

  function formatDateWithWeekday(dateString: string) {
    const d = new Date(dateString);
    const text = new Intl.DateTimeFormat("no-NO", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(d);
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  async function handleDeleteSession(id: number) {
    setSessions((prev) => prev.filter((s) => s.id !== id)); // update session list state

    await deleteAllCalculationsFromAGivenSession(id); // delete the session from the database

    appEvents.emit("sessionUpdated"); // emit that an update on session data has occured
  }

  async function loadData() {
    const rows = await db.getAllAsync<Session>(
      `SELECT * FROM sessions ORDER BY date DESC`
    );
    setSessions(rows);
  }

  useEffect(() => {
    loadData();
  }, []);

  const sections = useMemo(() => {
    const grouped: Record<string, Session[]> = {};

    for (const session of sessions) {
      const dateKey = session.date || "Ukjent dato";
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(session);
    }

    return Object.keys(grouped)
      .sort((a, b) => b.localeCompare(a))
      .map((date) => ({
        title: date,
        data: grouped[date],
      }));
  }, [sessions]);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Lagrede Kalkulasjoner</Text>
      </View>

      <SectionList
        sections={sections}
        extraData={sessions}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>Ingen økter</Text>}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => {
          const isOpen = openSections[title];

          return (
            <TouchableOpacity
              onPress={() => toggleSection(title)}
              style={styles.headerCard}
            >
              <Text style={styles.headerCardText}>
                {formatDateWithWeekday(title)}
              </Text>

              <MaterialCommunityIcons
                name={isOpen ? "chevron-up" : "chevron-down"}
                size={24}
                color="#4ade80"
              />
            </TouchableOpacity>
          );
        }}
        renderItem={({ item, section }) => {
          const isOpen = openSections[section.title];
          if (!isOpen) return null;

          const total = Number(item.total_volume ?? 0);

          return (
            <View style={styles.itemRow}>
              {/* Main tap area */}
              <TouchableOpacity
                style={styles.itemCard}
                onPress={() => router.push(`/sessions/${item.id}`)}
                activeOpacity={0.8}
              >
                <View style={styles.itemTextWrap}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.navn || `Hogst ${formatDateWithWeekday(item.date)}`}
                  </Text>
                  <Text style={styles.itemMeta}>
                    Totalt Volum: {total.toFixed(2)} m³
                  </Text>
                </View>

                <MaterialCommunityIcons name="chevron-right" size={26} color="#777" />
              </TouchableOpacity>

              {/* Delete button */}
              <TouchableOpacity
                style={styles.trashBtn}
                onPress={() => setShowModalToDeleteSession(true)}
                activeOpacity={0.8}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialCommunityIcons name="trash-can" size={22} color="#ca2222ff" />
              </TouchableOpacity>

              <ConfirmDeleteModal
                visible={showModalToDeleteSession}
                message="Vil du virkelig slette denne økten?"
                onCancel={() => setShowModalToDeleteSession(false)}
                onConfirm={() => handleDeleteSession(item.id)}
              />
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
    backgroundColor: "#111",
    paddingHorizontal: 14,
    paddingTop: 40,
    paddingBottom: 20,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  topBarTitle: {
    fontSize: 28,
    color: "#4ade80",
    fontWeight: "700",
    marginLeft: 10,
  },
  empty: {
    color: "#666",
    textAlign: "center",
    marginTop: 60,
  },
  headerCard: {
    backgroundColor: "#1f2937",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 14,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerCardText: {
    color: "#4ade80",
    fontSize: 17,
    fontWeight: "600",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  cardSubtitle: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 2,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  itemCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },

  itemTextWrap: {
    flex: 1,
    marginLeft: 6,
    marginRight: 10,
  },

  itemMeta: {
    color: "#cfcfcf",
    fontSize: 15,
    marginTop: 2,
  },

  trashBtn: {
    marginLeft: 10,
    height: 75,
    width: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
});
