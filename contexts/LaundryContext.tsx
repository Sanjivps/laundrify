import React, { createContext, useContext, useState, useEffect } from 'react';
import { Floor, Machine } from '../data/floors';
import initialFloors from '../data/floors';
import { subscribeLaundryMachines } from '../services/firebaseService';
import { useNotifications } from './NotificationContext';

interface LaundryContextType {
  floors: Floor[];
  selectedFloor: Floor | null;
  selectFloor: (floorId: number) => void;
  loading: boolean;
  error: string | null;
  getMachinesForFloor: (floorId: string) => Machine[];
}

const LaundryContext = createContext<LaundryContextType>({
  floors: initialFloors,
  selectedFloor: null,
  selectFloor: () => {},
  loading: true,
  error: null,
  getMachinesForFloor: () => [],
});

export const useLaundry = () => useContext(LaundryContext);

export const LaundryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [floors, setFloors] = useState<Floor[]>(initialFloors);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [previousMachines, setPreviousMachines] = useState<Machine[]>([]);
  
  // Get the notification methods
  const notifications = useNotifications();

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const fetchLaundryData = async () => {
      try {
        // Subscribe to laundry machine updates
        unsubscribe = subscribeLaundryMachines((updatedMachines) => {
          // Check for machines that have become available
          if (previousMachines.length > 0) {
            updatedMachines.forEach(machine => {
              const prevMachine = previousMachines.find(m => m.id === machine.id);
              
              // If the machine was previously in use and is now free, send notification
              if (prevMachine && 
                  (prevMachine.hasLaundry || prevMachine.hasMotion) && 
                  !machine.hasLaundry && 
                  !machine.hasMotion) {
                // Extract floor ID from machine ID (first digit)
                const floorId = parseInt(machine.id.toString()[0]);
                
                // Send notification
                notifications.notifyAvailableMachine(
                  floorId, 
                  machine.id.toString(), 
                  machine.type
                );
              }
            });
          }
          
          // Store current machines for future comparison
          setPreviousMachines(updatedMachines);
          
          // Map the updatedMachines back to their respective floors
          const updatedFloors = initialFloors.map(floor => {
            // Find machines that belong to this floor
            const floorMachines = updatedMachines.filter(machine => 
              floor.machines.some(m => m.id === machine.id)
            );
            
            // Return the updated floor with new machine data
            return {
              ...floor,
              machines: floor.machines.map(machine => {
                const updatedMachine = floorMachines.find(m => m.id === machine.id);
                return updatedMachine || machine;
              }),
            };
          });
          
          setFloors(updatedFloors);
          
          // If there's a selectedFloor, update its data too
          if (selectedFloor) {
            const updatedSelectedFloor = updatedFloors.find(f => f.id === selectedFloor.id);
            if (updatedSelectedFloor) {
              setSelectedFloor(updatedSelectedFloor);
            }
          }
          
          setLoading(false);
        }, initialFloors);
      } catch (err) {
        console.error('Error fetching laundry data:', err);
        setError('Failed to load laundry machine data');
        setLoading(false);
      }
    };

    fetchLaundryData();

    // Cleanup the subscription when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [notifications]);

  // Function to select a floor
  const selectFloor = (floorId: number) => {
    const floor = floors.find(f => f.id === floorId);
    setSelectedFloor(floor || null);
  };

  // Function to get machines for a specific floor
  const getMachinesForFloor = (floorId: string) => {
    const floor = floors.find(f => f.id.toString() === floorId);
    return floor ? floor.machines : [];
  };

  return (
    <LaundryContext.Provider 
      value={{ 
        floors, 
        selectedFloor, 
        selectFloor, 
        loading, 
        error,
        getMachinesForFloor
      }}
    >
      {children}
    </LaundryContext.Provider>
  );
}; 