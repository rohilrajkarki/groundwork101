import { initDatabase } from "@/database/db";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    // <SafeAreaProvider>
    //   <SafeAreaView
    //     edges={["top"]}
    //     style={{
    //       flex: 1,
    //       backgroundColor: "transparent",
    //     }}
    //   >
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* <Stack.Screen name="index" options={{ title: "CurrentPage" }} />
      <Stack.Screen name="nextPage" options={{ title: "Next" }} /> */}
    </Stack>
    //   </SafeAreaView>
    // </SafeAreaProvider>
  );
}
