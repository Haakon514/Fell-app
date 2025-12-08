import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

type Props = {
  name: string;
  onPress?: () => void;
  image?: string; // optional user avatar url
};

export default function ProfileCircle({ name, onPress, image }: Props) {
  // Extract initials (first two letters)
  const initials = name
    ? name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "??";

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {image ? (
        <Image source={{ uri: image }} style={styles.avatar} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
      )}

      <Text style={styles.name}>{name || "Ukjent bruker"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 100,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#444",
  },

  placeholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },

  initials: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  name: {
    marginLeft: 10,
    fontSize: 18,
    color: "#fff",
    fontWeight: "500",
  },
});
