import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { OrganScreen } from '@/components/OrganScreen';
import { organSections } from '@/assets/data/organData';
import { COLORS, FONTS, RADIUS } from '@/constants/styles';

type OrganTab = 'liver' | 'heart' | 'kidney' | 'compare';

const ORGAN_TABS: { id: OrganTab; label: string; emoji: string; color: string }[] = [
  { id: 'liver',   label: 'الكبد',   emoji: '🟡', color: COLORS.liver   },
  { id: 'heart',   label: 'القلب',   emoji: '❤️', color: COLORS.heart   },
  { id: 'kidney',  label: 'الكلى',   emoji: '🟣', color: COLORS.kidney  },
  { id: 'compare', label: 'مقارنة',  emoji: '📊', color: COLORS.blue    },
];

export default function OrgansHubScreen() {
  const [activeTab, setActiveTab] = useState<OrganTab>('liver');

  const activeOrgan = ORGAN_TABS.find(t => t.id === activeTab)!;

  // شاشة المقارنة الشاملة
  if (activeTab === 'compare') {
    const CompareContent = require('./compare').default;
    return (
      <View style={styles.root}>
        <SubTabBar active={activeTab} onSelect={setActiveTab} />
        <View style={styles.flex}>
          <CompareContent />
        </View>
      </View>
    );
  }

  const section = organSections.find(s => s.id === activeTab)!;

  return (
    <View style={styles.root}>
      <SubTabBar active={activeTab} onSelect={setActiveTab} />
      <View style={styles.flex}>
        <OrganScreen section={section} accentColor={activeOrgan.color} />
      </View>
    </View>
  );
}

function SubTabBar({ active, onSelect }: { active: OrganTab; onSelect: (t: OrganTab) => void }) {
  return (
    <View style={styles.subBar}>
      {ORGAN_TABS.map(tab => {
        const isActive = active === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.subTab, isActive && { borderBottomColor: tab.color, borderBottomWidth: 2.5 }]}
            onPress={() => onSelect(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.subTabEmoji}>{tab.emoji}</Text>
            <Text style={[styles.subTabLabel, { color: isActive ? tab.color : COLORS.textMuted }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  flex: { flex: 1 },
  subBar: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
    paddingTop: 52, // مسافة من أعلى لتجنب status bar
  },
  subTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  subTabEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  subTabLabel: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
});
