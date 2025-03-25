import React from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Floor from './Floor';
import { Floor as FloorType } from '../data/floors';
import { useLaundry } from '../contexts/LaundryContext';

interface FloorListProps {
  initialFloors: FloorType[];
}

const FloorList: React.FC<FloorListProps> = () => {
  // Get data from LaundryContext
  const { floors, loading, error } = useLaundry();

  // If data is loading, show a loading indicator
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading laundry machine data...</Text>
      </View>
    );
  }

  // If there was an error, show an error message
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.errorSubtext}>Please check your connection and try again.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.floorsContainer}>
        {floors.map(floor => (
          <Floor
            key={floor.id}
            floor={floor}
            onMachineStatusChange={() => {}} // Kept for compatibility, not used with Firebase
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  floorsContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});

export default FloorList; 