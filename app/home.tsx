import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloorList from '../components/FloorList';
import AppHeader from '../components/AppHeader';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <AppHeader />
      <LinearGradient
        colors={['#f8f8f8', '#f0f0f0']}
        style={styles.content}
      >
        <FloorList />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 8,
  }
}); 