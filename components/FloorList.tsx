import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useLaundry } from '../contexts/LaundryContext';
import FloorSelector from './FloorSelector';
import FloorDetails from './FloorDetails';
import { StyledText } from '../contexts/FontContext';

const FloorList: React.FC = () => {
  const { floors, loading } = useLaundry();
  const [selectedFloor, setSelectedFloor] = useState('');
  
  // Initialize selectedFloor when floors are loaded
  useEffect(() => {
    if (floors.length > 0 && !selectedFloor) {
      setSelectedFloor(floors[0].id.toString());
    }
  }, [floors]);

  const renderFloor = () => {
    return (
      <View style={styles.card}>
        <FloorDetails floorId={selectedFloor} />
      </View>
    );
  };

  const selectedFloorObj = floors.find(floor => floor.id.toString() === selectedFloor);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <StyledText style={styles.emptyText}>Loading floors...</StyledText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.selectorContainer}>
        <FloorSelector
          floors={floors}
          selectedFloor={selectedFloor}
          onSelectFloor={(id) => setSelectedFloor(id)}
        />
      </View>
      
      {selectedFloorObj ? (
        <View style={styles.selectedFloorContainer}>
          <View style={styles.titleContainer}>
            <StyledText weight="bold" style={styles.floorTitle}>
              {selectedFloorObj.name}
            </StyledText>
          </View>
          {renderFloor()}
        </View>
      ) : floors.length > 0 ? (
        // This should rarely happen, but just in case
        <View style={styles.emptyState}>
          <StyledText style={styles.emptyText}>Select a floor to view machines</StyledText>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <StyledText style={styles.emptyText}>No floors available</StyledText>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  selectorContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedFloorContainer: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: 10,
    paddingHorizontal: 6,
  },
  floorTitle: {
    fontSize: 20,
    color: '#333',
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  }
});

export default FloorList; 