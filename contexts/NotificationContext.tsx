import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Set up notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Interface for the notification context
interface NotificationContextType {
  notifiedFloors: number[];
  toggleFloorNotification: (floorId: number) => Promise<void>;
  isFloorNotified: (floorId: number) => boolean;
  notifyAvailableMachine: (floorId: number, machineId: string, machineType: string) => Promise<void>;
  requestPermissions: () => Promise<boolean>;
}

// Create the context
const NotificationContext = createContext<NotificationContextType>({
  notifiedFloors: [],
  toggleFloorNotification: async () => {},
  isFloorNotified: () => false,
  notifyAvailableMachine: async () => {},
  requestPermissions: async () => false,
});

// Storage key
const NOTIFICATION_FLOORS_KEY = 'laundrify_notification_floors';

// Provider component
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifiedFloors, setNotifiedFloors] = useState<number[]>([]);
  const [hasPermissions, setHasPermissions] = useState(false);

  // Load saved notification floors
  useEffect(() => {
    const loadNotifiedFloors = async () => {
      try {
        const storedFloors = await AsyncStorage.getItem(NOTIFICATION_FLOORS_KEY);
        if (storedFloors) {
          setNotifiedFloors(JSON.parse(storedFloors));
        }
      } catch (error) {
        console.error('Error loading notified floors:', error);
      }
    };

    loadNotifiedFloors();
  }, []);

  // Request notification permissions
  const requestPermissions = async () => {
    if (Platform.OS === 'web') {
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    const hasPermission = finalStatus === 'granted';
    setHasPermissions(hasPermission);
    return hasPermission;
  };

  // Toggle notification for a floor
  const toggleFloorNotification = async (floorId: number) => {
    // Request permissions if needed
    if (!hasPermissions) {
      const permissionGranted = await requestPermissions();
      if (!permissionGranted) {
        return; // Can't enable notifications without permissions
      }
    }

    let updatedFloors: number[];
    if (notifiedFloors.includes(floorId)) {
      // Remove floor from notifications
      updatedFloors = notifiedFloors.filter(id => id !== floorId);
    } else {
      // Add floor to notifications
      updatedFloors = [...notifiedFloors, floorId];
    }

    setNotifiedFloors(updatedFloors);
    
    // Save to persistent storage
    try {
      await AsyncStorage.setItem(NOTIFICATION_FLOORS_KEY, JSON.stringify(updatedFloors));
    } catch (error) {
      console.error('Error saving notified floors:', error);
    }
  };

  // Check if a floor is notified
  const isFloorNotified = (floorId: number) => {
    return notifiedFloors.includes(floorId);
  };

  // Send notification for an available machine
  const notifyAvailableMachine = async (floorId: number, machineId: string, machineType: string) => {
    if (!isFloorNotified(floorId)) {
      return; // Don't notify if the floor is not in the notification list
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Laundry Machine Available!',
        body: `${machineType.charAt(0).toUpperCase() + machineType.slice(1)} #${machineId.slice(-1)} on Floor ${floorId} is now free to use.`,
        data: { floorId, machineId },
      },
      trigger: null, // Send immediately
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifiedFloors,
        toggleFloorNotification,
        isFloorNotified,
        notifyAvailableMachine,
        requestPermissions,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use the notification context
export const useNotifications = () => useContext(NotificationContext); 