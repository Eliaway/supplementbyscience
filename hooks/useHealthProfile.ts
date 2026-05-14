import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HealthProfile, DEFAULT_PROFILE, HormoneEntry, Medication, LabResult } from '@/assets/data/healthProfile';

const STORAGE_KEY = '@health_profile_v2';

export function useHealthProfile() {
  const [profile, setProfile] = useState<HealthProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  // تحميل الملف الصحي من التخزين المحلي
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile({ ...DEFAULT_PROFILE, ...parsed });
      }
    } catch (e) {
      console.error('Error loading health profile:', e);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = useCallback(async (updated: HealthProfile) => {
    try {
      const withTimestamp = { ...updated, updatedAt: new Date().toISOString() };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(withTimestamp));
      setProfile(withTimestamp);
    } catch (e) {
      console.error('Error saving health profile:', e);
    }
  }, []);

  const updateField = useCallback(async <K extends keyof HealthProfile>(
    key: K,
    value: HealthProfile[K]
  ) => {
    const updated = { ...profile, [key]: value };
    await saveProfile(updated);
  }, [profile, saveProfile]);

  const toggleDisease = useCallback(async (diseaseId: string) => {
    const list = profile.chronicDiseases.includes(diseaseId)
      ? profile.chronicDiseases.filter(d => d !== diseaseId)
      : [...profile.chronicDiseases, diseaseId];
    await updateField('chronicDiseases', list);
  }, [profile, updateField]);

  const toggleAllergy = useCallback(async (allergyId: string) => {
    const list = profile.allergies.includes(allergyId)
      ? profile.allergies.filter(a => a !== allergyId)
      : [...profile.allergies, allergyId];
    await updateField('allergies', list);
  }, [profile, updateField]);

  const toggleInjury = useCallback(async (injuryId: string) => {
    const list = profile.injuries.includes(injuryId)
      ? profile.injuries.filter(i => i !== injuryId)
      : [...profile.injuries, injuryId];
    await updateField('injuries', list);
  }, [profile, updateField]);

  const addMedication = useCallback(async (med: Medication) => {
    await updateField('medications', [...profile.medications, med]);
  }, [profile, updateField]);

  const removeMedication = useCallback(async (medId: string) => {
    await updateField('medications', profile.medications.filter(m => m.id !== medId));
  }, [profile, updateField]);

  const addHormone = useCallback(async (entry: HormoneEntry) => {
    await updateField('hormones', [...profile.hormones, entry]);
  }, [profile, updateField]);

  const removeHormone = useCallback(async (entryId: string) => {
    await updateField('hormones', profile.hormones.filter(h => h.id !== entryId));
  }, [profile, updateField]);

  const addLabResult = useCallback(async (result: LabResult) => {
    const updated = [result, ...profile.labResults].slice(0, 20); // احتفظ بآخر 20 نتيجة
    await updateField('labResults', updated);
  }, [profile, updateField]);

  const exportProfileJSON = useCallback(() => {
    return JSON.stringify(profile, null, 2);
  }, [profile]);

  const resetProfile = useCallback(async () => {
    const fresh = { ...DEFAULT_PROFILE, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    await AsyncStorage.removeItem(STORAGE_KEY);
    setProfile(fresh);
  }, []);

  // حساب اكتمال الملف الصحي
  const completionPercent = (() => {
    let score = 0;
    if (profile.name)   score += 15;
    if (profile.age)    score += 10;
    if (profile.weight) score += 10;
    if (profile.height) score += 10;
    if (profile.chronicDiseases.length > 0 || profile.chronicDiseases.length === 0) score += 10; // دائماً محدّد
    if (profile.allergies.length >= 0) score += 10;
    if (profile.healthGoal) score += 10;
    if (profile.activityLevel) score += 10;
    if (profile.medications.length > 0) score += 5;
    if (profile.labResults.length > 0) score += 10;
    return Math.min(score, 100);
  })();

  return {
    profile,
    loading,
    completionPercent,
    saveProfile,
    updateField,
    toggleDisease,
    toggleAllergy,
    toggleInjury,
    addMedication,
    removeMedication,
    addHormone,
    removeHormone,
    addLabResult,
    exportProfileJSON,
    resetProfile,
    reload: loadProfile,
  };
}
