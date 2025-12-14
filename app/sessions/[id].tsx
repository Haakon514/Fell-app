import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import SessionCalculations from "@/components/sessionsCalculations";

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kalkulasjoner</Text>

      <SessionCalculations sessionId={Number(id)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#dedcdcff",
    marginBottom: 6,
    marginTop: 15,
  },
});
