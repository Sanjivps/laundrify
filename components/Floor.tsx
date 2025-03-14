import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WashingMachine from './WashingMachine';
import { Floor as FloorType } from '../data/floors';

interface FloorProps {
  floor: FloorType;
  onMachineStatusChange: (floorId: number, machineId: number, newStatus: 'available' | 'in use') => void;
}

const Floor: React.FC<FloorProps> = ({ floor, onMachineStatusChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.floorName}>{floor.name}</Text>
      <View style={styles.machinesContainer}>
        {floor.washingMachines.map((machine) => (
          <WashingMachine
            key={machine.id}
            machine={machine}
            onStatusChange={(machineId, newStatus) =>
              onMachineStatusChange(floor.id, machineId, newStatus)
            }
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  floorName: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 10,
    color: '#333',
  },
  machinesContainer: {
    paddingHorizontal: 8,
  },
});

export default Floor; 