import { router } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  style?: any;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with 16px margin on each side and 16px gap

export default function ProductCard({ product, style }: ProductCardProps) {
  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <TouchableOpacity
      style={[styles.container, { width: cardWidth }, style]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Sale Badge */}
        {product.originalPrice && product.originalPrice > product.price && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleText}>
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
  },
  saleBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  saleText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  content: {
    padding: 12,
  },
  brand: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
    lineHeight: 18,
  },
});
