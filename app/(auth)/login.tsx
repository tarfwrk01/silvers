import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const { signInWithMagicCode, verifyMagicCode, isLoading } = useAuth();
  const { showNotification } = useNotification();

  const handleSendMagicCode = async () => {
    if (!email.trim()) {
      showNotification('Please enter your email address', 'error');
      return;
    }

    try {
      await signInWithMagicCode(email.trim().toLowerCase());
      setStep('code');
      showNotification('Magic code sent to your email', 'info');
    } catch (err) {
      showNotification('Failed to send magic code. Please try again.', 'error');
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      showNotification('Please enter the magic code', 'error');
      return;
    }

    try {
      await verifyMagicCode(email.trim().toLowerCase(), code.trim());
      // Navigation will be handled by the auth state change
    } catch (err) {
      showNotification('Invalid magic code. Please try again.', 'error');
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setCode('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/auth.jpg')}
          style={styles.authImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.formContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>SKJ SILVERS</Text>
          <Text style={styles.subtitle}>
            {step === 'email'
              ? 'Enter your email to access your account'
              : 'Enter the magic code sent to your email'}
          </Text>

        {step === 'email' ? (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSendMagicCode}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send Magic Code</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.emailDisplay}>{email}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter magic code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleVerifyCode}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify Code</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToEmail}
              disabled={isLoading}
            >
              <Text style={styles.backButtonText}>Back to Email</Text>
            </TouchableOpacity>
          </View>
        )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  imageContainer: {
    height: height * 0.4,
    width: '100%',
  },
  authImage: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 10,
    color: '#1e3a8a',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#1e3a8a',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    padding: 8,
  },
  backButtonText: {
    color: '#0ea5e9',
    fontSize: 16,
  },
  emailDisplay: {
    fontSize: 16,
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 16,
  },
});
