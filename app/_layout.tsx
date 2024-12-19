import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName='index'
      >
        <Stack.Screen name="landing"/>
        <Stack.Screen name="register"/>
        <Stack.Screen name="index"/>
        <Stack.Screen name="tabs"/>
        <Stack.Screen name="newchalan"/>
        <Stack.Screen name="chalanlist"/>
        <Stack.Screen name="partimaster"/>
        <Stack.Screen name="invmaster"/>
        <Stack.Screen name="partiBills"/>
        <Stack.Screen name="partiChalan"/>
        <Stack.Screen name="editChalan"/>
      </Stack>
    </GestureHandlerRootView>
  );
}
