import { Redirect, Stack } from "expo-router";
import { View } from "react-native";
import FreshNavBar from "../../components/FreshNavBar";
import { useAuth } from "../../contexts/AuthContext";

export default function TabsLayout() {
  const { user, isLoading } = useAuth();

  // If user is not authenticated, redirect to auth
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
          animationEnabled: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="home" />
        <Stack.Screen name="shop" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="favorites" />
        <Stack.Screen name="profile" />
      </Stack>
      <FreshNavBar />
    </View>
  );
}
