import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../contexts/CartContext';
import { useCheckout } from '../contexts/CheckoutContext';
import { useNotification } from '../contexts/NotificationContext';

export default function CustomerDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { items, itemCount } = useCart();
  const { placeOrder, isLoading } = useCheckout();
  const { showNotification } = useNotification();

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    gstNo: '',
    address: '',
    location: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!customerInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(customerInfo.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!customerInfo.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!customerInfo.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!customerInfo.gstNo.trim()) {
      newErrors.gstNo = 'GST number is required';
    } else {
      const gstNumber = customerInfo.gstNo.trim().toUpperCase();
      if (gstNumber.length !== 15) {
        newErrors.gstNo = 'GST number must be exactly 15 characters';
      } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstNumber)) {
        newErrors.gstNo = 'Please enter a valid GST number format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      showNotification('Please fill in all required fields correctly', 'error');
      return;
    }

    // Format customer info for the order
    const orderCustomerInfo = {
      name: customerInfo.name.trim(),
      email: customerInfo.email.trim(),
      phone: customerInfo.phone.trim(),
      gstNo: customerInfo.gstNo.trim(), // This will be stored in tax column
      shippingAddress: {
        street: customerInfo.address.trim(),
        city: customerInfo.location.trim(),
        state: '',
        zipCode: '',
        country: 'IN',
      },
      billingAddress: {
        street: customerInfo.address.trim(),
        city: customerInfo.location.trim(),
        state: '',
        zipCode: '',
        country: 'IN',
      },
    };

    const success = await placeOrder(orderCustomerInfo);
    if (success) {
      showNotification('Order placed successfully!', 'success');
      router.replace('/(tabs)/home');
    } else {
      showNotification('Failed to place order. Please try again.', 'error');
    }
  };

  const updateField = (field: string, value: string) => {
    // Auto-convert GST number to uppercase
    const processedValue = field === 'gstNo' ? value.toUpperCase() : value;
    setCustomerInfo(prev => ({ ...prev, [field]: processedValue }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (items.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Ionicons name="bag-outline" size={80} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Add some items to proceed with checkout</Text>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.replace('/(tabs)/shop')}
        >
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <Text style={styles.orderSummary}>{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</Text>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={customerInfo.name}
              onChangeText={(text) => updateField('name', text)}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={customerInfo.email}
              onChangeText={(text) => updateField('email', text)}
              placeholder="Enter your email address"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={customerInfo.phone}
              onChangeText={(text) => updateField('phone', text)}
              placeholder="Enter your phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>GST Number *</Text>
            <TextInput
              style={[styles.input, errors.gstNo && styles.inputError]}
              value={customerInfo.gstNo}
              onChangeText={(text) => updateField('gstNo', text)}
              placeholder="Enter 15-digit GST number (e.g., 22AAAAA0000A1Z5)"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
            />
            {errors.gstNo && <Text style={styles.errorText}>{errors.gstNo}</Text>}
          </View>
        </View>

        {/* Address Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.address && styles.inputError]}
              value={customerInfo.address}
              onChangeText={(text) => updateField('address', text)}
              placeholder="Enter your complete address"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
            />
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>City/Location *</Text>
            <TextInput
              style={[styles.input, errors.location && styles.inputError]}
              value={customerInfo.location}
              onChangeText={(text) => updateField('location', text)}
              placeholder="Enter your city or location"
              placeholderTextColor="#9CA3AF"
            />
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.placeOrderButton, isLoading && styles.disabledButton]}
          onPress={handlePlaceOrder}
          disabled={isLoading}
        >
          <Text style={styles.placeOrderText}>
            {isLoading ? 'Placing Order...' : 'Place Order'}
          </Text>
          {!isLoading && <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  emptyContainer: {
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
  continueButton: {
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
  continueButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  orderSummary: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    marginTop: 6,
    fontWeight: '500',
  },
  bottomContainer: {
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
  placeOrderButton: {
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
  placeOrderText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginRight: 8,
    letterSpacing: -0.3,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0.1,
  },
});
