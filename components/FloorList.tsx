import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Floor from './Floor';
import { Floor as FloorType } from '../data/floors';

interface FloorListProps {
  initialFloors: FloorType[];
}

const FloorList: React.FC<FloorListProps> = ({ initialFloors }) => {
  // State to keep track of floors data
  const [floors, setFloors] = useState<FloorType[]>(initialFloors);

  // Function to update a washing machine's status
  const handleMachineStatusChange = (floorId: number, machineId: number, newStatus: 'available' | 'in use') => {
    setFloors(currentFloors => {
      return currentFloors.map(floor => {
        if (floor.id === floorId) {
          // Update the specific washing machine in this floor
          const updatedMachines = floor.washingMachines.map(machine => {
            if (machine.id === machineId) {
              return { ...machine, status: newStatus };
            }
            return machine;
          });
          return { ...floor, washingMachines: updatedMachines };
        }
        return floor;
      });
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.floorsContainer}>
        {floors.map(floor => (
          <Floor
            key={floor.id}
            floor={floor}
            onMachineStatusChange={handleMachineStatusChange}
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
});

export default FloorList; 