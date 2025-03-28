import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { Machine, Floor } from '../data/floors';

// Type for the Firebase laundry machine data
export interface LaundryMachineData {
  haslaundry: number; // 1 = has laundry, 0 = empty
  hasmotion: number; // 1 = running, 0 = not running
}

// Function to subscribe to laundry machine updates
export const subscribeLaundryMachines = (
  callback: (machines: Machine[]) => void,
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
      floor.machines.map(machine => {
        // Simplified status logic with only three states:
        // 1. Running (hasLaundry=1, hasMotion=1)
        // 2. Ready for pickup (hasLaundry=1, hasMotion=0)
        // 3. Available (hasLaundry=0, hasMotion=0)
        let newStatus: 'available' | 'in_use' | 'finishing';
        
        if (data.haslaundry === 1 && data.hasmotion === 1) {
          newStatus = 'in_use'; // Machine is running
        } else if (data.haslaundry === 1 && data.hasmotion === 0) {
          newStatus = 'finishing'; // Laundry done, ready for pickup
        } else {
          newStatus = 'available'; // Machine is free to use
        }
        
        return {
          ...machine,
          hasLaundry: data.haslaundry === 1,
          hasMotion: data.hasmotion === 1,
          status: newStatus,
        };
      })
    );
    
    callback(updatedMachines);
  });
}; 