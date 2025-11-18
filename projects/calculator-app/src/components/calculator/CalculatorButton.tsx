import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

interface CalculatorButtonProps {
  value: string;
  onPress: (value: string) => void;
  type?: 'number' | 'operator' | 'function' | 'equals' | 'clear';
  wide?: boolean;
}

export function CalculatorButton({ value, onPress, type = 'number', wide = false }: CalculatorButtonProps) {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  const getButtonStyle = () => {
    const baseStyle = `rounded-2xl items-center justify-center ${wide ? 'col-span-2' : ''}`;

    switch (type) {
      case 'operator':
        return `${baseStyle} bg-blue-500`;
      case 'function':
        return `${baseStyle} ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`;
      case 'equals':
        return `${baseStyle} bg-green-500`;
      case 'clear':
        return `${baseStyle} bg-red-500`;
      default:
        return `${baseStyle} ${isDark ? 'bg-gray-800' : 'bg-white'}`;
    }
  };

  const getTextStyle = () => {
    if (type === 'operator' || type === 'equals' || type === 'clear') {
      return 'text-white';
    }
    if (type === 'function') {
      return isDark ? 'text-white' : 'text-gray-900';
    }
    return isDark ? 'text-white' : 'text-gray-900';
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(value)}
      className={getButtonStyle()}
      style={{
        aspectRatio: wide ? 2.1 : 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <Text className={`text-2xl font-semibold ${getTextStyle()}`}>
        {value}
      </Text>
    </TouchableOpacity>
  );
}
