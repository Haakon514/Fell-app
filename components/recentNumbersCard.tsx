import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, StyleSheet, Animated, View, Text } from "react-native";
import { BlurView } from "expo-blur";
import { useQueries } from "@/lib/useQueries";

type Props = {
  onPress?: () => void;
};

export default function RecentNumbersCard({ onPress }: Props) {
  const { getSessionsBetweenDates } = useQueries();
  const scale = useRef(new Animated.Value(1)).current;

  const [monthTotal, setMonthTotal] = useState<number>(0);
  const [yearTotal, setYearTotal] = useState<number>(0);

  function toDayStart(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
      .toISOString();
  }

  function toDayEnd(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
      .toISOString();
  }

  /** 🗓️ Build date strings */
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

  /** 📊 Load monthly + yearly totals */
  async function loadStats() {
    const month = getCurrentMonthRange();
    const year = getCurrentYearRange();

    const monthSessions = await getSessionsBetweenDates(month.start, month.end);
    const yearSessions = await getSessionsBetweenDates(year.start, year.end);

    // Assuming each session has: volume OR total calculated wood
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

    // Animate when updated
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.12, friction: 5, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
  }

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={styles.cardWrapper}
      >

        {/* Blur layer */}
        <BlurView
          intensity={55}
          tint="light"
          experimentalBlurMethod="dimezisBlurView"
          style={styles.blur}
        >
          {/* Monthly */}
          <Animated.View style={styles.block}>
            <Text style={styles.label}>Denne måneden</Text>
            <Text style={styles.value}>{Number(monthTotal || 0).toFixed(2)} m³</Text>
          </Animated.View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Yearly */}
          <Animated.View style={styles.block}>
            <Text style={styles.label}>Dette året</Text>
            <Text style={styles.value}>{Number(yearTotal || 0).toFixed(2)} m³</Text>
          </Animated.View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 26,
    overflow: "hidden",
    minHeight: 160,
    position: "relative",

    backgroundColor: "transparent",

    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    opacity: 1,
  },

  blur: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingVertical: 24,
  },
  block: {
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4a4a4a",
    opacity: 0.7,
  },

  value: {
    fontSize: 30,
    fontWeight: "800",
    color: "#2b2b2b",
    marginTop: 2,
  },

  divider: {
    width: "60%",
    height: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginVertical: 10,
  },
});
