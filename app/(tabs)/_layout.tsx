import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "الرئيسية",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "المنتجات",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="pills.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: "الكورسات",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="graduationcap.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="compare"
        options={{
          title: "مقارنة",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="arrow.left.arrow.right" color={color} />,
        }}
      />
    </Tabs>
  );
}
