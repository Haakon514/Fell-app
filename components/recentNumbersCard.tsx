import React, { useEffect, useMemo, useRef, useState } from "react";
import { TouchableOpacity, StyleSheet, Animated, View, Text } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useQueries } from "@/lib/useQueries";
import { appEvents } from "@/lib/events";
import { useSQLiteContext } from "expo-sqlite";
import { TreeCalculation } from "@/types/treeCalculation";

export default function RecentNumbersCard() {
  const { getSessionsBetweenDates } = useQueries();
  const db = useSQLiteContext();
  const scale = useRef(new Animated.Value(1)).current;

  const [weekTotal, setWeekTotal] = useState<number>(0);
  const [monthTotal, setMonthTotal] = useState<number>(0);
  const [weeklyCalculations, setWeeklyCalculations] = useState<TreeCalculation[]>([]);
  const [monthlyCalculations, setMonthlyCalculations] = useState<TreeCalculation[]>([]);
  const [period, setPeriod] = useState<"week" | "month">("week");

  // ✅ Better UX: expand/collapse instead of nested scrolling
  const [expanded, setExpanded] = useState(false);
  const COLLAPSED_COUNT = 6;

  function toDayStart(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).toISOString();
  }
  function toDayEnd(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).toISOString();
  }

  function getCurrentMonthRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { start: toDayStart(start), end: toDayEnd(now) };
  }

  function getCurrentWeekRange() {
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
    return { start: toDayStart(monday), end: toDayEnd(now) };
  }

  // DB columns: sortiment_kode, volum
  function getSortimentCode(c: TreeCalculation) {
    // @ts-ignore
    return String(c.sortiment_kode ?? "Ukjent");
  }
  function getCalcVolume(c: TreeCalculation) {
    // @ts-ignore
    return Number(c.volum ?? 0) || 0;
  }

  type CodeTotal = { code: string; volume: number };

  function aggregateBySortiment(calcs: TreeCalculation[]): CodeTotal[] {
    const map = new Map<string, number>();
    for (const c of calcs) {
      const code = getSortimentCode(c);
      const vol = getCalcVolume(c);
      map.set(code, (map.get(code) ?? 0) + vol);
    }
    return Array.from(map.entries())
      .map(([code, volume]) => ({ code, volume }))
      .sort((a, b) => b.volume - a.volume);
  }

  const weekByCode = useMemo(() => aggregateBySortiment(weeklyCalculations), [weeklyCalculations]);
  const monthByCode = useMemo(
    () => aggregateBySortiment(monthlyCalculations),
    [monthlyCalculations]
  );

  const byCode = period === "week" ? weekByCode : monthByCode;
  const total = period === "week" ? weekTotal : monthTotal;

  const visibleCodes = expanded ? byCode : byCode.slice(0, COLLAPSED_COUNT);
  const hiddenCount = Math.max(0, byCode.length - COLLAPSED_COUNT);

  async function loadStats() {
    const week = getCurrentWeekRange();
    const month = getCurrentMonthRange();

    const weekSessions = await getSessionsBetweenDates(week.start, week.end);
    const monthSessions = await getSessionsBetweenDates(month.start, month.end);

    const weekCalcArrays = await Promise.all(
      (weekSessions ?? []).map((session) =>
        db.getAllAsync<TreeCalculation>(
          `SELECT * FROM treecalculations WHERE session_id = ? ORDER BY id DESC`,
          [session.id]
        )
      )
    );
    setWeeklyCalculations(weekCalcArrays.flat());

    const monthCalcArrays = await Promise.all(
      (monthSessions ?? []).map((session) =>
        db.getAllAsync<TreeCalculation>(
          `SELECT * FROM treecalculations WHERE session_id = ? ORDER BY id DESC`,
          [session.id]
        )
      )
    );
    setMonthlyCalculations(monthCalcArrays.flat());

    const weekSum = (weekSessions ?? []).reduce((sum, s) => sum + Number(s.total_volume || 0), 0);
    const monthSum = (monthSessions ?? []).reduce(
      (sum, s) => sum + Number(s.total_volume || 0),
      0
    );

    setWeekTotal(weekSum);
    setMonthTotal(monthSum);

    Animated.sequence([
      Animated.spring(scale, { toValue: 1.06, friction: 6, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 7, useNativeDriver: true }),
    ]).start();
  }

  useEffect(() => {
    const sub = appEvents.addListener("sessionUpdated", () => loadStats());
    return () => sub.remove();
  }, []);

  useEffect(() => {
    loadStats();
  }, []);

  // If user switches period, collapse list for clean UX
  useEffect(() => {
    setExpanded(false);
  }, [period]);

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale }] }]}>
      <TouchableOpacity activeOpacity={0.9} style={styles.touchArea}>
        <LinearGradient
          colors={["#5c5d60ff", "#2c2d31ff", "#1b1b1fff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />

        <BlurView intensity={20} tint="dark" style={styles.blur}>
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

          {/* TOTAL */}
          <View style={styles.totalBlock}>
            <Text style={styles.totalLabel}>
              {period === "week" ? "Totalt denne uken" : "Totalt denne måneden"}
            </Text>
            <Text style={styles.totalValue}>{total.toFixed(2)} m³</Text>
          </View>

          {/* Totals per sortiment_kode (no nested scroll) */}
          <View style={styles.codesListWrap}>
            <View style={styles.codesTitleRow}>
              <Text style={styles.codesTitle}>Total fordelt på sortiment</Text>
              <Text style={styles.codesCount}>{byCode.length} koder</Text>
            </View>

            {byCode.length === 0 ? (
              <Text style={styles.codesEmpty}>Ingen sortiment i valgt periode</Text>
            ) : (
              <>
                {visibleCodes.map((item, idx) => (
                  <View key={item.code}>
                    <View style={styles.codeRow}>
                      <View style={styles.codePill}>
                        <Text style={styles.codeText} numberOfLines={1}>
                          {item.code}
                        </Text>
                      </View>

                      <Text style={styles.codeVolume}>{item.volume.toFixed(2)} m³</Text>
                    </View>

                    {idx !== visibleCodes.length - 1 && <View style={styles.rowDivider} />}
                  </View>
                ))}

                {hiddenCount > 0 && !expanded && (
                  <TouchableOpacity
                    onPress={() => setExpanded(true)}
                    style={styles.moreBtn}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.moreBtnText}>Vis alle (+{hiddenCount})</Text>
                  </TouchableOpacity>
                )}

                {expanded && byCode.length > COLLAPSED_COUNT && (
                  <TouchableOpacity
                    onPress={() => setExpanded(false)}
                    style={styles.moreBtn}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.moreBtnText}>Skjul</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: { width: "100%" },
  touchArea: {
    borderRadius: 25,
    overflow: "hidden",
    minHeight: 400,
    position: "relative",
  },
  gradient: { ...StyleSheet.absoluteFillObject },

  blur: {
    ...StyleSheet.absoluteFillObject,
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
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "600" },

  segment: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 999,
    padding: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  segmentBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  segmentBtnActive: { backgroundColor: "rgba(255,255,255,0.18)" },
  segmentText: { color: "rgba(255,255,255,0.70)", fontSize: 12, fontWeight: "700" },
  segmentTextActive: { color: "#fff" },

  totalBlock: {
    paddingVertical: 10,
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
    fontWeight: "700",
    marginBottom: 6,
  },
  totalValue: { color: "#fff", fontSize: 22, fontWeight: "900" },

  codesListWrap: {
    backgroundColor: "rgba(0,0,0,0.18)",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  codesTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  codesTitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "800",
  },

  codesCount: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "700",
  },

  codesEmpty: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    paddingVertical: 6,
    textAlign: "center",
  },

  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  codePill: {
    maxWidth: "62%",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  codeText: { color: "#fff", fontSize: 13, fontWeight: "800" },
  codeVolume: { color: "rgba(255,255,255,0.88)", fontSize: 13, fontWeight: "700" },

  rowDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.10)" },

  moreBtn: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  moreBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
    opacity: 0.9,
  },
});
