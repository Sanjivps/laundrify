import React from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Alert,
  Platform
} from 'react-native';
import { StyledText } from '../contexts/FontContext';
import { Ionicons } from '@expo/vector-icons';
import { Floor } from '../data/floors';
import { useNotifications } from '../contexts/NotificationContext';

interface FloorSelectorProps {
  floors: Floor[];
  selectedFloor: string;
  onSelectFloor: (floorId: string) => void;
}

const FloorSelector: React.FC<FloorSelectorProps> = ({ 
  floors, 
  selectedFloor, 
  onSelectFloor 
}) => {
  const { isFloorNotified, toggleFloorNotification } = useNotifications();

  const handleBellPress = (floorId: number) => {
    if (Platform.OS === 'web') {
      Alert.alert('Notifications not available on web.');
      return;
    }

    // Check if already subscribed
    const isNotified = isFloorNotified(floorId);
    
    if (isNotified) {
      // If already subscribed, ask for confirmation to unsubscribe
      Alert.alert(
        "Disable Notifications",
        `Stop receiving notifications for machines on Floor ${floorId}?`,
        [
          { 
            text: "No", 
            style: "cancel" 
          },
          { 
            text: "Yes", 
            onPress: () => toggleFloorNotification(floorId) 
          }
        ]
      );
    } else {
      // If not subscribed, ask for confirmation to subscribe
      Alert.alert(
        "Enable Notifications",
        `Would you like to receive a notification if any machine from Floor ${floorId} becomes free to use?`,
        [
          { 
            text: "No", 
            style: "cancel" 
          },
          { 
            text: "Yes", 
            onPress: () => toggleFloorNotification(floorId) 
          }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {floors.map((floor) => {
          const isSelected = floor.id.toString() === selectedFloor;
          const isNotified = isFloorNotified(floor.id);
          
          return (
            <View key={floor.id} style={styles.floorItemWrapper}>
              <TouchableOpacity
                style={[
                  styles.floorButton,
                  isSelected && styles.selectedFloorButton
                ]}
                onPress={() => onSelectFloor(floor.id.toString())}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={isSelected ? "layers" : "layers-outline"} 
                  size={18} 
                  color={isSelected ? "#BF5700" : "#777"} 
                  style={styles.icon}
                />
                <StyledText
                  weight={isSelected ? "bold" : "regular"}
                  style={[
                    styles.floorText,
                    isSelected && styles.selectedFloorText
                  ]}
                >
                  {floor.name}
                </StyledText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.bellIconContainer}
                onPress={() => handleBellPress(floor.id)}
              >
                <Ionicons 
                  name={isNotified ? "notifications" : "notifications-outline"} 
                  size={20} 
                  color={isNotified ? "#BF5700" : "#888"}
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  floorItemWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  floorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    paddingRight: 32,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  selectedFloorButton: {
    backgroundColor: '#FFF0E8',
  },
  icon: {
    marginRight: 6,
  },
  floorText: {
    fontSize: 15,
    color: '#777',
  },
  selectedFloorText: {
    color: '#BF5700',
  },
  bellIconContainer: {
    position: 'absolute',
    top: '50%',
    right: 8,
    marginTop: -10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default FloorSelector; 