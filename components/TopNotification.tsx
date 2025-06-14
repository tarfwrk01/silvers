import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TopNotificationProps {
  message: string;
  type: 'error' | 'success' | 'info';
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
}

export default function TopNotification({
  message,
  type,
  visible,
  onDismiss,
  duration = 2000,
}: TopNotificationProps) {
  const insets = useSafeAreaInsets();
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (visible) {
      // Slide down
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto dismiss after duration
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  if (!visible) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'error':
        return '#FEE2E2';
      case 'success':
        return '#D1FAE5';
      case 'info':
        return '#DBEAFE';
      default:
        return '#F3F4F6';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'error':
        return '#DC2626';
      case 'success':
        return '#059669';
      case 'info':
        return '#2563EB';
      default:
        return '#374151';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return 'alert-circle';
      case 'success':
        return 'checkmark-circle';
      case 'info':
        return 'information-circle';
      default:
        return 'information-circle';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: getBackgroundColor(),
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons
          name={getIcon()}
          size={20}
          color={getTextColor()}
          style={styles.icon}
        />
        <Text style={[styles.message, { color: getTextColor() }]}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
});
