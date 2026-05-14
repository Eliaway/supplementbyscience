import React from 'react';
import { OrganScreen } from '@/components/OrganScreen';
import { organSections } from '@/assets/data/organData';

export default function HeartScreen() {
  const heartSection = organSections.find(s => s.id === 'heart')!;
  return <OrganScreen section={heartSection} />;
}
