import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OrganScreen } from '@/components/OrganScreen';
import { organSections } from '@/assets/data/organData';
import { COLORS, FONTS } from '@/constants/styles';

type OrganTab = 'liver' | 'heart' | 'kidney' | 'compare';

const ORGAN_TABS: { id: OrganTab; label: string; emoji: string; color: string }[] = [
  { id: 'liver',   label: 'الكبد',   emoji: '🟡', color: COLORS.liver   },
  { id: 'heart',   label: 'القلب',   emoji: '❤️', color: COLORS.heart   },
  { id: 'kidney',  label: 'الكلى',   emoji: '🟣', color: COLORS.kidney  },
  { id: 'compare', label: 'مقارنة',  emoji: '📊', color: COLORS.blue    },
];

export default function OrgansHubScreen() {
  const [activeTab, setActiveTab] = useState<OrganTab>('liver');
  const insets = useSafeAreaInsets();
  const activeOrgan = ORGAN_TABS.find(t => t.id === activeTab)!;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      {/* Sub Tab Bar */}
      <View style={styles.subBar}>
        {ORGAN_TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.subTab, isActive && { borderBottomColor: tab.color, borderBottomWidth: 2.5 }]}
              onPress={() => setActiveTab(tab.id)}
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

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'compare'
          ? <CompareWrapper />
          : <OrganScreen
              section={organSections.find(s => s.id === activeTab)!}
              accentColor={activeOrgan.color}
              noHeader
            />
        }
      </View>
    </View>
  );
}

function CompareWrapper() {
  const CompareContent = require('./compare').default;
  return <CompareContent noHeader />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  subBar: {
    flexDirection: 'row',
    backgroundColor: '#0a0a0a',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
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
  content: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
