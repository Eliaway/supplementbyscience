import React from 'react';
import { OrganScreen } from '@/components/OrganScreen';
import { organSections } from '@/assets/data/organData';
import { COLORS } from '@/constants/styles';

export default function KidneyScreen() {
  const section = organSections.find(s => s.id === 'kidney')!;
  return <OrganScreen section={section} accentColor={COLORS.kidney} />;
}
