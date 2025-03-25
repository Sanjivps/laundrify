import React, { createContext, useContext, useState, useEffect } from 'react';
import { Floor, WashingMachine } from '../data/floors';
import initialFloors from '../data/floors';
import { subscribeLaundryMachines } from '../services/firebaseService';
import { DatabaseReference } from 'firebase/database';

interface LaundryContextType {
  floors: Floor[];
  loading: boolean;
  error: string | null;
}

const LaundryContext = createContext<LaundryContextType>({
  floors: initialFloors,
  loading: true,
  error: null,
});

export const useLaundry = () => useContext(LaundryContext);

export const LaundryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [floors, setFloors] = useState<Floor[]>(initialFloors);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const fetchLaundryData = async () => {
      try {
        // Subscribe to laundry machine updates
        unsubscribe = subscribeLaundryMachines((updatedMachines) => {
          // Map the updatedMachines back to their respective floors
          const updatedFloors = initialFloors.map(floor => {
            // Find machines that belong to this floor
            const floorMachines = updatedMachines.filter(machine => 
              floor.washingMachines.some(m => m.id === machine.id)
            );
            
            // Return the updated floor with new machine data
            return {
              ...floor,
              washingMachines: floor.washingMachines.map(machine => {
                const updatedMachine = floorMachines.find(m => m.id === machine.id);
                return updatedMachine || machine;
              }),
            };
          });
          
          setFloors(updatedFloors);
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
  }, []);

  return (
    <LaundryContext.Provider value={{ floors, loading, error }}>
      {children}
    </LaundryContext.Provider>
  );
}; 