/**
 * Переиспользуемая кнопка
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style
}: ButtonProps) {
  const buttonStyle = [
    styles.button,
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'outline' && styles.outline,
    disabled && styles.disabled,
    style
  ];

  const textStyle = [
    styles.text,
    variant === 'outline' && styles.outlineText,
    disabled && styles.disabledText
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? '#3b82f6' : '#fff'}
          size="small"
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50
  },
  primary: {
    backgroundColor: '#3b82f6'
  },
  secondary: {
    backgroundColor: '#64748b'
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#3b82f6'
  },
  disabled: {
    opacity: 0.5
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  outlineText: {
    color: '#3b82f6'
  },
  disabledText: {
    color: '#9ca3af'
  }
});
