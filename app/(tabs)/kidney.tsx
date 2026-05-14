import React from 'react';
import { OrganScreen } from '@/components/OrganScreen';
import { organSections } from '@/assets/data/organData';

export default function KidneyScreen() {
  const kidneySection = organSections.find(s => s.id === 'kidney')!;
  return <OrganScreen section={kidneySection} />;
}
