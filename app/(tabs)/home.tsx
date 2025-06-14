import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useCategories } from '../../contexts/CategoriesContext';
import { useCollections } from '../../contexts/CollectionsContext';
import { useProducts } from '../../contexts/ProductsContext';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const { featuredProducts, loading, error, refreshProducts } = useProducts();
  const { categories, loading: categoriesLoading, error: categoriesError, refreshCategories } = useCategories();
  const { collections, loading: collectionsLoading, error: collectionsError, refreshCollections } = useCollections();
  const { itemCount } = useCart();
  const insets = useSafeAreaInsets();
  const [showMenu, setShowMenu] = useState(false);

  // Sample offers data
  const offers = [
    {
      id: 1,
      title: "Lowest Price",
      subtitle: "On Market",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "New Arrivals",
      subtitle: "Every Week",
      image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=200&fit=crop"
    }
  ];



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

  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => router.push(`/(tabs)/shop?category=${encodeURIComponent(item.name)}`)}
    >
      <View style={styles.categoryCircle}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop' }}
          style={styles.categoryImage}
        />
      </View>
      <Text style={styles.categoryTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderOfferItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.offerCard}>
      <Image
        source={{ uri: item.image }}
        style={styles.offerImage}
      />
      <View style={styles.offerOverlay}>
        <Text style={styles.offerTitle}>{item.title}</Text>
        <Text style={styles.offerSubtitle}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {/* Title at the very top */}
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>SKJ SILVERS</Text>
            <Text style={styles.subTitle}>
              Discover your individual style;{'\n'}make yourself elegant.
            </Text>
          </View>

          {/* Offers Section */}
          <View style={styles.offersContainer}>
            <FlatList
              data={offers}
              renderItem={renderOfferItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.offersContent}
              snapToInterval={width * 0.85 + 16} // Snap to card width + margin
              decelerationRate="fast"
              pagingEnabled={false}
            />
          </View>

        </View>

        {/* Space below offers */}
        <View style={styles.spaceBelowOffers} />

        {/* White Background Container for Collections and Categories */}
        <View style={styles.whiteBackgroundContainer}>
          {/* Our Collections Section */}
          <Text style={styles.collectionsHeader}>OUR COLLECTIONS</Text>

          {/* Collections Grid - starts right below title */}
          <View style={styles.collectionsContainer}>
          {collectionsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#333333" />
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
                <TouchableOpacity
                  style={styles.collectionItem}
                  onPress={() => router.push('/(tabs)/shop?collection=Necklaces')}
                >
                  <View style={styles.collectionCircle}>
                    <Image
                      source={{ uri: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop' }}
                      style={styles.collectionImage}
                    />
                  </View>
                  <Text style={styles.collectionTitle}>Necklaces</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.collectionItem}
                  onPress={() => router.push('/(tabs)/shop?collection=Rings')}
                >
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

          {/* Categories Section */}
          <Text style={styles.categoriesHeader}>CATEGORIES</Text>



          {/* Categories Grid */}
          <View style={styles.categoriesContainer}>
            {categoriesLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#333333" />
                <Text style={styles.loadingTextDark}>Loading categories...</Text>
              </View>
            ) : categories.length > 0 ? (
              <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                scrollEnabled={false}
                contentContainerStyle={styles.categoriesGrid}
                columnWrapperStyle={styles.categoryRow}
              />
            ) : (
              // Fallback categories if no data
              <View style={styles.categoriesGrid}>
                <View style={styles.categoryRow}>
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => router.push('/(tabs)/shop?category=Rings')}
                  >
                    <View style={styles.categoryCircle}>
                      <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop' }}
                        style={styles.categoryImage}
                      />
                    </View>
                    <Text style={styles.categoryTitle}>Rings</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => router.push('/(tabs)/shop?category=Earrings')}
                  >
                    <View style={styles.categoryCircle}>
                      <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=300&h=300&fit=crop' }}
                        style={styles.categoryImage}
                      />
                    </View>
                    <Text style={styles.categoryTitle}>Earrings</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.categoryRow}>
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => router.push('/(tabs)/shop?category=Necklaces')}
                  >
                    <View style={styles.categoryCircle}>
                      <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop' }}
                        style={styles.categoryImage}
                      />
                    </View>
                    <Text style={styles.categoryTitle}>Necklaces</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => router.push('/(tabs)/shop?category=Bracelets')}
                  >
                    <View style={styles.categoryCircle}>
                      <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop' }}
                        style={styles.categoryImage}
                      />
                    </View>
                    <Text style={styles.categoryTitle}>Bracelets</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Bottom decorative element */}
        <View style={styles.bottomDecorative}>
          <View style={styles.decorativeElement}>
            <View style={styles.decorativeDot} />
            <View style={styles.decorativeLine} />
          </View>
        </View>
      </ScrollView>

      {renderNavigationMenu()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Very light silver/white background
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40, // Proper bottom spacing
  },

  // Hero Section Styles
  heroSection: {
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: '#42948a', // Teal background color
    alignItems: 'center',
  },

  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 24,
    maxWidth: 320,
    alignSelf: 'center',
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1.2,
    marginBottom: 12,
    fontFamily: 'Montserrat',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: 0.3,
    opacity: 0.92,
    fontFamily: 'System',
    maxWidth: 280,
    marginHorizontal: 'auto',
  },

  // Offers Section Styles
  offersContainer: {
    width: '100%',
  },
  offersContent: {
    paddingLeft: 20,
    paddingRight: 4, // Reduced right padding to prevent cut-off
  },
  offerCard: {
    width: width * 0.85, // Responsive width
    height: 140,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  offerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  offerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
  },
  offerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  offerSubtitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    opacity: 0.95,
    letterSpacing: 0.3,
  },

  // Space below offers
  spaceBelowOffers: {
    height: 20,
    backgroundColor: '#42948a',
  },

  // White Background Container for Collections and Categories
  whiteBackgroundContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 40, // Ensure proper bottom spacing
    minHeight: 400, // Prevent container collapse
  },

  collectionsHeader: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'left',
    letterSpacing: 0.5,
    marginBottom: 24,
    marginTop: 30,
    paddingHorizontal: 20,
  },

  collectionsContainer: {
    paddingBottom: 20, // Reduced to give more space for categories
  },
  collectionsGrid: {
    paddingHorizontal: 16,
  },
  collectionRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  collectionItem: {
    alignItems: 'center',
    width: (width - 40) / 2,
    paddingHorizontal: 4,
  },
  collectionCircle: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: 12,
  },
  collectionImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  collectionTitle: {
    color: '#333333',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 20,
  },

  // Categories Section Styles
  categoriesHeader: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'left',
    letterSpacing: 0.5,
    marginBottom: 24,
    marginTop: 30,
    paddingHorizontal: 20,
  },

  categoriesContainer: {
    paddingBottom: 60, // Extra bottom spacing for categories
  },
  categoriesGrid: {
    paddingHorizontal: 16,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryItem: {
    alignItems: 'center',
    width: (width - 40) / 2,
    paddingHorizontal: 4,
  },
  categoryCircle: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: 12,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryTitle: {
    color: '#333333',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 20,
  },



  bottomDecorative: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 20,
  },
  decorativeElement: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  decorativeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1E3A8A', // Dark sky blue to match theme
    marginRight: 8,
  },
  decorativeLine: {
    width: 30,
    height: 1,
    backgroundColor: '#333333', // Dark line for light background
    opacity: 0.5,
  },

  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    minHeight: 200, // Prevent container distortion during loading
    justifyContent: 'center',
  },
  loadingText: {
    color: '#333333', // Dark text for light background
    fontSize: 14,
    marginTop: 12,
    opacity: 0.8,
  },
  loadingTextDark: {
    color: '#333333', // Dark text for categories loading
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
