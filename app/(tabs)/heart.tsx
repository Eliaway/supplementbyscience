import React from 'react';
import { OrganScreen } from '@/components/OrganScreen';
import { organSections } from '@/assets/data/organData';
import { COLORS } from '@/constants/styles';

export default function HeartScreen() {
  const section = organSections.find(s => s.id === 'heart')!;
  return <OrganScreen section={section} accentColor={COLORS.heart} />;
}
