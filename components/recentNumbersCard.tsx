import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Animated, View, Text, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useQueries } from "@/lib/useQueries";
import { appEvents } from "@/lib/events";
import { useSQLiteContext } from "expo-sqlite";
import { TreeCalculation } from "@/types/treeCalculation";

type CodeTotal = { code: string; volume: number };

export default function RecentNumbersCard() {
  const { getSessionsBetweenDates } = useQueries();
  const db = useSQLiteContext();
  const scale = useRef(new Animated.Value(1)).current;

  const [period, setPeriod] = useState<"week" | "month">("week");

  const [weekTotal, setWeekTotal] = useState(0);
  const [monthTotal, setMonthTotal] = useState(0);
  const [weeklyCalculations, setWeeklyCalculations] = useState<TreeCalculation[]>([]);
  const [monthlyCalculations, setMonthlyCalculations] = useState<TreeCalculation[]>([]);

  const SORTIMENT_LIST = [
    { label: "Sagtømmer Gran", value: "142" },
    { label: "Sagtømmer Furu", value: "242" },
    { label: "Massevirke Gran", value: "102" },
    { label: "Massevirke Furu", value: "202" },
    { label: "Bio Gran/Furu/Lauv", value: "932" },
    { label: "Pallevirke Gran", value: "131" },
    { label: "Pallevirke Furu", value: "231" },
  ];

  function toDayStart(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0).toISOString();
  }
  function toDayEnd(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59).toISOString();
  }

  function getCurrentWeekRange() {
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
    return { start: toDayStart(monday), end: toDayEnd(now) };
  }

  function getCurrentMonthRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { start: toDayStart(start), end: toDayEnd(now) };
  }

  // DB columns: sortiment_kode, volum
  function getSortimentCode(c: TreeCalculation) {
    // @ts-ignore
    return String(c.sortiment_kode ?? "Ukjent");
  }
  function getVolume(c: TreeCalculation) {
    // @ts-ignore
    return Number(c.volum ?? 0) || 0;
  }

  function aggregateTop4(calcs: TreeCalculation[]): CodeTotal[] {
    const map = new Map<string, number>();

    for (const c of calcs) {
      const code = getSortimentCode(c);
      const vol = getVolume(c);
      map.set(code, (map.get(code) ?? 0) + vol);
    }

    // "most used" = highest total volume
    return Array.from(map.entries())
      .map(([code, volume]) => ({ code, volume }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 4);
  }

  const total = period === "week" ? weekTotal : monthTotal;
  const topCodes = useMemo(
    () => aggregateTop4(period === "week" ? weeklyCalculations : monthlyCalculations),
    [period, weeklyCalculations, monthlyCalculations]
  );

  async function loadStats() {
    const week = getCurrentWeekRange();
    const month = getCurrentMonthRange();

    const weekSessions = await getSessionsBetweenDates(week.start, week.end);
    const monthSessions = await getSessionsBetweenDates(month.start, month.end);

    const weekCalcArrays = await Promise.all(
      (weekSessions ?? []).map((s) =>
        db.getAllAsync<TreeCalculation>(
          `SELECT * FROM treecalculations WHERE session_id = ?`,
          [s.id]
        )
      )
    );
    setWeeklyCalculations(weekCalcArrays.flat());

    const monthCalcArrays = await Promise.all(
      (monthSessions ?? []).map((s) =>
        db.getAllAsync<TreeCalculation>(
          `SELECT * FROM treecalculations WHERE session_id = ?`,
          [s.id]
        )
      )
    );
    setMonthlyCalculations(monthCalcArrays.flat());

    const weekSum = (weekSessions ?? []).reduce((sum, s) => sum + Number(s.total_volume || 0), 0);
    const monthSum = (monthSessions ?? []).reduce((sum, s) => sum + Number(s.total_volume || 0), 0);

    setWeekTotal(weekSum);
    setMonthTotal(monthSum);

    Animated.sequence([
      Animated.spring(scale, { toValue: 1.04, friction: 6, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 7, useNativeDriver: true }),
    ]).start();
  }

  useEffect(() => {
    loadStats();
    const sub = appEvents.addListener("sessionUpdated", loadStats);
    return () => sub.remove();
  }, []);

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale }] }]}>
      <View style={styles.card}>
        <LinearGradient
          colors={["#5c5d60ff", "#2c2d31ff", "#1b1b1fff"]}
          style={StyleSheet.absoluteFill}
        />

        <BlurView intensity={20} tint="dark" style={styles.blur}>
          {/* Header + period toggle */}
          <View style={styles.headerRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Volum</Text>
            </View>

            <View style={styles.segment}>
              <TouchableOpacity
                onPress={() => setPeriod("week")}
                style={[styles.segmentBtn, period === "week" && styles.segmentBtnActive]}
                activeOpacity={0.85}
              >
                <Text style={[styles.segmentText, period === "week" && styles.segmentTextActive]}>
                  Uke
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setPeriod("month")}
                style={[styles.segmentBtn, period === "month" && styles.segmentBtnActive]}
                activeOpacity={0.85}
              >
                <Text style={[styles.segmentText, period === "month" && styles.segmentTextActive]}>
                  Måned
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* MAIN TOTAL */}
          <View style={styles.totalBlock}>
            <Text style={styles.totalLabel}>
              {period === "week" ? "Totalt denne uken" : "Totalt denne måneden"}
            </Text>
            <Text style={styles.totalValue}>{total.toFixed(2)} m³</Text>
          </View>

          {/* TOP 4 CODES */}
          <View style={styles.codesWrap}>
            <View style={styles.codesHeader}>
              <Text style={styles.codesTitle}>Mest brukt sortiment</Text>
              <Text style={styles.codesMeta}>Topp {Math.min(4, topCodes.length)}</Text>
            </View>

            {topCodes.length === 0 ? (
              <Text style={styles.emptyText}>
                {period === "week" ? "Ingen sortiment i denne uken" : "Ingen sortiment i denne måneden"}
              </Text>
            ) : (
              topCodes.map((item, idx) => (
                <View key={item.code}>
                  <View style={styles.codeRow}>
                    <View style={styles.codePill}>
                      <Text style={styles.codePillText} numberOfLines={1}>
                        {SORTIMENT_LIST.find((s) =>
                          String(s.value) === String(item.code))?.label ?? 'Ukjent'
                        }
                      </Text>
                    </View>

                    <Text style={styles.codeValue}>{item.volume.toFixed(2)} m³</Text>
                  </View>

                  {idx !== topCodes.length - 1 && <View style={styles.divider} />}
                </View>
              ))
            )}
          </View>
        </BlurView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: { width: "100%" },

  card: {
    borderRadius: 25,
    overflow: "hidden",
    position: "relative",
  },

  blur: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  segment: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 999,
    padding: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  segmentBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999 },
  segmentBtnActive: { backgroundColor: "rgba(255,255,255,0.18)" },
  segmentText: { color: "rgba(255,255,255,0.70)", fontSize: 12, fontWeight: "800" },
  segmentTextActive: { color: "#fff" },

  totalBlock: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginBottom: 12,
  },
  totalLabel: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
  },
  totalValue: { color: "#fff", fontSize: 26, fontWeight: "900" },

  codesWrap: {
    backgroundColor: "rgba(0,0,0,0.18)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  codesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 10,
  },

  codesTitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 13,
    fontWeight: "900",
  },

  codesMeta: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "800",
  },

  emptyText: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    paddingVertical: 8,
    textAlign: "center",
    fontWeight: "700",
  },

  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  codePill: {
    maxWidth: "60%",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  codePillText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
  },

  codeValue: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 17,
    fontWeight: "900",
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
});
