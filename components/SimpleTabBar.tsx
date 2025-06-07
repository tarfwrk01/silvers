import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabItem {
  name: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

const tabs: TabItem[] = [
  { name: 'home', route: '/(tabs)/home', icon: 'home', label: 'Home' },
  { name: 'shop', route: '/(tabs)/shop', icon: 'storefront', label: 'Shop' },
  { name: 'cart', route: '/(tabs)/cart', icon: 'bag', label: 'Cart' },
  { name: 'favorites', route: '/(tabs)/favorites', icon: 'heart', label: 'Favorites' },
  { name: 'profile', route: '/(tabs)/profile', icon: 'person', label: 'Profile' },
];

export default function SimpleTabBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  const isActive = (tabName: string) => {
    return pathname.includes(tabName);
  };

  const tabBarHeight = Platform.OS === 'ios' ? 85 + insets.bottom : 85 + insets.bottom;

  return (
    <View style={[styles.container, { height: tabBarHeight, paddingBottom: insets.bottom + 10 }]}>
      {tabs.map((tab) => {
        const active = isActive(tab.name);
        return (
          <TouchableWithoutFeedback
            key={tab.name}
            onPress={() => handleTabPress(tab.route)}
          >
            <View style={styles.tab}>
              <Ionicons
                name={tab.icon}
                size={24}
                color={active ? '#6366F1' : '#9CA3AF'}
              />
              <Text
                style={[
                  styles.label,
                  { color: active ? '#6366F1' : '#9CA3AF' }
                ]}
              >
                {tab.label}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
