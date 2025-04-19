import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyledText } from '../contexts/FontContext';
import { LostItem } from '../services/lostItemsService';
import { useLostItems } from '../contexts/LostItemsContext';

interface LostItemProps {
  item: LostItem;
}

const LostItemComponent: React.FC<LostItemProps> = ({ item }) => {
  const { markAsFound } = useLostItems();
  const isLost = item.status === 'lost';
  
  const handleMarkAsFound = () => {
    if (!isLost) return;
    
    Alert.alert(
      "Mark as Found",
      "Did you find this item and delivered it to the specified room?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes",
          onPress: () => markAsFound(item.id)
        }
      ]
    );
  };
  
  // Format date
  const formattedDate = new Date(item.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <View style={[styles.container, isLost ? styles.lostItem : styles.foundItem]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <StyledText style={styles.roomNumber}>Room {item.roomNumber}</StyledText>
          <StyledText style={styles.date}>{formattedDate}</StyledText>
        </View>
        
        <StyledText style={styles.description}>{item.description}</StyledText>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, isLost ? styles.lostIndicator : styles.foundIndicator]} />
          <StyledText style={styles.statusText}>
            {isLost ? 'Lost' : 'Found'}
          </StyledText>
        </View>
      </View>
      
      {isLost && (
        <TouchableOpacity style={styles.foundButton} onPress={handleMarkAsFound}>
          <Ionicons name="checkmark-circle" size={28} color="#BF5700" />
          <StyledText style={styles.foundButtonText}>Found It</StyledText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
  },
  lostItem: {
    borderLeftColor: '#FF7F7F', // Red for lost items
  },
  foundItem: {
    borderLeftColor: '#8FE388', // Green for found items
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  roomNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  description: {
    fontSize: 15,
    color: '#555',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  lostIndicator: {
    backgroundColor: '#FF7F7F', // Red for lost
  },
  foundIndicator: {
    backgroundColor: '#8FE388', // Green for found
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  foundButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },
  foundButtonText: {
    fontSize: 10,
    color: '#BF5700',
    marginTop: 2,
  },
});

export default LostItemComponent; 