import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import AuthenticatedScreen from "../components/AuthenticatedScreen";
import LoginScreen from "../components/LoginScreen";
import { useAuth } from "../contexts/AuthContext";

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return user ? <AuthenticatedScreen /> : <LoginScreen />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});
