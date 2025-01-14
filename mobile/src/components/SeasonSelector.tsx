/**
 * Компонент выбора сезона
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Season } from '../types';

interface SeasonSelectorProps {
  value: Season;
  onChange: (value: Season) => void;
}

const seasons: { value: Season; label: string; icon: string }[] = [
  { value: 'cold', label: 'Холодный', icon: '❄️' },
  { value: 'warm', label: 'Тёплый', icon: '☀️' }
];

export default function SeasonSelector({ value, onChange }: SeasonSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Сезон</Text>

      <View style={styles.options}>
        {seasons.map((season) => (
          <TouchableOpacity
            key={season.value}
            style={[
              styles.option,
              value === season.value && styles.optionActive
            ]}
            onPress={() => onChange(season.value)}
          >
            <Text style={styles.icon}>{season.icon}</Text>
            <Text
              style={[
                styles.label,
                value === season.value && styles.labelActive
              ]}
            >
              {season.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12
  },
  options: {
    flexDirection: 'row',
    gap: 12
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  optionActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6'
  },
  icon: {
    fontSize: 20,
    marginRight: 8
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b'
  },
  labelActive: {
    color: '#3b82f6'
  }
});
