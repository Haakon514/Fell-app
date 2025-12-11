import React from "react";
import { ImageBackground, StyleSheet } from "react-native";

export default function GradientBackground({ children }) {
  return (
    <ImageBackground
      source={require("@/assets/backgrounds/lumberjack.png")} // <-- add your file here
      style={styles.container}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
