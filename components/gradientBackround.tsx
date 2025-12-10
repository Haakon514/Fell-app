import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function GradientBackground({ children }) {
  return (
    <LinearGradient
      colors={[
        "#ffffffff",
        "#ffffffff",
        "#ffffffff",
        "#5B78F4"
      ]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
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
