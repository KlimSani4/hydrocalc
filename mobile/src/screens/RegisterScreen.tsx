/**
 * Экран регистрации
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Calculator: undefined;
};

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    // Валидация
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert('Ошибка', 'Введите корректный email');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Ошибка', 'Пароль должен быть не менее 6 символов');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Ошибка', 'Пароли не совпадают');
      return;
    }

    setLoading(true);
    try {
      await register({ email: email.trim(), password });
      // Навигация происходит автоматически через AuthContext
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка регистрации';
      Alert.alert('Ошибка регистрации', message);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>💧</Text>
          <Text style={styles.title}>Регистрация</Text>
          <Text style={styles.subtitle}>Создайте аккаунт для сохранения истории</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="example@mail.ru"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Пароль</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Минимум 6 символов"
              placeholderTextColor="#94a3b8"
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Подтверждение пароля</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Повторите пароль"
              placeholderTextColor="#94a3b8"
              secureTextEntry
            />
          </View>

          <Button
            title="Зарегистрироваться"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <TouchableOpacity onPress={goToLogin} style={styles.linkButton}>
            <Text style={styles.linkText}>
              Уже есть аккаунт?{' '}
              <Text style={styles.linkTextBold}>Войти</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center'
  },
  header: {
    alignItems: 'center',
    marginBottom: 32
  },
  logo: {
    fontSize: 64,
    marginBottom: 12
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b'
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center'
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  inputGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1e293b'
  },
  registerButton: {
    marginTop: 8
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center'
  },
  linkText: {
    fontSize: 14,
    color: '#64748b'
  },
  linkTextBold: {
    color: '#3b82f6',
    fontWeight: '600'
  }
});
