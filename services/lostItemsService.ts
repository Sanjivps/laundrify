import { ref, onValue, push, set, update } from 'firebase/database';
import { database } from '../firebase';

// Type for a lost item
export interface LostItem {
  id: string;
  description: string;
  roomNumber: string;
  status: 'lost' | 'found';
  createdAt: number;
}

// Function to subscribe to lost items
export const subscribeLostItems = (callback: (items: LostItem[]) => void) => {
  const lostItemsRef = ref(database, 'lostItems');
  
  return onValue(lostItemsRef, (snapshot) => {
    const data = snapshot.val();
    
    if (!data) {
      console.log('No lost items available');
      callback([]);
      return;
    }
    
    // Convert the object to an array with IDs included
    const lostItemsArray = Object.entries(data).map(([id, item]: [string, any]) => ({
      id,
      ...item
    })) as LostItem[];
    
    // Sort by createdAt (newest first)
    lostItemsArray.sort((a, b) => b.createdAt - a.createdAt);
    
    callback(lostItemsArray);
  });
};

// Function to add a new lost item
export const addLostItem = async (description: string, roomNumber: string) => {
  const lostItemsRef = ref(database, 'lostItems');
  const newItemRef = push(lostItemsRef);
  
  await set(newItemRef, {
    description,
    roomNumber,
    status: 'lost',
    createdAt: Date.now()
  });
  
  return newItemRef.key;
};

// Function to mark an item as found
export const markItemAsFound = async (itemId: string) => {
  const itemRef = ref(database, `lostItems/${itemId}`);
  
  await update(itemRef, {
    status: 'found'
  });
}; 