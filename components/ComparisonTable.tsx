import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { ComparisonTable as ComparisonTableType } from '@/assets/data/organData';

interface ComparisonTableProps {
  table: ComparisonTableType;
}

const cellColors = {
  best: '#34d399',
  warn: '#f87171',
  mid: '#fbbf24',
  normal: '#94a3b8',
};

const scoreColors = {
  s: '#10b981',
  m: '#0ea5e9',
  l: '#f59e0b',
};

const ppsColors = {
  g: '#34d399',
  m: '#fbbf24',
  b: '#f87171',
};

export function ComparisonTable({ table }: ComparisonTableProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View>
        {/* Header */}
        <View style={styles.headerRow}>
          {table.headers.map((h, i) => (
            <View key={i} style={[styles.cell, i === 0 ? styles.firstCell : styles.dataCell]}>
              <Text style={styles.headerText}>{h}</Text>
            </View>
          ))}
        </View>

        {/* Rows */}
        {table.rows.map((row, rowIdx) => (
          <View key={rowIdx} style={[styles.row, rowIdx % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
            {/* Product name */}
            <View style={[styles.cell, styles.firstCell]}>
              <Text style={styles.productName}>{row.name}</Text>
            </View>

            {/* Data cols */}
            {row.cols.map((col, colIdx) => (
              <View key={colIdx} style={[styles.cell, styles.dataCell]}>
                <Text style={[styles.cellText, { color: cellColors[col.type] }]}>{col.value}</Text>
              </View>
            ))}

            {/* Price */}
            <View style={[styles.cell, styles.dataCell]}>
              <Text style={styles.cellText}>{row.price}</Text>
            </View>

            {/* PPS */}
            <View style={[styles.cell, styles.dataCell]}>
              <Text style={[styles.cellText, { color: ppsColors[row.ppsType], fontWeight: '700' }]}>
                {row.pricePerServing}
              </Text>
            </View>

            {/* Score */}
            <View style={[styles.cell, styles.dataCell]}>
              <View style={styles.scoreBar}>
                <View style={styles.scoreBarBg}>
                  <View
                    style={[
                      styles.scoreBarFill,
                      { width: `${row.score}%`, backgroundColor: scoreColors[row.scoreType] },
                    ]}
                  />
                </View>
                <Text style={[styles.scoreNum, { color: '#e2e8f0' }]}>{row.score}/100</Text>
              </View>
            </View>

            {/* Available */}
            <View style={[styles.cell, styles.dataCell]}>
              <Text style={row.available ? styles.availY : styles.availN}>
                {row.available ? '✅ متوفر' : '❌ نفذ'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15,39,68,0.8)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  row: {
    flexDirection: 'row',
  },
  rowEven: {
    backgroundColor: 'rgba(10,22,42,0.6)',
  },
  rowOdd: {
    backgroundColor: 'rgba(6,13,26,0.6)',
  },
  cell: {
    padding: 10,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#060d1a',
  },
  firstCell: {
    width: 140,
    alignItems: 'flex-end',
  },
  dataCell: {
    width: 110,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
    fontFamily: 'Cairo',
    textAlign: 'center',
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e2e8f0',
    fontFamily: 'Cairo',
    textAlign: 'right',
  },
  cellText: {
    fontSize: 12,
    fontFamily: 'Cairo',
    textAlign: 'center',
  },
  scoreBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 90,
  },
  scoreBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#0a1628',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#0f2040',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreNum: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Cairo',
  },
  availY: {
    fontSize: 11,
    color: '#34d399',
    fontFamily: 'Cairo',
  },
  availN: {
    fontSize: 11,
    color: '#f87171',
    fontFamily: 'Cairo',
  },
});
