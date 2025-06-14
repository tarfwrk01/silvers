import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
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
import { useCollections } from '../../contexts/CollectionsContext';
import { useProducts } from '../../contexts/ProductsContext';
import { Product } from '../../types';

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams();
  const { products: allProducts, loading: productsLoading } = useProducts();
  const { collections } = useCollections();
  const [sortBy, setSortBy] = useState<'name' | 'newest'>('name');
  const insets = useSafeAreaInsets();

  // Find collection from the already loaded collections
  const collection = useMemo(() => {
    return collections.find(c => c.id.toString() === id) || null;
  }, [collections, id]);

  // Filter products by collection name
  const filteredProducts = useMemo(() => {
    if (!collection || !allProducts.length) return [];

    console.log('Filtering products for collection:', collection.name);
    console.log('Total products available:', allProducts.length);

    const filtered = allProducts.filter(product => {
      // Check if product has a collection field and it matches the collection name
      const hasCollection = product.collection &&
        product.collection.toLowerCase().trim() === collection.name.toLowerCase().trim();

      if (product.collection) {
        console.log(`Product "${product.name}" has collection: "${product.collection}" (matches: ${hasCollection})`);
      }

      return hasCollection;
    });

    console.log('Filtered products count:', filtered.length);
    return filtered;
  }, [allProducts, collection]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'name':
      default:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [filteredProducts, sortBy]);

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

  if (productsLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading collection...</Text>
      </View>
    );
  }

  if (!collection) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle" size={64} color="#EF4444" />
        <Text style={styles.errorText}>Collection not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{collection?.name || 'Collection'}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Collection Header Image */}
        {collection && (
          <View style={styles.collectionHeader}>
            <Image source={{ uri: collection.image }} style={styles.collectionHeaderImage} />
            <View style={styles.productCountOverlay}>
              <Text style={styles.productCountText}>
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
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
    textAlign: 'left',
    marginLeft: 8,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  collectionHeader: {
    position: 'relative',
    width: '100%',
  },
  collectionHeaderImage: {
    width: '100%',
    height: 200,
  },
  productCountOverlay: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  productCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sortSection: {
    paddingHorizontal: 16,
    marginTop: 16,
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
    borderRadius: 12,
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
