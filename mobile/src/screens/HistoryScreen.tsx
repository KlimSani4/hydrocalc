/**
 * Экран истории расчётов
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { getHistory, checkConnection } from '../services/api';
import { getLocalHistory, clearLocalHistory } from '../services/storage';
import { getSeasonLabel, getActivityLabel } from '../services/calculator';
import { Button } from '../components';
import type { HistoryItem, LocalCalculation } from '../types';

type RootStackParamList = {
  Calculator: undefined;
  History: undefined;
};

type HistoryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'History'>;
};

// Объединённый тип для отображения
interface DisplayItem {
  id: string;
  totalWater: number;
  createdAt: string;
  season: string;
  activity: string;
  totalPeople: number;
  isLocal: boolean;
}

export default function HistoryScreen({ navigation }: HistoryScreenProps) {
  const { token } = useAuth();
  const [items, setItems] = useState<DisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const displayItems: DisplayItem[] = [];

      // Загружаем локальную историю
      const localHistory = await getLocalHistory();
      localHistory.forEach((item: LocalCalculation) => {
        displayItems.push({
          id: item.id,
          totalWater: item.result.total_water,
          createdAt: item.createdAt,
          season: item.request.season,
          activity: item.request.activity,
          totalPeople: item.result.total_people,
          isLocal: true
        });
      });

      // Если авторизован - загружаем с сервера
      if (token) {
        const isOnline = await checkConnection();
        if (isOnline) {
          try {
            const serverHistory = await getHistory();
            serverHistory.forEach((item: HistoryItem) => {
              displayItems.push({
                id: `server_${item.id}`,
                totalWater: item.total_water,
                createdAt: item.created_at,
                season: item.params.season,
                activity: item.params.activity,
                totalPeople:
                  item.params.junior_count +
                  item.params.middle_count +
                  item.params.senior_count +
                  item.params.staff_count,
                isLocal: false
              });
            });
          } catch (error) {
            console.error('Ошибка загрузки истории с сервера:', error);
          }
        }
      }

      // Сортируем по дате (новые сначала)
      displayItems.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setItems(displayItems);
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить историю');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  // Загружаем при фокусе на экране
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const handleClearLocal = () => {
    Alert.alert(
      'Очистить локальную историю?',
      'Расчёты, сохранённые оффлайн, будут удалены',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: async () => {
            await clearLocalHistory();
            loadHistory();
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderItem = ({ item }: { item: DisplayItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.waterAmount}>{item.totalWater.toFixed(1)} л</Text>
        {item.isLocal && (
          <View style={styles.localBadge}>
            <Text style={styles.localBadgeText}>Локальный</Text>
          </View>
        )}
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Людей:</Text>
          <Text style={styles.detailValue}>{item.totalPeople}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Сезон:</Text>
          <Text style={styles.detailValue}>{getSeasonLabel(item.season)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Активность:</Text>
          <Text style={styles.detailValue}>{getActivityLabel(item.activity)}</Text>
        </View>
      </View>

      <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>История пуста</Text>
      <Text style={styles.emptyText}>
        Здесь будут отображаться ваши расчёты
      </Text>
      <Button
        title="Перейти к калькулятору"
        onPress={() => navigation.navigate('Calculator')}
        style={styles.emptyButton}
      />
    </View>
  );

  const hasLocalItems = items.some(item => item.isLocal);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>История расчётов</Text>
        {hasLocalItems && (
          <TouchableOpacity onPress={handleClearLocal}>
            <Text style={styles.clearButton}>Очистить локальные</Text>
          </TouchableOpacity>
        )}
      </View>

      {!token && (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            Войдите, чтобы синхронизировать историю между устройствами
          </Text>
        </View>
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={!loading ? renderEmpty : null}
        contentContainerStyle={items.length === 0 ? styles.listEmpty : styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#3b82f6']}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b'
  },
  clearButton: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '500'
  },
  notice: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#fef3c7',
    borderRadius: 8
  },
  noticeText: {
    fontSize: 13,
    color: '#92400e',
    textAlign: 'center'
  },
  list: {
    padding: 20,
    paddingTop: 8
  },
  listEmpty: {
    flex: 1
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  waterAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3b82f6'
  },
  localBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  localBadgeText: {
    fontSize: 11,
    color: '#92400e',
    fontWeight: '500'
  },
  cardDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b'
  },
  detailValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500'
  },
  date: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 12,
    textAlign: 'right'
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24
  },
  emptyButton: {
    minWidth: 200
  }
});
