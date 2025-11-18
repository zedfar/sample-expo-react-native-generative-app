import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/common/Button';

export default function RegisterScreen() {
  const router = useRouter();
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const register = useAuthStore((state) => state.register);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isDark = colorScheme === 'dark';

  const handleRegister = async () => {
    if (!name || !email || !password) return;

    if (password.length < 6) {
      Alert.alert('Error', 'Password harus minimal 6 karakter');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      // After successful registration, navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Registration failed:', error);
      Alert.alert('Error', 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor: isDark ? '#000' : '#fff' }}
    >
      <View className="flex-1 justify-center px-6">
        <Text className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Create Account
        </Text>

        <View className="mb-4">
          <TextInput
            className={`border rounded-lg px-4 py-3 ${
              isDark ? 'border-gray-700 text-white' : 'border-gray-300 text-gray-900'
            }`}
            placeholder="Name"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="mb-4">
          <TextInput
            className={`border rounded-lg px-4 py-3 ${
              isDark ? 'border-gray-700 text-white' : 'border-gray-300 text-gray-900'
            }`}
            placeholder="Email"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-6">
          <TextInput
            className={`border rounded-lg px-4 py-3 ${
              isDark ? 'border-gray-700 text-white' : 'border-gray-300 text-gray-900'
            }`}
            placeholder="Password"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <Button
          title="Sign Up"
          onPress={handleRegister}
          loading={loading}
          disabled={!name || !email || !password}
        />

        <View className="flex-row justify-center mt-6">
          <Text className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Already have an account?{' '}
          </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text className="text-blue-500 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
