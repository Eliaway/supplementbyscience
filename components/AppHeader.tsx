import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function AppHeader({ title, subtitle, badge }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#060d1a',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#38bdf8',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    fontFamily: 'Cairo-Black',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
    fontFamily: 'Cairo',
    textAlign: 'center',
  },
  badge: {
    marginTop: 8,
    backgroundColor: 'rgba(16,185,129,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    color: '#34d399',
    fontFamily: 'Cairo',
    textAlign: 'center',
  },
});
