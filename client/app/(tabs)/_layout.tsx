import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { display: "none" },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: () => <></>, // hidden icon
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="search/index" />
      <Tabs.Screen name="courses/index" />
      <Tabs.Screen name="profile/index" />
    </Tabs>
  );
}
