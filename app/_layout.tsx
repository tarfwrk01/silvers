import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import "../polyfills";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack />
    </AuthProvider>
  );
}
