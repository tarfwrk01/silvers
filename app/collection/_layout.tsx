import { Stack } from 'expo-router';

export default function CollectionLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
        animationEnabled: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
