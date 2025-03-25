// Define types for our data
export interface WashingMachine {
  id: number;
  hasLaundry: boolean; // 1 = has laundry, 0 = empty
  hasMotion: boolean;  // 1 = running, 0 = not running
  status: 'available' | 'in use';
}

export interface Floor {
  id: number;
  name: string;
  washingMachines: WashingMachine[];
}

// Array of floor objects with washing machines
const floors: Floor[] = [
  {
    id: 1,
    name: 'First Floor',
    washingMachines: [
      { id: 101, status: 'available', hasLaundry: false, hasMotion: false },
      { id: 102, status: 'in use', hasLaundry: true, hasMotion: true },
      { id: 103, status: 'available', hasLaundry: false, hasMotion: false },
    ],
  },
  {
    id: 2,
    name: 'Second Floor',
    washingMachines: [
      { id: 201, status: 'available', hasLaundry: false, hasMotion: false },
      { id: 202, status: 'available', hasLaundry: false, hasMotion: false },
      { id: 203, status: 'in use', hasLaundry: true, hasMotion: true },
      { id: 204, status: 'in use', hasLaundry: true, hasMotion: true },
    ],
  },
  {
    id: 3,
    name: 'Third Floor',
    washingMachines: [
      { id: 301, status: 'in use', hasLaundry: true, hasMotion: true },
      { id: 302, status: 'available', hasLaundry: false, hasMotion: false },
    ],
  },
  {
    id: 4,
    name: 'Fourth Floor',
    washingMachines: [
      { id: 401, status: 'available', hasLaundry: false, hasMotion: false },
      { id: 402, status: 'available', hasLaundry: false, hasMotion: false },
      { id: 403, status: 'available', hasLaundry: false, hasMotion: false },
    ],
  },
];

export default floors; 