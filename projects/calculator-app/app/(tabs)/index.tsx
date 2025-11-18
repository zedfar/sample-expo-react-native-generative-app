import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { useCalculatorStore } from '@/store/calculatorStore';
import { CalculatorButton } from '@/components/calculator/CalculatorButton';
import { LucideIcon } from '@/components/shared/LucideIcon';

export default function HomeScreen() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const {
    display,
    history,
    mode,
    inputNumber,
    inputDecimal,
    inputOperation,
    calculate,
    clear,
    clearEntry,
    backspace,
    toggleSign,
    percentage,
    scientificOperation,
    setMode,
  } = useCalculatorStore();

  const [showHistory, setShowHistory] = useState(false);

  const isDark = colorScheme === 'dark';

  const handleButtonPress = (value: string) => {
    if (value >= '0' && value <= '9') {
      inputNumber(value);
    } else if (['+', '-', '×', '÷', '^'].includes(value)) {
      inputOperation(value);
    } else if (value === '=') {
      calculate();
    } else if (value === 'C') {
      clear();
    } else if (value === 'CE') {
      clearEntry();
    } else if (value === '⌫') {
      backspace();
    } else if (value === '.') {
      inputDecimal();
    } else if (value === '+/-') {
      toggleSign();
    } else if (value === '%') {
      percentage();
    } else if (['sin', 'cos', 'tan', 'ln', 'log', '√', 'x²', '1/x', 'π', 'e'].includes(value)) {
      scientificOperation(value);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
      {/* Header */}
      <View className="p-4 pt-12 flex-row justify-between items-center">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => setMode(mode === 'basic' ? 'scientific' : 'basic')}
            className={`px-4 py-2 rounded-lg ${mode === 'scientific' ? 'bg-blue-500' : isDark ? 'bg-gray-800' : 'bg-white'}`}
          >
            <Text className={`font-semibold ${mode === 'scientific' ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {mode === 'basic' ? 'Basic' : 'Scientific'}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => setShowHistory(!showHistory)}
          className="p-2"
        >
          <LucideIcon name="History" size={24} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>

      {/* History Panel */}
      {showHistory && (
        <View className={`mx-4 mb-4 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <Text className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            History
          </Text>
          <ScrollView className="max-h-32">
            {history.length === 0 ? (
              <Text className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                No history yet
              </Text>
            ) : (
              history.map((item, index) => (
                <Text key={index} className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item}
                </Text>
              ))
            )}
          </ScrollView>
        </View>
      )}

      {/* Display */}
      <View className="px-4 mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Text
            className={`text-6xl font-bold text-right ${isDark ? 'text-white' : 'text-gray-900'}`}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {display}
          </Text>
        </ScrollView>
      </View>

      {/* Buttons */}
      <View className="flex-1 px-4 pb-8">
        {mode === 'basic' ? (
          <View className="grid grid-cols-4 gap-3 flex-1">
            {/* Row 1 */}
            <CalculatorButton value="C" onPress={handleButtonPress} type="clear" />
            <CalculatorButton value="CE" onPress={handleButtonPress} type="function" />
            <CalculatorButton value="⌫" onPress={handleButtonPress} type="function" />
            <CalculatorButton value="÷" onPress={handleButtonPress} type="operator" />

            {/* Row 2 */}
            <CalculatorButton value="7" onPress={handleButtonPress} />
            <CalculatorButton value="8" onPress={handleButtonPress} />
            <CalculatorButton value="9" onPress={handleButtonPress} />
            <CalculatorButton value="×" onPress={handleButtonPress} type="operator" />

            {/* Row 3 */}
            <CalculatorButton value="4" onPress={handleButtonPress} />
            <CalculatorButton value="5" onPress={handleButtonPress} />
            <CalculatorButton value="6" onPress={handleButtonPress} />
            <CalculatorButton value="-" onPress={handleButtonPress} type="operator" />

            {/* Row 4 */}
            <CalculatorButton value="1" onPress={handleButtonPress} />
            <CalculatorButton value="2" onPress={handleButtonPress} />
            <CalculatorButton value="3" onPress={handleButtonPress} />
            <CalculatorButton value="+" onPress={handleButtonPress} type="operator" />

            {/* Row 5 */}
            <CalculatorButton value="+/-" onPress={handleButtonPress} type="function" />
            <CalculatorButton value="0" onPress={handleButtonPress} />
            <CalculatorButton value="." onPress={handleButtonPress} />
            <CalculatorButton value="=" onPress={handleButtonPress} type="equals" />
          </View>
        ) : (
          <ScrollView>
            <View className="grid grid-cols-5 gap-2 mb-4">
              {/* Scientific functions row 1 */}
              <CalculatorButton value="sin" onPress={handleButtonPress} type="function" />
              <CalculatorButton value="cos" onPress={handleButtonPress} type="function" />
              <CalculatorButton value="tan" onPress={handleButtonPress} type="function" />
              <CalculatorButton value="ln" onPress={handleButtonPress} type="function" />
              <CalculatorButton value="log" onPress={handleButtonPress} type="function" />

              {/* Scientific functions row 2 */}
              <CalculatorButton value="√" onPress={handleButtonPress} type="function" />
              <CalculatorButton value="x²" onPress={handleButtonPress} type="function" />
              <CalculatorButton value="^" onPress={handleButtonPress} type="operator" />
              <CalculatorButton value="1/x" onPress={handleButtonPress} type="function" />
              <CalculatorButton value="%" onPress={handleButtonPress} type="function" />

              {/* Constants */}
              <CalculatorButton value="π" onPress={handleButtonPress} type="function" />
              <CalculatorButton value="e" onPress={handleButtonPress} type="function" />
              <CalculatorButton value="C" onPress={handleButtonPress} type="clear" />
              <CalculatorButton value="CE" onPress={handleButtonPress} type="function" />
              <CalculatorButton value="⌫" onPress={handleButtonPress} type="function" />
            </View>

            <View className="grid grid-cols-4 gap-3">
              {/* Row 1 */}
              <CalculatorButton value="7" onPress={handleButtonPress} />
              <CalculatorButton value="8" onPress={handleButtonPress} />
              <CalculatorButton value="9" onPress={handleButtonPress} />
              <CalculatorButton value="÷" onPress={handleButtonPress} type="operator" />

              {/* Row 2 */}
              <CalculatorButton value="4" onPress={handleButtonPress} />
              <CalculatorButton value="5" onPress={handleButtonPress} />
              <CalculatorButton value="6" onPress={handleButtonPress} />
              <CalculatorButton value="×" onPress={handleButtonPress} type="operator" />

              {/* Row 3 */}
              <CalculatorButton value="1" onPress={handleButtonPress} />
              <CalculatorButton value="2" onPress={handleButtonPress} />
              <CalculatorButton value="3" onPress={handleButtonPress} />
              <CalculatorButton value="-" onPress={handleButtonPress} type="operator" />

              {/* Row 4 */}
              <CalculatorButton value="+/-" onPress={handleButtonPress} type="function" />
              <CalculatorButton value="0" onPress={handleButtonPress} />
              <CalculatorButton value="." onPress={handleButtonPress} />
              <CalculatorButton value="+" onPress={handleButtonPress} type="operator" />

              {/* Row 5 - equals full width */}
            </View>
            <View className="mt-3">
              <CalculatorButton value="=" onPress={handleButtonPress} type="equals" wide />
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}
