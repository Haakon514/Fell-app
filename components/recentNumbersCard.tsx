import React, { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  View,
  Text,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useQueries } from "@/lib/useQueries";

export default function RecentNumbersCard() {
  const { getSessionsBetweenDates } = useQueries();
  const scale = useRef(new Animated.Value(1)).current;

  const [weekTotal, setWeekTotal] = useState<number>(0);
  const [monthTotal, setMonthTotal] = useState<number>(0);

  // Helpers
  function toDayStart(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
      .toISOString();
  }

  function toDayEnd(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
      .toISOString();
  }

  function getCurrentMonthRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { start: toDayStart(start), end: toDayEnd(now) };
  }

  // ⭐ NEW: Week calculation
  function getCurrentWeekRange() {
    const now = new Date();

    // Sunday (0) → convert to Monday (-6)
    const day = now.getDay();
    const diffToMonday = (day === 0 ? -6 : 1 - day);

    const monday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + diffToMonday
    );

    return {
      start: toDayStart(monday),
      end: toDayEnd(now),
    };
  }

  async function loadStats() {
    const week = getCurrentWeekRange();
    const month = getCurrentMonthRange();

    const weekSessions = await getSessionsBetweenDates(week.start, week.end);
    const monthSessions = await getSessionsBetweenDates(month.start, month.end);

    const weekSum = (weekSessions || []).reduce(
      (sum, s) => sum + Number(s.total_volume || 0),
      0
    );

    const monthSum = (monthSessions || []).reduce(
      (sum, s) => sum + Number(s.total_volume || 0),
      0
    );

    setWeekTotal(weekSum);
    setMonthTotal(monthSum);

    // Cute scale animation
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.06, friction: 6, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 7, useNativeDriver: true }),
    ]).start();
  }

  useEffect(() => {
    loadStats();
  }, []);

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
            <Text style={styles.headerSub}>Oversikt for uke og måned</Text>
          </View>

          <View style={styles.contentRow}>
            <View style={styles.statBlockPrimary}>
              <Text style={styles.label}>Denne uken</Text>
              <Text style={styles.valuePrimary}>
                {weekTotal.toFixed(2)} m³
              </Text>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.statBlockSecondary}>
              <Text style={styles.label}>Denne måneden</Text>
              <Text style={styles.valueSecondary}>
                {monthTotal.toFixed(2)} m³
              </Text>
            </View>
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
    minHeight: 130,
    position: "relative",
    justifyContent: "center",
  },

  gradient: { ...StyleSheet.absoluteFillObject },

  blur: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    justifyContent: "center",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  headerSub: { color: "rgba(255,255,255,0.78)", fontSize: 12 },

  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statBlockPrimary: { flex: 1.2 },
  statBlockSecondary: { flex: 1, alignItems: "flex-end" },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.78)",
    marginBottom: 4,
  },
  valuePrimary: { fontSize: 19, fontWeight: "800", color: "#fff" },
  valueSecondary: { fontSize: 19, fontWeight: "700", color: "#fff" },

  verticalDivider: {
    width: 1,
    marginHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
});
