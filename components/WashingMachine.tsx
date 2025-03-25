import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WashingMachine as WashingMachineType } from '../data/floors';

interface WashingMachineProps {
  machine: WashingMachineType;
  onStatusChange: (machineId: number, newStatus: 'available' | 'in use') => void;
}

const WashingMachine: React.FC<WashingMachineProps> = ({ machine, onStatusChange }) => {
  // Determine the status based on the Firebase data
  const isAvailable = !machine.hasMotion && !machine.hasLaundry;
  const isRunning = machine.hasMotion;
  const hasLaundry = machine.hasLaundry;

  // Get the appropriate style and status text
  let statusStyle = styles.available;
  let statusText = 'Available';

  if (isRunning) {
    statusStyle = styles.running;
    statusText = 'Running';
  } else if (hasLaundry) {
    statusStyle = styles.hasLaundry;
    statusText = 'Has Laundry';
  }

  return (
    <View style={[styles.container, statusStyle]}>
      <Text style={styles.id}>Machine #{machine.id}</Text>
      <View style={styles.statusContainer}>
        <Text style={styles.status}>{statusText}</Text>
        {hasLaundry && !isRunning && (
          <Text style={styles.readyText}>Ready for Pickup</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  available: {
    backgroundColor: '#8FE388', // Green for available machines
  },
  running: {
    backgroundColor: '#FFD700', // Yellow/gold for running machines
  },
  hasLaundry: {
    backgroundColor: '#FF7F7F', // Red for machines with laundry
  },
  id: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  readyText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default WashingMachine; 