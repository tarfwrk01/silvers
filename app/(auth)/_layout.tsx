import { Stack } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { Redirect } from "expo-router";

export default function AuthLayout() {
  const { user } = useAuth();

  // If user is authenticated, redirect to main app
  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#f5f5f5" },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
