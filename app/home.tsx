import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloorList from '../components/FloorList';
import floors from '../data/floors';

export default function Home() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Dorm Washing Machine Status</Text>
      </View>
      <FloorList initialFloors={floors} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    alignItems: 'center',
  },
  headerSubtitle: {
    color: '#555',
    fontSize: 14,
  },
}); 