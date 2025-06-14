import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

export default function AuthenticatedScreen() {
  const { user, signOut } = useAuth();
  const { showNotification } = useNotification();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const handleSignOut = async () => {
    setShowSignOutConfirm(true);
  };

  const confirmSignOut = async () => {
    try {
      await signOut();
      setShowSignOutConfirm(false);
    } catch (err) {
      showNotification('Failed to sign out. Please try again.', 'error');
      setShowSignOutConfirm(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>You are successfully signed in</Text>
        
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userInfoLabel}>Email:</Text>
            <Text style={styles.userInfoValue}>{user.email}</Text>
            <Text style={styles.userInfoLabel}>User ID:</Text>
            <Text style={styles.userInfoValue}>{user.id}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out Bottom Drawer */}
      <Modal
        visible={showSignOutConfirm}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSignOutConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomDrawer}>
            <View style={styles.drawerHandle} />
            <Text style={styles.drawerTitle}>Sign Out</Text>
            <Text style={styles.drawerMessage}>
              Are you sure you want to sign out?
            </Text>
            <View style={styles.drawerButtons}>
              <TouchableOpacity
                style={[styles.drawerButton, styles.cancelButton]}
                onPress={() => setShowSignOutConfirm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.drawerButton, styles.confirmButton]}
                onPress={confirmSignOut}
              >
                <Text style={styles.confirmButtonText}>Sign Out</Text>
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
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  userInfo: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 32,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  userInfoValue: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
