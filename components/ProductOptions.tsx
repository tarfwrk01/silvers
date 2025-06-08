import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ProductOption } from '../types';

interface ProductOptionsProps {
  options: ProductOption[];
  onSelectionChange?: (selectedOptions: Record<string, ProductOption>) => void;
}

export default function ProductOptions({ options, onSelectionChange }: ProductOptionsProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, ProductOption>>({});

  // Group options by their title field (e.g., "Size", "Color", etc.)
  const groupedOptions = options.reduce((acc, option) => {
    const groupKey = option.title;
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(option);
    return acc;
  }, {} as Record<string, ProductOption[]>);

  const handleOptionSelect = (option: ProductOption) => {
    const groupKey = option.title;
    const newSelectedOptions = {
      ...selectedOptions,
      [groupKey]: option,
    };

    setSelectedOptions(newSelectedOptions);
    onSelectionChange?.(newSelectedOptions);
  };

  const isOptionSelected = (option: ProductOption) => {
    const groupKey = option.title;
    return selectedOptions[groupKey]?.id === option.id;
  };

  if (!options || options.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
        <View key={groupName} style={styles.optionGroup}>
          <Text style={styles.groupTitle}>{groupName}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.optionsContainer}
          >
            {groupOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  isOptionSelected(option) && styles.selectedOptionCard,
                ]}
                onPress={() => handleOptionSelect(option)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    isOptionSelected(option) && styles.selectedOptionText,
                  ]}
                >
                  {option.identifierValue || option.value}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  optionGroup: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  optionsContainer: {
    paddingRight: 16,
    gap: 8,
  },
  optionCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOptionCard: {
    borderColor: '#6366F1',
    backgroundColor: '#6366F1',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
});
