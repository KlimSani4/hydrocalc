/**
 * Компонент ввода количества людей в возрастной группе
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

interface AgeGroupInputProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
}

export default function AgeGroupInput({
  label,
  description,
  value,
  onChange
}: AgeGroupInputProps) {
  const increment = () => onChange(value + 1);
  const decrement = () => onChange(Math.max(0, value - 1));

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, value === 0 && styles.buttonDisabled]}
          onPress={decrement}
          disabled={value === 0}
        >
          <Text style={[styles.buttonText, value === 0 && styles.buttonTextDisabled]}>
            -
          </Text>
        </TouchableOpacity>

        <Text style={styles.value}>{value}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={increment}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12
  },
  labelContainer: {
    flex: 1
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b'
  },
  description: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonDisabled: {
    backgroundColor: '#e2e8f0'
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#fff',
    lineHeight: 28
  },
  buttonTextDisabled: {
    color: '#94a3b8'
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    width: 50,
    textAlign: 'center'
  }
});
