import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform, Text } from "react-native";
import { HapticTab } from "@/components/haptic-tab";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 60 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: '#060d1a',
          borderTopColor: '#0f2040',
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "الكبد",
          tabBarActiveTintColor: '#f59e0b',
          tabBarInactiveTintColor: '#475569',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>🟡</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="heart"
        options={{
          title: "القلب",
          tabBarActiveTintColor: '#ef4444',
          tabBarInactiveTintColor: '#475569',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>❤️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="kidney"
        options={{
          title: "الكلى",
          tabBarActiveTintColor: '#8b5cf6',
          tabBarInactiveTintColor: '#475569',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>🟣</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="compare"
        options={{
          title: "مقارنة",
          tabBarActiveTintColor: '#38bdf8',
          tabBarInactiveTintColor: '#475569',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>📊</Text>
          ),
        }}
      />
    </Tabs>
  );
}
