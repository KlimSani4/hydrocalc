/**
 * Карточка с результатом расчёта
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { CalculateResponse } from '../types';

interface ResultCardProps {
  result: CalculateResponse;
  isOffline?: boolean;
}

export default function ResultCard({ result, isOffline }: ResultCardProps) {
  return (
    <View style={styles.container}>
      {isOffline && (
        <View style={styles.offlineBadge}>
          <Text style={styles.offlineText}>Оффлайн расчёт</Text>
        </View>
      )}

      <Text style={styles.title}>Результат расчёта</Text>

      <View style={styles.mainResult}>
        <Text style={styles.waterAmount}>
          {result.total_water.toFixed(1)}
        </Text>
        <Text style={styles.unit}>литров/сутки</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.details}>
        <Text style={styles.sectionTitle}>Детализация</Text>

        <DetailRow
          label="Junior (7-10 лет)"
          count={result.breakdown.junior.count}
          subtotal={result.breakdown.junior.subtotal}
        />
        <DetailRow
          label="Middle (11-14 лет)"
          count={result.breakdown.middle.count}
          subtotal={result.breakdown.middle.subtotal}
        />
        <DetailRow
          label="Senior (15-17 лет)"
          count={result.breakdown.senior.count}
          subtotal={result.breakdown.senior.subtotal}
        />
        <DetailRow
          label="Staff (18+ лет)"
          count={result.breakdown.staff.count}
          subtotal={result.breakdown.staff.subtotal}
        />

        <View style={styles.subtotalRow}>
          <Text style={styles.subtotalLabel}>Базовое потребление</Text>
          <Text style={styles.subtotalValue}>{result.base_total.toFixed(1)} л</Text>
        </View>

        <View style={styles.coefficients}>
          <View style={styles.coefficient}>
            <Text style={styles.coeffLabel}>Сезон</Text>
            <Text style={styles.coeffValue}>×{result.coefficients.season}</Text>
          </View>
          <View style={styles.coefficient}>
            <Text style={styles.coeffLabel}>Активность</Text>
            <Text style={styles.coeffValue}>×{result.coefficients.activity}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Всего человек: {result.total_people}
        </Text>
      </View>
    </View>
  );
}

interface DetailRowProps {
  label: string;
  count: number;
  subtotal: number;
}

function DetailRow({ label, count, subtotal }: DetailRowProps) {
  if (count === 0) return null;

  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>
        {count} × норма = {subtotal.toFixed(1)} л
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  offlineBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12
  },
  offlineText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '500'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16
  },
  mainResult: {
    alignItems: 'center',
    paddingVertical: 16
  },
  waterAmount: {
    fontSize: 56,
    fontWeight: '700',
    color: '#3b82f6'
  },
  unit: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 16
  },
  details: {
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  detailLabel: {
    fontSize: 14,
    color: '#475569'
  },
  detailValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500'
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9'
  },
  subtotalLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500'
  },
  subtotalValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600'
  },
  coefficients: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12
  },
  coefficient: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  coeffLabel: {
    fontSize: 12,
    color: '#64748b'
  },
  coeffValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
    marginTop: 4
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center'
  }
});
