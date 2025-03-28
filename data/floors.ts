// Define types for our data
export interface Machine {
  id: number;
  type: 'washer' | 'dryer';
  hasLaundry: boolean; // true = has laundry, false = empty
  hasMotion: boolean;  // true = running, false = not running
  status: 'available' | 'in_use' | 'finishing';
  timeRemaining?: number;
  number: number; // Machine number
  notes?: string;
}

export interface Floor {
  id: number;
  name: string;
  machines: Machine[];
}

// Helper function to create floors with machines
const createFloors = (numFloors: number, washersPerFloor: number, dryersPerFloor: number): Floor[] => {
  const floors: Floor[] = [];
  
  for (let i = 1; i <= numFloors; i++) {
    const machines: Machine[] = [];
    
    // Add washers (ID format: floor-digit + '0' + machine-number)
    for (let w = 1; w <= washersPerFloor; w++) {
      // Create status based on a simple pattern (for demo purposes)
      let status: Machine['status'] = 'available';
      
      // Some machines will be in use or finishing
      if (w === 1 && i % 3 === 0) status = 'in_use';
      if (w === 2 && i % 4 === 0) status = 'finishing';
      
      // Add time remaining for machines in use
      const timeRemaining = status === 'in_use' ? 15 + (i * 3) % 20 : undefined;
      
      machines.push({
        id: parseInt(`${i}0${w}`),
        type: 'washer',
        hasLaundry: status === 'in_use' || status === 'finishing',
        hasMotion: status === 'in_use',
        status: status,
        timeRemaining: timeRemaining,
        number: w,
        notes: undefined
      });
    }
    
    // Add dryers (ID format: floor-digit + '5' + machine-number)
    for (let d = 1; d <= dryersPerFloor; d++) {
      // Create status based on a simple pattern (for demo purposes)
      let status: Machine['status'] = 'available';
      
      // Some machines will be in use or finishing
      if (d === 1 && i % 4 === 0) status = 'in_use';
      if (d === 2 && i % 5 === 0) status = 'finishing';
      
      // Add time remaining for machines in use
      const timeRemaining = status === 'in_use' ? 25 + (i * 4) % 30 : undefined;
      
      machines.push({
        id: parseInt(`${i}5${d}`),
        type: 'dryer',
        hasLaundry: status === 'in_use' || status === 'finishing',
        hasMotion: status === 'in_use',
        status: status,
        timeRemaining: timeRemaining,
        number: d,
        notes: undefined
      });
    }
    
    floors.push({
      id: i,
      name: `Floor ${i}`,
      machines
    });
  }
  
  return floors;
};

// Create 14 floors with 3 washers and 3 dryers each
const floors: Floor[] = createFloors(14, 3, 3);

export default floors; 