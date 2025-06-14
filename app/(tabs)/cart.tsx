import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../../contexts/CartContext';
import { useCheckout } from '../../contexts/CheckoutContext';
import { useNotification } from '../../contexts/NotificationContext';
import { CartItem } from '../../types';

export default function CartScreen() {
  const { items, itemCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const { placeOrder, isLoading } = useCheckout();
  const { showNotification } = useNotification();
  const insets = useSafeAreaInsets();
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setItemToRemove(productId);
      setShowRemoveConfirm(true);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = () => {
    setShowClearConfirm(true);
  };

  const confirmRemoveItem = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove);
      setItemToRemove(null);
    }
    setShowRemoveConfirm(false);
  };

  const confirmClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      showNotification('Your cart is empty', 'error');
      return;
    }

    // Navigate to customer details screen
    router.push('/customer-details');
  };

  const formatSelectedOptions = (selectedOptions?: Record<string, any>) => {
    if (!selectedOptions || Object.keys(selectedOptions).length === 0) {
      return null;
    }

    return Object.entries(selectedOptions)
      .map(([key, option]) => `${key}: ${option.identifierValue || option.value}`)
      .join(' • ');
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.product.images[0] }} style={styles.productImage} />

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={styles.productBrand}>{item.product.brand}</Text>
        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
          <Text style={styles.productOptions} numberOfLines={2}>
            {formatSelectedOptions(item.selectedOptions)}
          </Text>
        )}
      </View>

      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={[styles.quantityButton, item.quantity === 1 && styles.deleteButton]}
          onPress={() => handleQuantityChange(item.product.id, item.quantity - 1)}
        >
          <Ionicons
            name={item.quantity === 1 ? "trash-outline" : "remove"}
            size={18}
            color={item.quantity === 1 ? "#EF4444" : "#42948a"}
          />
        </TouchableOpacity>

        <Text style={styles.quantity}>{item.quantity}</Text>

        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item.product.id, item.quantity + 1)}
        >
          <Ionicons name="add" size={18} color="#42948a" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bag-outline" size={80} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>
        Add some products to your cart to see them here
      </Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => router.push('/shop')}
      >
        <Text style={styles.shopButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );



  if (items.length === 0) {
    return (
      <View style={styles.container}>
        {renderEmptyCart()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart ({itemCount})</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Cart Items */}
      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cartList}
        showsVerticalScrollIndicator={false}
      />

      {/* Place Order Button */}
      <View style={[styles.checkoutContainer, { paddingBottom: 100 + insets.bottom }]}>
        <TouchableOpacity
          style={[styles.checkoutButton, isLoading && styles.checkoutButtonDisabled]}
          onPress={handlePlaceOrder}
          disabled={isLoading}
        >
          <Text style={styles.checkoutButtonText}>
            {isLoading ? 'Placing Order...' : 'Place Order'}
          </Text>
          {!isLoading && <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>

      {/* Remove Item Bottom Drawer */}
      <Modal
        visible={showRemoveConfirm}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRemoveConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomDrawer}>
            <View style={styles.drawerHandle} />
            <Text style={styles.drawerTitle}>Remove Item</Text>
            <Text style={styles.drawerMessage}>
              Are you sure you want to remove this item from your cart?
            </Text>
            <View style={styles.drawerButtons}>
              <TouchableOpacity
                style={[styles.drawerButton, styles.cancelButton]}
                onPress={() => setShowRemoveConfirm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.drawerButton, styles.confirmButton]}
                onPress={confirmRemoveItem}
              >
                <Text style={styles.confirmButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Clear Cart Bottom Drawer */}
      <Modal
        visible={showClearConfirm}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowClearConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomDrawer}>
            <View style={styles.drawerHandle} />
            <Text style={styles.drawerTitle}>Clear Cart</Text>
            <Text style={styles.drawerMessage}>
              Are you sure you want to remove all items from your cart?
            </Text>
            <View style={styles.drawerButtons}>
              <TouchableOpacity
                style={[styles.drawerButton, styles.cancelButton]}
                onPress={() => setShowClearConfirm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.drawerButton, styles.confirmButton]}
                onPress={confirmClearCart}
              >
                <Text style={styles.confirmButtonText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  clearText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  cartList: {
    padding: 20,
    paddingBottom: 100,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    minHeight: 90, // Match image height
    alignItems: 'center',
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
    height: 90, // Match image height
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 20,
  },
  productBrand: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
    fontWeight: '500',
  },
  productOptions: {
    fontSize: 12,
    color: '#42948a',
    fontWeight: '600',
    lineHeight: 16,
    flexWrap: 'wrap',
  },

  quantityControls: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 8,
    height: 90, // Match image height
    justifyContent: 'center',
  },
  quantityButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginVertical: 8,
    minWidth: 24,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 17,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  shopButton: {
    backgroundColor: '#42948a',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: '#42948a',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  shopButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },

  checkoutContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
  checkoutButton: {
    backgroundColor: '#42948a',
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#42948a',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginRight: 8,
    letterSpacing: -0.3,
  },
  checkoutButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0.1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomDrawer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  drawerHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  drawerMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  drawerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  drawerButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  confirmButton: {
    backgroundColor: '#EF4444',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
