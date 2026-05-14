import React from 'react';
import { OrganScreen } from '@/components/OrganScreen';
import { organSections } from '@/assets/data/organData';

export default function LiverScreen() {
  const liverSection = organSections.find(s => s.id === 'liver')!;
  return <OrganScreen section={liverSection} />;
}
