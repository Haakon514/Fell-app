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

export default function SessionsScreen() {
  const db = useSQLiteContext();
  const [sessions, setSessions] = useState<Session[]>([]);

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
      {/* CUSTOM TOP BAR */}
      <View style={styles.topBar}>
        <MaterialCommunityIcons name="forest" size={28} color="#4ade80" />
        <Text style={styles.topBarTitle}>Økter</Text>
      </View>

      {/* LIST */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>Ingen økter</Text>}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.headerCard}>
            <Text style={styles.headerCardText}>
              {formatDateWithWeekday(title)}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/sessions/${item.id}`)}
          >
            <MaterialCommunityIcons name="pine-tree" size={26} color="#4ade80" />

            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.cardTitle}>
                {item.navn || "Uten navn"}
              </Text>
              <Text style={styles.cardSubtitle}>
                Bruker: {item.user_id || "Anonym"}
              </Text>
            </View>

            <MaterialCommunityIcons
              name="chevron-right"
              size={28}
              color="#888"
            />
          </TouchableOpacity>
        )}
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
    color: "#fff",
    fontWeight: "700",
    marginLeft: 10,
  },

  empty: {
    color: "#666",
    textAlign: "center",
    marginTop: 60,
  },

  /* DATE HEADER */
  headerCard: {
    backgroundColor: "#1f2937",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 14,
    marginBottom: 8,
  },
  headerCardText: {
    color: "#4ade80",
    fontSize: 17,
    fontWeight: "600",
  },

  /* ITEM CARD */
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowRadius: 4,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  cardSubtitle: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 2,
  },
});
