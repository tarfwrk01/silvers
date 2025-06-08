import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductsContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with 16px margin on each side and 16px gap

export default function NecklacesScreen() {
  const { products, loading, error } = useProducts();
  const { itemCount } = useCart();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Filter products for necklaces category
  const necklaceProducts = useMemo(() => {
    let result = products.filter(product => 
      product.category.toLowerCase().includes('necklace') ||
      product.name.toLowerCase().includes('necklace')
    );

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [products, searchQuery, sortBy]);

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.images[0] }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.productInfo}>
        {/* Color count */}
        <Text style={styles.colorCount}>
          {item.options?.length || 2} Colours
        </Text>
        
        {/* Product name */}
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>NECKLACES</Text>
        
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => router.push('/(tabs)/cart')}
        >
          <Text style={styles.cartText}>CART ({itemCount})</Text>
        </TouchableOpacity>
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>
          Make your own magic with spellbinding pieces{'\n'}from our necklace collection.
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="SEARCH"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Filter and Sort */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={18} color="#000" />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.sortButton}>
          <Ionicons name="swap-vertical-outline" size={18} color="#000" />
          <Text style={styles.sortText}>Sort</Text>
        </TouchableOpacity>
      </View>

      {/* Products Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading necklaces...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load products</Text>
        </View>
      ) : (
        <FlatList
          data={necklaceProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={[styles.productsList, { paddingBottom: 100 + insets.bottom }]}
          columnWrapperStyle={styles.productRow}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    letterSpacing: 1,
  },
  cartButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cartText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
  },

  subtitleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },

  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },

  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  filterText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  sortText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },

  productsList: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: cardWidth,
    marginBottom: 25,
  },
  imageContainer: {
    width: '100%',
    height: cardWidth * 1.2,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    alignItems: 'center',
  },
  colorCount: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    fontWeight: '400',
  },
  productName: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#FF0000',
  },
});
