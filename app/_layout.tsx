import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LaundryProvider } from '../contexts/LaundryContext';
import { FontProvider } from '../contexts/FontContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { LostItemsProvider } from '../contexts/LostItemsContext';

// Suppress specific warnings that might appear during development
LogBox.ignoreLogs([
  'Warning: ...',  // Add specific warning messages to ignore
  'Possible Unhandled Promise Rejection',
  'ViewPropTypes will be removed',
  'ReactNativeFiberHostComponent: Calling getNode()'
]);

// Define the root layout component
export default function RootLayout() {
  // Initialize any app-wide settings or listeners
  useEffect(() => {
    // App initialization code can go here
  }, []);

  return (
    <SafeAreaProvider>
      <FontProvider>
        <NotificationProvider>
          <LaundryProvider>
            <LostItemsProvider>
              <StatusBar style="light" />
              <Tabs
                screenOptions={{
                  headerShown: false,
                  tabBarActiveTintColor: '#BF5700',
                  tabBarInactiveTintColor: '#888',
                  tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopColor: 'rgba(0,0,0,0.05)',
                    height: 50,
                    paddingBottom: 0,
                    paddingTop: 0,
                    borderTopWidth: 1,
                    elevation: 8,
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: -2 },
                  },
                  tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    fontFamily: 'SF Pro Text',
                    marginBottom: 3
                  },
                  tabBarIconStyle: {
                    marginTop: 2
                  }
                }}
              >
                <Tabs.Screen
                  name="index"
                  options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="home" size={size-2} color={color} />
                    ),
                  }}
                  redirect
                />
                <Tabs.Screen
                  name="home"
                  options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="home" size={size} color={color} />
                    ),
                  }}
                />
                <Tabs.Screen
                  name="lost-found"
                  options={{
                    title: 'Lost & Found',
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="search" size={size} color={color} />
                    ),
                  }}
                />
                <Tabs.Screen
                  name="chat"
                  options={{
                    title: 'Chat',
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="chatbubble-ellipses" size={size} color={color} />
                    ),
                  }}
                />
              </Tabs>
            </LostItemsProvider>
          </LaundryProvider>
        </NotificationProvider>
      </FontProvider>
    </SafeAreaProvider>
  );
} 