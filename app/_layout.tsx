import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { LogBox } from 'react-native';
import React from 'react';
import { LaundryProvider } from '../contexts/LaundryContext';

// Suppress specific warnings that might appear during development
LogBox.ignoreLogs([
  'Warning: ...',  // Add specific warning messages to ignore
  'Possible Unhandled Promise Rejection',
  'ViewPropTypes will be removed'
]);

// Define the root layout component
export default function RootLayout() {
  // Initialize any app-wide settings or listeners
  useEffect(() => {
    // App initialization code can go here
  }, []);

  return (
    <SafeAreaProvider>
      <LaundryProvider>
        <StatusBar style="light" />
        <Stack 
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4A90E2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'Laundrify',
            }}
          />
          {/* Note: home is already referenced via index.tsx, no need for separate screen definition
          <Stack.Screen
            name="home"
            options={{
              title: 'Laundrify',
            }}
          />
          */}
        </Stack>
      </LaundryProvider>
    </SafeAreaProvider>
  );
} 