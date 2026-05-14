import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { ComparisonTable as ComparisonTableType } from '@/assets/data/organData';
import { COLORS, FONTS } from '@/constants/styles';

interface ComparisonTableProps {
  table: ComparisonTableType;
}

const cellColors = {
  best: COLORS.success,
  warn: COLORS.error,
  mid: COLORS.warning,
  normal: COLORS.textSecondary,
};

const scoreColors = { s: COLORS.success, m: COLORS.blue, l: COLORS.warning };
const ppsColors = { g: COLORS.success, m: COLORS.warning, b: COLORS.error };

export function ComparisonTable({ table }: ComparisonTableProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View>
        <View style={styles.headerRow}>
          {table.headers.map((h, i) => (
            <View key={i} style={[styles.cell, i === 0 ? styles.firstCell : styles.dataCell]}>
              <Text style={styles.headerText}>{h}</Text>
            </View>
          ))}
        </View>
        {table.rows.map((row, rowIdx) => (
          <View key={rowIdx} style={[styles.row, rowIdx % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
            <View style={[styles.cell, styles.firstCell]}>
              <Text style={styles.productName}>{row.name}</Text>
            </View>
            {row.cols.map((col, colIdx) => (
              <View key={colIdx} style={[styles.cell, styles.dataCell]}>
                <Text style={[styles.cellText, { color: cellColors[col.type] }]}>{col.value}</Text>
              </View>
            ))}
            <View style={[styles.cell, styles.dataCell]}>
              <Text style={[styles.cellText, { color: COLORS.textPrimary }]}>{row.price}</Text>
            </View>
            <View style={[styles.cell, styles.dataCell]}>
              <Text style={[styles.cellText, { color: ppsColors[row.ppsType], fontWeight: '700' }]}>{row.pricePerServing}</Text>
            </View>
            <View style={[styles.cell, styles.dataCell]}>
              <View style={styles.scoreBar}>
                <View style={styles.scoreBarBg}>
                  <View style={[styles.scoreBarFill, { width: `${row.score}%` as any, backgroundColor: scoreColors[row.scoreType] }]} />
                </View>
                <Text style={[styles.scoreNum, { color: scoreColors[row.scoreType] }]}>{row.score}</Text>
              </View>
            </View>
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
  headerRow: { flexDirection: 'row', backgroundColor: '#222222', borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  row: { flexDirection: 'row' },
  rowEven: { backgroundColor: COLORS.bgCard },
  rowOdd: { backgroundColor: '#252525' },
  cell: { padding: 10, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.bg },
  firstCell: { width: 145, alignItems: 'flex-end' },
  dataCell: { width: 110, alignItems: 'center' },
  headerText: { fontSize: 11, color: COLORS.textMuted, fontWeight: '700', fontFamily: FONTS.bold, textAlign: 'center' },
  productName: { fontSize: 12, fontWeight: '600', color: COLORS.textPrimary, fontFamily: FONTS.bold, textAlign: 'right' },
  cellText: { fontSize: 12, fontFamily: FONTS.regular, textAlign: 'center' },
  scoreBar: { flexDirection: 'row', alignItems: 'center', gap: 4, width: 90 },
  scoreBarBg: { flex: 1, height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  scoreBarFill: { height: '100%', borderRadius: 4 },
  scoreNum: { fontSize: 10, fontWeight: '700', fontFamily: FONTS.bold },
  availY: { fontSize: 11, color: COLORS.success, fontFamily: FONTS.regular },
  availN: { fontSize: 11, color: COLORS.error, fontFamily: FONTS.regular },
});
