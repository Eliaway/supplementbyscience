import React from 'react';
import { OrganScreen } from '@/components/OrganScreen';
import { organSections } from '@/assets/data/organData';
import { COLORS } from '@/constants/styles';

export default function LiverScreen() {
  const section = organSections.find(s => s.id === 'liver')!;
  return <OrganScreen section={section} accentColor={COLORS.liver} />;
}
