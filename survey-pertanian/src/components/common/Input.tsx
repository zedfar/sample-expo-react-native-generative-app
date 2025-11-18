import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, TextInputProps } from 'react-native';
import { useTheme } from '@hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerClassName = '',
  className = '',
  secureTextEntry,
  ...props
}: InputProps) {
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const textColor = isDark ? '#FFFFFF' : '#111827';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';
  const surfaceColor = isDark ? '#1F2937' : '#FFFFFF';

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className="text-sm font-medium mb-2" style={{ color: textColor }}>
          {label}
        </Text>
      )}

      <View
        className={`
          flex-row items-center border rounded-lg px-3
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
        style={{ backgroundColor: surfaceColor }}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}

        <TextInput
          className={`flex-1 py-3 ${className}`}
          style={{ color: textColor }}
          placeholderTextColor={textSecondary}
          secureTextEntry={secureTextEntry && !showPassword}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-2">
            <Text style={{ color: textSecondary }}>
              {showPassword ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        )}

        {rightIcon && <View className="ml-2">{rightIcon}</View>}
      </View>

      {error && (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      )}

      {helperText && !error && (
        <Text className="text-xs mt-1" style={{ color: textSecondary }}>
          {helperText}
        </Text>
      )}
    </View>
  );
}