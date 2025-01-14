/**
 * Экран входа в приложение
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

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      // Навигация происходит автоматически через AuthContext
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка входа';
      Alert.alert('Ошибка входа', message);
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  const goToCalculator = () => {
    navigation.navigate('Calculator');
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
          <Text style={styles.title}>HydroCalc</Text>
          <Text style={styles.subtitle}>Калькулятор нормы воды</Text>
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
              placeholder="Введите пароль"
              placeholderTextColor="#94a3b8"
              secureTextEntry
            />
          </View>

          <Button
            title="Войти"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <TouchableOpacity onPress={goToRegister} style={styles.linkButton}>
            <Text style={styles.linkText}>
              Нет аккаунта?{' '}
              <Text style={styles.linkTextBold}>Зарегистрироваться</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>или</Text>
          <View style={styles.dividerLine} />
        </View>

        <Button
          title="Использовать без регистрации"
          onPress={goToCalculator}
          variant="outline"
          style={styles.guestButton}
        />

        <Text style={styles.guestHint}>
          Без регистрации история расчётов не сохраняется на сервере
        </Text>
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
    fontSize: 32,
    fontWeight: '700',
    color: '#1e293b'
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4
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
  loginButton: {
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
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0'
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: '#94a3b8'
  },
  guestButton: {
    marginBottom: 12
  },
  guestHint: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center'
  }
});
