import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* <Stack.Screen name="index" options={{ title: "CurrentPage" }} />
      <Stack.Screen name="nextPage" options={{ title: "Next" }} /> */}
    </Stack>
  );
}
