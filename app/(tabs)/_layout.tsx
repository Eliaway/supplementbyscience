import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { Platform, Text } from "react-native";
import { COLORS } from "@/constants/styles";

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>;
}

/**
 * 5 تبويبات رئيسية فقط:
 * 1. الأعضاء   — الكبد / القلب / الكلى / المقارنة (index.tsx)
 * 2. تشخيص    — diagnostics.tsx (مؤشر الصحة، حاسبة، نوم، خطر، تحاليل)
 * 3. أدوات    — tools.tsx (بحث، حاسبة جرعة، تعارضات، مخزون، مكتبة)
 * 4. مساعد AI — ai.tsx (4 خبراء، محادثة، مسح ملصق)
 * 5. ملفي     — profile.tsx (بيانات، أمراض، هرمونات، جدول، إعدادات)
 */
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 10 : Math.max(insets.bottom, 8);
  const tabBarHeight = 62 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.blue,
        tabBarInactiveTintColor: COLORS.textMuted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 6,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: '#000000',
          borderTopColor: '#1a1a1a',
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Cairo-Bold',
          marginTop: 2,
        },
      }}
    >
      {/* 1 — الأعضاء: الكبد / القلب / الكلى / المقارنة */}
      <Tabs.Screen
        name="index"
        options={{
          title: "الأعضاء",
          tabBarIcon: ({ focused }) => <TabIcon emoji="🫀" focused={focused} />,
        }}
      />

      {/* 2 — التشخيص المتقدم */}
      <Tabs.Screen
        name="diagnostics"
        options={{
          title: "تشخيص",
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔬" focused={focused} />,
        }}
      />

      {/* 3 — الأدوات الشاملة */}
      <Tabs.Screen
        name="tools"
        options={{
          title: "أدوات",
          tabBarIcon: ({ focused }) => <TabIcon emoji="🛠️" focused={focused} />,
        }}
      />

      {/* 4 — مساعد AI */}
      <Tabs.Screen
        name="ai"
        options={{
          title: "مساعد AI",
          tabBarIcon: ({ focused }) => <TabIcon emoji="🤖" focused={focused} />,
        }}
      />

      {/* 5 — الملف الشخصي الكامل */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "ملفي",
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />

      {/* شاشات مخفية — يُصل إليها من داخل التبويبات */}
      <Tabs.Screen name="heart"     options={{ href: null }} />
      <Tabs.Screen name="kidney"    options={{ href: null }} />
      <Tabs.Screen name="compare"   options={{ href: null }} />
      <Tabs.Screen name="schedule"  options={{ href: null }} />
      <Tabs.Screen name="inventory" options={{ href: null }} />
      <Tabs.Screen name="library"   options={{ href: null }} />
      <Tabs.Screen name="settings"  options={{ href: null }} />
    </Tabs>
  );
}
