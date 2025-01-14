/**
 * Компонент выбора типа активности
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Activity } from '../types';

interface ActivitySelectorProps {
  value: Activity;
  onChange: (value: Activity) => void;
}

const activities: { value: Activity; label: string; icon: string }[] = [
  { value: 'normal', label: 'Обычная', icon: '🚶' },
  { value: 'sport', label: 'Спорт', icon: '🏃' },
  { value: 'trip', label: 'Поход', icon: '🏕️' }
];

export default function ActivitySelector({ value, onChange }: ActivitySelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Активность</Text>

      <View style={styles.options}>
        {activities.map((activity) => (
          <TouchableOpacity
            key={activity.value}
            style={[
              styles.option,
              value === activity.value && styles.optionActive
            ]}
            onPress={() => onChange(activity.value)}
          >
            <Text style={styles.icon}>{activity.icon}</Text>
            <Text
              style={[
                styles.label,
                value === activity.value && styles.labelActive
              ]}
            >
              {activity.label}
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
    gap: 10
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
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
    fontSize: 24,
    marginBottom: 6
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b'
  },
  labelActive: {
    color: '#3b82f6'
  }
});
