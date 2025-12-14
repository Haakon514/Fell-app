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

  const [monthTotal, setMonthTotal] = useState<number>(0);
  const [yearTotal, setYearTotal] = useState<number>(0);

  function toDayStart(date: Date) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0
    ).toISOString();
  }

  function toDayEnd(date: Date) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59
    ).toISOString();
  }

  function getCurrentMonthRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      start: toDayStart(start),
      end: toDayEnd(now),
    };
  }

  function getCurrentYearRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    return {
      start: toDayStart(start),
      end: toDayEnd(now),
    };
  }

  async function loadStats() {
    const month = getCurrentMonthRange();
    const year = getCurrentYearRange();

    const monthSessions = await getSessionsBetweenDates(
      month.start,
      month.end
    );
    const yearSessions = await getSessionsBetweenDates(year.start, year.end);

    const monthSum = (monthSessions || []).reduce(
      (sum, s) => sum + Number(s.total_volume || 0),
      0
    );

    const yearSum = (yearSessions || []).reduce(
      (sum, s) => sum + Number(s.total_volume || 0),
      0
    );

    setMonthTotal(monthSum);
    setYearTotal(yearSum);

    // liten “pop” når tallene oppdateres
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.06,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.touchArea}
      >

        {/* Gradient-bakgrunn (som på inspirasjonsbildet) */}
        <LinearGradient
          colors={["#6b6363ff", "#5e4f40ff", "#231c13ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />

        {/* Glass-lag */}
        <BlurView
          intensity={20}
          tint="dark"
          style={styles.blur}
        >
          {/* Header / tittel */}
          <View style={styles.headerRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Volum</Text>
            </View>
            <Text style={styles.headerSub}>
              Oversikt for måneden og året
            </Text>
          </View>

          {/* Innhold med to blokker */}
          <View style={styles.contentRow}>
            <View style={styles.statBlockPrimary}>
              <Text style={styles.label}>Denne måneden</Text>
              <Text style={styles.valuePrimary}>
                {Number(monthTotal || 0).toFixed(2)} m³
              </Text>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.statBlockSecondary}>
              <Text style={styles.label}>Dette året</Text>
              <Text style={styles.valueSecondary}>
                {Number(yearTotal || 0).toFixed(2)} m³
              </Text>
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: "100%",
  },
  touchArea: {
    borderRadius: 25,
    overflow: "hidden",
    minHeight: 130,
    position: "relative",
    justifyContent: "center",
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
  },

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
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  headerSub: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
  },

  contentRow: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
  },

  statBlockPrimary: {
    flex: 1.2,
  },
  statBlockSecondary: {
    flex: 1,
    alignItems: "flex-end",
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.78)",
    marginBottom: 4,
  },

  valuePrimary: {
    fontSize: 19,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  valueSecondary: {
    fontSize: 19,
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)",
  },

  verticalDivider: {
    width: 1,
    marginHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
});
