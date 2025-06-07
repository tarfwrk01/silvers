import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "../contexts/CartContext";
import { CollectionsProvider } from "../contexts/CollectionsContext";
import { FavoritesProvider } from "../contexts/FavoritesContext";
import { ProductsProvider } from "../contexts/ProductsContext";
import "../polyfills";

function RootLayoutContent() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar style="dark" translucent={false} backgroundColor="#FFFFFF" />
      {/* Status bar background for Android */}
      {Platform.OS === 'android' && (
        <View
          style={{
            height: insets.top,
            backgroundColor: '#FFFFFF'
          }}
        />
      )}
      <AuthProvider>
        <ProductsProvider>
          <CollectionsProvider>
            <CartProvider>
              <FavoritesProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: "none",
                    animationEnabled: false,
                    gestureEnabled: false,
                  }}
                >
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(tabs)" />
                </Stack>
              </FavoritesProvider>
            </CartProvider>
          </CollectionsProvider>
        </ProductsProvider>
      </AuthProvider>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RootLayoutContent />
    </SafeAreaProvider>
  );
}
