/**
 * Экран калькулятора нормы воды
 * Поддерживает работу оффлайн
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import {
  Button,
  AgeGroupInput,
  SeasonSelector,
  ActivitySelector,
  ResultCard
} from '../components';
import { calculateWater, checkConnection } from '../services/api';
import { calculateWaterLocally } from '../services/calculator';
import { addToLocalHistory, generateLocalId } from '../services/storage';
import type { Season, Activity, CalculateResponse, CalculateRequest } from '../types';

type RootStackParamList = {
  Login: undefined;
  Calculator: undefined;
  History: undefined;
};

type CalculatorScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Calculator'>;
};

export default function CalculatorScreen({ navigation }: CalculatorScreenProps) {
  const { user, token, logout } = useAuth();

  // Состояние формы
  const [juniorCount, setJuniorCount] = useState(0);
  const [middleCount, setMiddleCount] = useState(0);
  const [seniorCount, setSeniorCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [season, setSeason] = useState<Season>('cold');
  const [activity, setActivity] = useState<Activity>('normal');

  // Состояние результата
  const [result, setResult] = useState<CalculateResponse | null>(null);
  const [isOfflineResult, setIsOfflineResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalPeople = juniorCount + middleCount + seniorCount + staffCount;

  const handleCalculate = async () => {
    if (totalPeople === 0) {
      Alert.alert('Ошибка', 'Укажите количество людей хотя бы в одной группе');
      return;
    }

    setLoading(true);
    setResult(null);

    const request: CalculateRequest = {
      junior_count: juniorCount,
      middle_count: middleCount,
      senior_count: seniorCount,
      staff_count: staffCount,
      season,
      activity
    };

    try {
      // Проверяем подключение к серверу
      const isOnline = await checkConnection();

      if (isOnline && token) {
        // Онлайн режим с авторизацией - отправляем на сервер
        const serverResult = await calculateWater(request);
        setResult(serverResult);
        setIsOfflineResult(false);
      } else {
        // Оффлайн режим - считаем локально
        const localResult = calculateWaterLocally(request);
        setResult(localResult);
        setIsOfflineResult(true);

        // Сохраняем в локальную историю
        await addToLocalHistory({
          id: generateLocalId(),
          request,
          result: localResult,
          createdAt: new Date().toISOString(),
          synced: false
        });

        if (!isOnline) {
          Alert.alert(
            'Оффлайн режим',
            'Нет подключения к серверу. Расчёт выполнен локально.'
          );
        }
      }
    } catch (error) {
      // Если сервер недоступен - считаем локально
      const localResult = calculateWaterLocally(request);
      setResult(localResult);
      setIsOfflineResult(true);

      await addToLocalHistory({
        id: generateLocalId(),
        request,
        result: localResult,
        createdAt: new Date().toISOString(),
        synced: false
      });

      Alert.alert(
        'Оффлайн режим',
        'Не удалось связаться с сервером. Расчёт выполнен локально.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setJuniorCount(0);
    setMiddleCount(0);
    setSeniorCount(0);
    setStaffCount(0);
    setSeason('cold');
    setActivity('normal');
    setResult(null);
  };

  const handleLogout = () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }]
            });
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={styles.title}>Калькулятор воды</Text>
          {user && (
            <Text style={styles.userEmail}>{user.email}</Text>
          )}
        </View>

        {/* Возрастные группы */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Количество людей</Text>
          <AgeGroupInput
            label="Junior"
            description="7-10 лет (1.6 л/сут)"
            value={juniorCount}
            onChange={setJuniorCount}
          />
          <AgeGroupInput
            label="Middle"
            description="11-14 лет (1.85 л/сут)"
            value={middleCount}
            onChange={setMiddleCount}
          />
          <AgeGroupInput
            label="Senior"
            description="15-17 лет (2.15 л/сут)"
            value={seniorCount}
            onChange={setSeniorCount}
          />
          <AgeGroupInput
            label="Staff"
            description="18+ лет (2.25 л/сут)"
            value={staffCount}
            onChange={setStaffCount}
          />
        </View>

        {/* Сезон и активность */}
        <View style={styles.section}>
          <SeasonSelector value={season} onChange={setSeason} />
          <ActivitySelector value={activity} onChange={setActivity} />
        </View>

        {/* Кнопки */}
        <View style={styles.actions}>
          <Button
            title="Рассчитать"
            onPress={handleCalculate}
            loading={loading}
            disabled={totalPeople === 0}
          />
          {result && (
            <Button
              title="Сбросить"
              onPress={handleReset}
              variant="outline"
              style={styles.resetButton}
            />
          )}
        </View>

        {/* Результат */}
        {result && (
          <ResultCard result={result} isOffline={isOfflineResult} />
        )}

        {/* Навигация */}
        <View style={styles.navigation}>
          {token ? (
            <>
              <Button
                title="История расчётов"
                onPress={() => navigation.navigate('History')}
                variant="secondary"
                style={styles.navButton}
              />
              <Button
                title="Выйти"
                onPress={handleLogout}
                variant="outline"
                style={styles.navButton}
              />
            </>
          ) : (
            <Button
              title="Войти для сохранения истории"
              onPress={() => navigation.navigate('Login')}
              variant="secondary"
              style={styles.navButton}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  content: {
    padding: 20,
    paddingBottom: 40
  },
  header: {
    marginBottom: 24
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b'
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16
  },
  actions: {
    marginTop: 8
  },
  resetButton: {
    marginTop: 12
  },
  navigation: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0'
  },
  navButton: {
    marginBottom: 12
  }
});
