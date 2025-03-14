import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WashingMachine as WashingMachineType } from '../data/floors';

interface WashingMachineProps {
  machine: WashingMachineType;
  onStatusChange: (machineId: number, newStatus: 'available' | 'in use') => void;
}

const WashingMachine: React.FC<WashingMachineProps> = ({ machine, onStatusChange }) => {
  // Determine if the machine is available or in use
  const isAvailable = machine.status === 'available';

  // Handle press to toggle the status
  const handlePress = () => {
    // Call the parent's onStatusChange function with the new status
    onStatusChange(machine.id, isAvailable ? 'in use' : 'available');
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={[styles.container, isAvailable ? styles.available : styles.inUse]}>
        <Text style={styles.id}>Machine #{machine.id}</Text>
        <Text style={styles.status}>
          {isAvailable ? 'Available' : 'In Use'}
        </Text>
      </View>
    </TouchableOpacity>
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
    backgroundColor: '#8FE388', // Green color for available machines
  },
  inUse: {
    backgroundColor: '#FF7F7F', // Red color for machines in use
  },
  id: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default WashingMachine; 