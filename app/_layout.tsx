import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { I18nManager, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "@/lib/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { trpc, createTRPCClient } from "@/lib/trpc";

// Force RTL for Arabic
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => createTRPCClient());

  const [loaded] = useFonts({
    Cairo: require("../assets/fonts/Cairo-Regular.ttf"),
    "Cairo-Bold": require("../assets/fonts/Cairo-Bold.ttf"),
    "Cairo-Black": require("../assets/fonts/Cairo-Black.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider forcedColorScheme="dark">
              <View style={{ flex: 1, backgroundColor: '#060d1a' }}>
                <StatusBar style="light" backgroundColor="#060d1a" />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
              </View>
            </ThemeProvider>
          </QueryClientProvider>
        </trpc.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
