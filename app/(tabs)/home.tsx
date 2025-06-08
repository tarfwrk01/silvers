import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProductCard from '../../components/ProductCard';
import { useAuth } from '../../contexts/AuthContext';
import { useCollections } from '../../contexts/CollectionsContext';
import { useProducts } from '../../contexts/ProductsContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const { featuredProducts, loading, error, refreshProducts } = useProducts();
  const { collections, loading: collectionsLoading, error: collectionsError, refreshCollections } = useCollections();
  const insets = useSafeAreaInsets();

  const renderCollection = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.collectionCard}
      onPress={() => router.push(`/collection/${item.id}`)}
    >
      <View style={styles.collectionImageContainer}>
        <Image source={{ uri: item.image }} style={styles.collectionImage} />
      </View>
      <View style={styles.collectionInfo}>
        <Text style={styles.collectionName}>{item.name}</Text>
        {item.notes && (
          <Text style={styles.collectionNotes}>{item.notes}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.email?.split('@')[0] || 'Guest'}!</Text>
          <Text style={styles.subtitle}>What are you looking for today?</Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Collections */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Collections</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {collectionsLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.loadingText}>Loading collections...</Text>
          </View>
        ) : collectionsError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load collections</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={refreshCollections}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : collections.length > 0 ? (
          <FlatList
            data={collections.slice(0, 6)}
            renderItem={renderCollection}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.collectionsGrid}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No collections available</Text>
          </View>
        )}
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity onPress={() => router.push('/shop')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load products</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={refreshProducts}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : featuredProducts.length > 0 ? (
          <FlatList
            data={featuredProducts}
            renderItem={({ item }) => <ProductCard product={item} />}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productsGrid}
            columnWrapperStyle={styles.productRow}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No featured products available</Text>
          </View>
        )}
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  searchButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  collectionsGrid: {
    gap: 12,
  },
  collectionCard: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 6,
    marginBottom: 12,
    backgroundColor: '#6366F1',
  },
  collectionImageContainer: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  collectionImage: {
    width: '100%',
    height: '100%',
  },
  collectionInfo: {
    padding: 12,
  },
  collectionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  collectionNotes: {
    fontSize: 12,
    color: '#E5E7EB',
    textAlign: 'center',
  },
  productsGrid: {
    gap: 16,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  bottomSpacing: {
    height: 32,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
};
