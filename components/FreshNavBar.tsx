import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NavItem {
  name: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

const navItems: NavItem[] = [
  { name: 'home', route: '/(tabs)/home', icon: 'home', label: 'Home' },
  { name: 'shop', route: '/(tabs)/shop', icon: 'storefront', label: 'Shop' },
  { name: 'cart', route: '/(tabs)/cart', icon: 'bag', label: 'Cart' },
  { name: 'favorites', route: '/(tabs)/favorites', icon: 'heart', label: 'Favorites' },
  { name: 'profile', route: '/(tabs)/profile', icon: 'person', label: 'Profile' },
];

export default function FreshNavBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const handleNavPress = (route: string) => {
    router.push(route as any);
  };

  const isActive = (navName: string) => {
    return pathname.includes(navName);
  };

  const navBarHeight = Platform.OS === 'ios' ? 70 + insets.bottom : 70 + insets.bottom;

  return (
    <View style={[styles.container, { height: navBarHeight, paddingBottom: insets.bottom }]}>
      <View style={styles.navContent}>
        {navItems.map((item) => {
          const active = isActive(item.name);
          return (
            <TouchableOpacity
              key={item.name}
              style={styles.navItem}
              onPress={() => handleNavPress(item.route)}
              activeOpacity={1}
              delayPressIn={0}
              delayPressOut={0}
              delayLongPress={0}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={active ? '#000000' : '#9CA3AF'}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  { color: active ? '#000000' : '#9CA3AF' }
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 16,
    flex: 1,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 6,
    minHeight: 50,
  },
  iconContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
