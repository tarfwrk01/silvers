import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProductOptions from '../../components/ProductOptions';
import ZoomableImage from '../../components/ZoomableImage';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useProduct } from '../../contexts/ProductsContext';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({});
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const { addToCart, isInCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { product, loading, error } = useProduct(id as string);
  const insets = useSafeAreaInsets();

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Failed to load product</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedOptions);
    // No success dialog - item is silently added to cart
  };

  const renderRating = () => {
    const stars = [];
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={16} color="#FCD34D" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#FCD34D" />
      );
    }

    const emptyStars = 5 - Math.ceil(product.rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#D1D5DB" />
      );
    }

    return stars;
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Images with Overlay Header */}
        <View style={styles.imageContainer}>
          <TouchableOpacity
            style={styles.mainImageTouchable}
            activeOpacity={0.9}
            onPress={() => setIsImageZoomed(true)}
          >
            <Image
              source={{ uri: product.images[selectedImageIndex] }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Transparent Header Overlay */}
          <View style={[styles.headerOverlay, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity
              style={styles.overlayButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.overlayButton}
              onPress={() => toggleFavorite(product)}
            >
              <Ionicons
                name={isFavorite(product.id) ? "heart" : "heart-outline"}
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {product.images.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.thumbnailContainer}
              contentContainerStyle={styles.thumbnailContent}
            >
              {product.images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.thumbnail,
                    selectedImageIndex === index && styles.selectedThumbnail,
                  ]}
                  onPress={() => setSelectedImageIndex(index)}
                >
                  <Image source={{ uri: image }} style={styles.thumbnailImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>

          {/* Brand and Vendor Cards */}
          <View style={styles.infoCardsContainer}>
            {product.brand && (
              <View style={styles.infoCard}>
                <Text style={styles.infoCardLabel}>Brand</Text>
                <Text style={styles.infoCardValue}>{product.brand}</Text>
              </View>
            )}
            {product.vendor && (
              <View style={styles.infoCard}>
                <Text style={styles.infoCardLabel}>Vendor</Text>
                <Text style={styles.infoCardValue}>{product.vendor}</Text>
              </View>
            )}
          </View>

          {/* Product Options */}
          {product.options && product.options.length > 0 && (
            <ProductOptions
              options={product.options}
              onSelectionChange={setSelectedOptions}
            />
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Features</Text>
              {product.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark" size={16} color="#10B981" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </>
          )}

          {/* Specifications */}
          {product.specifications && (
            <>
              <Text style={styles.sectionTitle}>Specifications</Text>
              {Object.entries(product.specifications).map(([key, value]) => (
                <View key={key} style={styles.specItem}>
                  <Text style={styles.specKey}>{key}:</Text>
                  <Text style={styles.specValue}>{value}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Ionicons name="remove" size={20} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Ionicons name="add" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Ionicons
            name={isInCart(product.id) ? "checkmark" : "bag"}
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles.addToCartText}>
            {isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image Zoom Modal */}
      <Modal
        visible={isImageZoomed}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsImageZoomed(false)}
      >
        <View style={styles.zoomModalContainer}>
          <TouchableOpacity
            style={styles.zoomModalOverlay}
            activeOpacity={1}
            onPress={() => setIsImageZoomed(false)}
          >
            <View style={styles.zoomModalHeader}>
              <TouchableOpacity
                style={styles.zoomCloseButton}
                onPress={() => setIsImageZoomed(false)}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <ZoomableImage
              source={{ uri: product.images[selectedImageIndex] }}
              style={styles.zoomImageContainer}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    backgroundColor: '#F9FAFB',
    position: 'relative',
  },
  mainImageTouchable: {
    width: width,
    height: width * 0.8,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  overlayButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
  },
  thumbnailContainer: {
    paddingVertical: 16,
  },
  thumbnailContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: '#6366F1',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    lineHeight: 36,
  },
  infoCardsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  infoCardLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  infoCardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    marginTop: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
    flex: 1,
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  specKey: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    color: '#1F2937',
    flex: 2,
    textAlign: 'right',
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 4,
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  zoomModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  zoomModalOverlay: {
    flex: 1,
  },
  zoomModalHeader: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  zoomCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
