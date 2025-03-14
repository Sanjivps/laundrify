// Define types for our data
export interface WashingMachine {
  id: number;
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
      { id: 101, status: 'available' },
      { id: 102, status: 'in use' },
      { id: 103, status: 'available' },
    ],
  },
  {
    id: 2,
    name: 'Second Floor',
    washingMachines: [
      { id: 201, status: 'available' },
      { id: 202, status: 'available' },
      { id: 203, status: 'in use' },
      { id: 204, status: 'in use' },
    ],
  },
  {
    id: 3,
    name: 'Third Floor',
    washingMachines: [
      { id: 301, status: 'in use' },
      { id: 302, status: 'available' },
    ],
  },
  {
    id: 4,
    name: 'Fourth Floor',
    washingMachines: [
      { id: 401, status: 'available' },
      { id: 402, status: 'available' },
      { id: 403, status: 'available' },
    ],
  },
];

export default floors; 