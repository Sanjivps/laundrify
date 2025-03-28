import React, { createContext, useContext, useState, useEffect } from 'react';
import { LostItem, subscribeLostItems, addLostItem, markItemAsFound } from '../services/lostItemsService';

interface LostItemsContextType {
  lostItems: LostItem[];
  loading: boolean;
  error: string | null;
  addItem: (description: string, roomNumber: string) => Promise<string | null>;
  markAsFound: (itemId: string) => Promise<void>;
  filterStatus: 'all' | 'lost' | 'found';
  setFilterStatus: React.Dispatch<React.SetStateAction<'all' | 'lost' | 'found'>>;
}

// Create the context
const LostItemsContext = createContext<LostItemsContextType>({
  lostItems: [],
  loading: true,
  error: null,
  addItem: async () => null,
  markAsFound: async () => {},
  filterStatus: 'all',
  setFilterStatus: () => {},
});

// Provider component
export const LostItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'lost' | 'found'>('all');

  // Subscribe to lost items
  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeLostItems((items) => {
      setLostItems(items);
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, []);

  // Add a new lost item
  const addItem = async (description: string, roomNumber: string): Promise<string | null> => {
    try {
      return await addLostItem(description, roomNumber);
    } catch (err) {
      setError('Failed to add lost item');
      console.error('Error adding lost item:', err);
      return null;
    }
  };

  // Mark an item as found
  const markAsFound = async (itemId: string): Promise<void> => {
    try {
      await markItemAsFound(itemId);
    } catch (err) {
      setError('Failed to mark item as found');
      console.error('Error marking item as found:', err);
    }
  };

  // Filter items based on status
  const filteredItems = filterStatus === 'all' 
    ? lostItems 
    : lostItems.filter(item => item.status === filterStatus);

  return (
    <LostItemsContext.Provider
      value={{
        lostItems: filteredItems,
        loading,
        error,
        addItem,
        markAsFound,
        filterStatus,
        setFilterStatus,
      }}
    >
      {children}
    </LostItemsContext.Provider>
  );
};

// Custom hook for using the context
export const useLostItems = () => useContext(LostItemsContext); 