import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLaundry } from '../contexts/LaundryContext';
import LaundryMachine from './LaundryMachine';
import { StyledText } from '../contexts/FontContext';

interface FloorDetailsProps {
  floorId: string;
}

const FloorDetails: React.FC<FloorDetailsProps> = ({ floorId }) => {
  const { floors, loading } = useLaundry();
  
  // Find the floor directly from floors array
  const floor = floors.find(f => f.id.toString() === floorId);
  const machines = floor ? floor.machines : [];
  
  const washers = machines.filter(machine => machine.type === 'washer');
  const dryers = machines.filter(machine => machine.type === 'dryer');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StyledText style={styles.loadingText}>Loading machines...</StyledText>
      </View>
    );
  }

  if (!floorId) {
    return (
      <View style={styles.emptyState}>
        <StyledText style={styles.emptyText}>Please select a floor</StyledText>
      </View>
    );
  }

  if (!floor) {
    return (
      <View style={styles.emptyState}>
        <StyledText style={styles.emptyText}>Floor not found</StyledText>
      </View>
    );
  }

  if (machines.length === 0) {
    return (
      <View style={styles.emptyState}>
        <StyledText style={styles.emptyText}>No machines available on {floor.name}</StyledText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {washers.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <StyledText weight="medium" style={styles.sectionTitle}>Washers</StyledText>
            </View>
            <View style={styles.machinesContainer}>
              {washers.map(machine => (
                <LaundryMachine key={machine.id} machine={machine} />
              ))}
            </View>
          </View>
        )}
        
        {dryers.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <StyledText weight="medium" style={styles.sectionTitle}>Dryers</StyledText>
            </View>
            <View style={styles.machinesContainer}>
              {dryers.map(machine => (
                <LaundryMachine key={machine.id} machine={machine} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingVertical: 12,
    paddingBottom: 30, // Extra bottom padding for scrolling
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#444',
  },
  machinesContainer: {
    paddingHorizontal: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#888',
    fontSize: 14,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
  }
});

export default FloorDetails; 