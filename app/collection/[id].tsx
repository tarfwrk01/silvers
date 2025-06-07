import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProductCard from '../../components/ProductCard';
import { tursoApi } from '../../services/tursoApi';
import { Collection, Product } from '../../types';

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'price_asc' | 'price_desc' | 'newest'>('name');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchCollectionData();
  }, [id]);

  const fetchCollectionData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch collection details
      const collectionData = await tursoApi.fetchCollectionById(Number(id));
      if (!collectionData) {
        setError('Collection not found');
        return;
      }
      setCollection(collectionData);

      // Fetch products in this collection
      const productsData = await tursoApi.fetchProductsByCollection(collectionData.name);
      setProducts(productsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load collection');
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = React.useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'name':
      default:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [products, sortBy]);

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard product={item} style={styles.productCard} />
  );

  const renderSortOption = (option: typeof sortBy, label: string) => (
    <TouchableOpacity
      key={option}
      style={[
        styles.sortOption,
        sortBy === option && styles.sortOptionActive,
      ]}
      onPress={() => setSortBy(option)}
    >
      <Text
        style={[
          styles.sortOptionText,
          sortBy === option && styles.sortOptionTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading collection...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle" size={64} color="#EF4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCollectionData}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Collection</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Collection Info */}
        {collection && (
          <View style={styles.collectionInfo}>
            <Image source={{ uri: collection.image }} style={styles.collectionImage} />
            <View style={styles.collectionDetails}>
              <Text style={styles.collectionName}>{collection.name}</Text>
              {collection.notes && (
                <Text style={styles.collectionDescription}>{collection.notes}</Text>
              )}
              <Text style={styles.productCount}>
                {products.length} {products.length === 1 ? 'product' : 'products'}
              </Text>
            </View>
          </View>
        )}

        {/* Sort Options */}
        <View style={styles.sortSection}>
          <Text style={styles.sortTitle}>Sort by:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sortOptions}
          >
            {renderSortOption('name', 'Name')}
            {renderSortOption('price_asc', 'Price: Low to High')}
            {renderSortOption('price_desc', 'Price: High to Low')}
            {renderSortOption('newest', 'Newest')}
          </ScrollView>
        </View>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <FlatList
            data={sortedProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productsGrid}
            columnWrapperStyle={styles.productRow}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="bag-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Products Found</Text>
            <Text style={styles.emptyDescription}>
              This collection doesn't have any products yet.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  collectionInfo: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  collectionImage: {
    width: '100%',
    height: 200,
  },
  collectionDetails: {
    padding: 20,
  },
  collectionName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  collectionDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 12,
  },
  productCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  sortSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sortTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  sortOptions: {
    paddingRight: 16,
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  sortOptionActive: {
    backgroundColor: '#6366F1',
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  sortOptionTextActive: {
    color: '#FFFFFF',
  },
  productsGrid: {
    paddingHorizontal: 16,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
