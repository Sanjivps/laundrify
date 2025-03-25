import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { WashingMachine, Floor } from '../data/floors';

// Type for the Firebase laundry machine data
export interface LaundryMachineData {
  haslaundry: number; // 1 = has laundry, 0 = empty
  hasmotion: number; // 1 = running, 0 = not running
}

// Function to subscribe to laundry machine updates
export const subscribeLaundryMachines = (
  callback: (machines: WashingMachine[]) => void,
  initialFloors: Floor[]
) => {
  // Create a reference to the laundry machine data in the database
  const machineRef = ref(database, '/');
  
  // Listen for changes in the data
  return onValue(machineRef, (snapshot) => {
    const data = snapshot.val() as LaundryMachineData;
    
    if (!data) {
      console.log('No data available');
      return;
    }
    
    // For now, apply the same data to all machines as we only have one sensor
    const updatedMachines = initialFloors.flatMap(floor => 
      floor.washingMachines.map(machine => ({
        ...machine,
        hasLaundry: data.haslaundry === 1,
        hasMotion: data.hasmotion === 1,
        // Update status based on the data
        status: (data.haslaundry === 0 && data.hasmotion === 0) ? 'available' : 'in use'
      }))
    );
    
    callback(updatedMachines);
  });
}; 