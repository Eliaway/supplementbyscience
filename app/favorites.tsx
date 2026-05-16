/**
 * المنتجات المفضلة والمقارنات المحفوظة
 * Feature #14: Favorites and saved comparisons
 */
import { useState, useEffect } from "react";
import { FlatList, I18nManager, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface FavoriteItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  addedAt: string;
}

const SAMPLE_FAVORITES: FavoriteItem[] = [
  { id: "1", name: "فيتامين D3 + K2", category: "الفيتامينات", rating: 4.8, addedAt: "2026-05-01" },
  { id: "2", name: "أوميغا-3 EPA/DHA", category: "الأحماض الدهنية", rating: 4.9, addedAt: "2026-05-05" },
  { id: "3", name: "المغنيسيوم Glycinate", category: "المعادن", rating: 4.7, addedAt: "2026-05-10" },
  { id: "4", name: "Ashwagandha KSM-66", category: "الأعشاب التكيّفية", rating: 4.6, addedAt: "2026-05-12" },
  { id: "5", name: "CoQ10 Ubiquinol", category: "مضادات الأكسدة", rating: 4.5, addedAt: "2026-05-14" },
];

export default function FavoritesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteItem[]>(SAMPLE_FAVORITES);
  const [activeTab, setActiveTab] = useState<"favorites" | "comparisons">("favorites");

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={22} color={colors.primary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>المفضلة والمحفوظات</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>{favorites.length} منتج محفوظ</Text>
        </View>
      </View>

      <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
        {[
          { id: "favorites", label: "المفضلة" },
          { id: "comparisons", label: "المقارنات المحفوظة" },
        ].map(tab => (
          <Pressable
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab.id as any)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab.id ? colors.primary : colors.muted }]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>

      {activeTab === "favorites" && (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
              <IconSymbol name="heart.fill" size={40} color={colors.muted} />
              <Text style={[styles.emptyText, { color: colors.muted }]}>لا يوجد منتجات مفضلة بعد</Text>
              <Text style={[styles.emptySubText, { color: colors.muted }]}>اضغط على قلب أي منتج لإضافته للمفضلة</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.favoriteCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.favoriteInfo}>
                <Text style={[styles.favoriteName, { color: colors.foreground }]}>{item.name}</Text>
                <Text style={[styles.favoriteCategory, { color: colors.muted }]}>{item.category}</Text>
                <View style={styles.ratingRow}>
                  <Text style={[styles.ratingText, { color: "#F59E0B" }]}>★ {item.rating}</Text>
                  <Text style={[styles.dateText, { color: colors.muted }]}>أُضيف: {item.addedAt}</Text>
                </View>
              </View>
              <View style={styles.favoriteActions}>
                <Pressable
                  style={[styles.actionBtn, { backgroundColor: colors.primary + "15" }]}
                  onPress={() => router.push({ pathname: "/product/[id]", params: { id: item.id } } as any)}
                >
                  <IconSymbol name="eye.fill" size={16} color={colors.primary} />
                </Pressable>
                <Pressable
                  style={[styles.actionBtn, { backgroundColor: colors.error + "15" }]}
                  onPress={() => removeFavorite(item.id)}
                >
                  <IconSymbol name="trash.fill" size={16} color={colors.error} />
                </Pressable>
              </View>
            </View>
          )}
        />
      )}

      {activeTab === "comparisons" && (
        <View style={styles.emptyState}>
          <IconSymbol name="arrow.left.arrow.right" size={40} color={colors.muted} />
          <Text style={[styles.emptyText, { color: colors.muted }]}>لا يوجد مقارنات محفوظة بعد</Text>
          <Text style={[styles.emptySubText, { color: colors.muted }]}>استخدم شاشة المقارنة لحفظ مقارناتك</Text>
          <Pressable
            style={[styles.goBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/(tabs)/compare" as any)}
          >
            <Text style={styles.goBtnText}>اذهب للمقارنة</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  backBtn: { padding: 4 },
  tabBar: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabText: { fontSize: 13, fontWeight: "700", fontFamily: "Cairo-Bold" },
  favoriteCard: { borderRadius: 14, padding: 14, borderWidth: 1, flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  favoriteInfo: { flex: 1, gap: 4, alignItems: "flex-end" },
  favoriteName: { fontSize: 15, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  favoriteCategory: { fontSize: 12, textAlign: "right", fontFamily: "Cairo" },
  ratingRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  ratingText: { fontSize: 12, fontWeight: "700", fontFamily: "Cairo-Bold" },
  dateText: { fontSize: 11, fontFamily: "Cairo" },
  favoriteActions: { flexDirection: "column", gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 40 },
  emptyText: { fontSize: 16, fontWeight: "700", textAlign: "center", fontFamily: "Cairo-Bold" },
  emptySubText: { fontSize: 13, textAlign: "center", fontFamily: "Cairo" },
  goBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginTop: 8 },
  goBtnText: { color: "#fff", fontSize: 14, fontWeight: "700", fontFamily: "Cairo-Bold" },
});
