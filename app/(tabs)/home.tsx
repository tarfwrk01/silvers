import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useCollections } from '../../contexts/CollectionsContext';
import { useProducts } from '../../contexts/ProductsContext';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const { featuredProducts, loading, error, refreshProducts } = useProducts();
  const { collections, loading: collectionsLoading, error: collectionsError, refreshCollections } = useCollections();
  const { itemCount } = useCart();
  const insets = useSafeAreaInsets();
  const [showMenu, setShowMenu] = useState(false);



  const renderNavigationMenu = () => (
    <Modal
      visible={showMenu}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setShowMenu(false)}
    >
      <View style={styles.menuOverlay}>
        <View style={styles.menuContainer}>
          {/* Header with close button */}
          <View style={styles.menuHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowMenu(false)}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContent}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                router.push('/(tabs)/shop');
              }}
            >
              <Text style={styles.menuItemText}>NEW COLLECTIONS</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                router.push('/(tabs)/shop');
              }}
            >
              <Text style={styles.menuItemText}>MAN</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                router.push('/(tabs)/shop');
              }}
            >
              <Text style={styles.menuItemText}>WOMAN</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                router.push('/(tabs)/favorites');
              }}
            >
              <Text style={styles.menuItemText}>WISHLIST</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                router.push('/(tabs)/shop');
              }}
            >
              <Text style={styles.menuItemText}>ALL</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Background jewelry images */}
          <View style={styles.menuBackgroundImages}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' }}
              style={styles.menuBgImage1}
            />
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop' }}
              style={styles.menuBgImage2}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderCollectionItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.collectionItem}
      onPress={() => router.push(`/collection/${item.id}`)}
    >
      <View style={styles.collectionCircle}>
        <Image
          source={{ uri: item.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop' }}
          style={styles.collectionImage}
        />
      </View>
      <Text style={styles.collectionTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        {/* Title at the very top */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>SKJ SILVERS</Text>
          <Text style={styles.subTitle}>
            DISCOVER YOUR <Text style={styles.subTitleAccent}>UNIQUE STYLE</Text>{'\n'}
          </Text>
        </View>

        {/* Our Collections Section */}
        <Text style={styles.collectionsHeader}>OUR COLLECTIONS</Text>

        {/* Collections Grid - starts right below title */}
        <View style={styles.collectionsContainer}>
          {collectionsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.loadingText}>Loading collections...</Text>
            </View>
          ) : collections.length > 0 ? (
            <FlatList
              data={collections}
              renderItem={renderCollectionItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.collectionsGrid}
              columnWrapperStyle={styles.collectionRow}
            />
          ) : (
            // Fallback collections if no data
            <View style={styles.collectionsGrid}>
              <View style={styles.collectionRow}>
                <TouchableOpacity style={styles.collectionItem}>
                  <View style={styles.collectionCircle}>
                    <Image
                      source={{ uri: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop' }}
                      style={styles.collectionImage}
                    />
                  </View>
                  <Text style={styles.collectionTitle}>Necklaces</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.collectionItem}>
                  <View style={styles.collectionCircle}>
                    <Image
                      source={{ uri: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=300&h=300&fit=crop' }}
                      style={styles.collectionImage}
                    />
                  </View>
                  <Text style={styles.collectionTitle}>Rings</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Browse Button */}
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => router.push('/necklaces')}
        >
          <Text style={styles.browseButtonText}>BROWSE</Text>
          <Ionicons name="arrow-forward" size={20} color="#2D5A3D" />
        </TouchableOpacity>

        {/* Bottom decorative element */}
        <View style={styles.bottomDecorative}>
          <View style={styles.decorativeElement}>
            <View style={styles.decorativeDot} />
            <View style={styles.decorativeLine} />
          </View>
        </View>
      </View>

      {renderNavigationMenu()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A8A', // Dark blue background
  },

  // Hero Section Styles
  heroSection: {
    flex: 1,
    paddingTop: 50, // Reduced space at top for title
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  titleContainer: {
    alignItems: 'center',
    marginBottom: 30, // Reduced spacing between title and collections
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#D4AF37', // Gold color for main title
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.5,
  },
  subTitleAccent: {
    color: '#D4AF37', // Gold color for "UNIQUE"
  },

  collectionsHeader: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 20,
    marginTop: 10,
  },

  collectionsContainer: {
    flex: 1,
    marginBottom: 40,
  },
  collectionsGrid: {
    paddingHorizontal: 10,
  },
  collectionRow: {
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  collectionItem: {
    alignItems: 'center',
    width: (width - 60) / 2, // Two columns with proper spacing
  },
  collectionCircle: {
    width: 140,
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 12,
  },
  collectionImage: {
    width: '100%',
    height: '100%',
  },
  collectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
  },
  browseButtonText: {
    color: '#1E3A8A',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    letterSpacing: 1,
  },

  bottomDecorative: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  decorativeElement: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  decorativeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4AF37',
    marginRight: 8,
  },
  decorativeLine: {
    width: 30,
    height: 1,
    backgroundColor: '#FFFFFF',
    opacity: 0.5,
  },

  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 12,
    opacity: 0.8,
  },

  // Menu Overlay Styles
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    width: width * 0.85,
    height: height * 0.7,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuContent: {
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    letterSpacing: 0.5,
  },

  menuBackgroundImages: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    opacity: 0.3,
  },
  menuBgImage1: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  menuBgImage2: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'absolute',
    bottom: 60,
    right: 30,
  },
});
