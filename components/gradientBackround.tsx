import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function GradientBackground({ children }) {
  return (
    <LinearGradient
      colors={[
        "rgba(15, 32, 39, 0.95)", 
        "rgba(32, 58, 67, 0.9)", 
        "rgba(72, 121, 142, 0.85)"
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
