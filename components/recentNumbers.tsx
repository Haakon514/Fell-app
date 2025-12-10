import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

type Props = {
  value: number;
  label?: string;
};

export default function RecentNumbers({ value, label }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate whenever value changes
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [value]);

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Text style={styles.value}>{value}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
  },
  label: {
    color: "#666",
    fontSize: 12,
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
  },
});
