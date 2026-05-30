import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { workoutStore } from "./src/store/workoutStore";
import { loadState } from "./src/persistence/persistence";
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import './global.css';

export default function App() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadState().then((state) => {
      if (cancelled) return;
      if (state !== null) {
        workoutStore.getState().hydrate(state);
      }
      setHydrated(true);
    });
    return (
      ) => {
      cancelled = true;
    };
  }, []);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading…</Text>
      </View>
    );
  }

  return (
    <GluestackUIProvider mode="dark">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </GluestackUIProvider>
  );
}
