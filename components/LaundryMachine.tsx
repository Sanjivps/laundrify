import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { StyledText } from '../contexts/FontContext';
import { Ionicons } from '@expo/vector-icons';
import { Machine } from '../data/floors';

// Status color mapping
const COLORS = {
  available: '#4CAF50',    // Green
  in_use: '#E91E63',       // Pink/Red
  finishing: '#FF9800',    // Orange
  out_of_order: '#9E9E9E', // Gray (legacy support)
};

// Status text mapping
const STATUS_TEXT = {
  available: 'Available',
  in_use: 'Running',
  finishing: 'Ready for Pickup',
  out_of_order: 'Out of Order', // legacy support
};

// Icon mapping
const ICONS = {
  available: 'checkmark-circle',
  in_use: 'refresh-circle',
  finishing: 'alert-circle',
  out_of_order: 'close-circle', // legacy support
};

interface LaundryMachineProps {
  machine: Machine;
}

const LaundryMachine: React.FC<LaundryMachineProps> = ({ machine }) => {
  // Determine color based on status
  const statusColor = COLORS[machine.status] || COLORS.out_of_order;
  const statusText = STATUS_TEXT[machine.status] || 'Unknown';
  const statusIcon = ICONS[machine.status] || 'help-circle';

  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.shadowProp]}>
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <StyledText weight="bold" style={styles.machineName}>
              {machine.type === 'washer' ? 'Washer' : 'Dryer'} {machine.number}
            </StyledText>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <StyledText weight="medium" style={styles.statusText}>
              {statusText}
            </StyledText>
          </View>
        </View>
        
        <View style={styles.body}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={machine.type === 'washer' ? 'water' : 'sunny'} 
              size={32} 
              color="#666"
              style={styles.typeIcon}
            />
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.statusRow}>
              <Ionicons name={statusIcon} size={20} color={statusColor} style={styles.statusIcon} />
              <StyledText style={styles.timeText}>
                {machine.status === 'in_use'
                  ? 'Machine is currently running' 
                  : machine.status === 'available' 
                    ? 'Free to use'
                    : machine.status === 'finishing'
                      ? 'Laundry is done, please collect'
                      : ''}
              </StyledText>
            </View>
            
            {machine.notes && (
              <View style={styles.notesContainer}>
                <StyledText style={styles.notesText}>
                  {machine.notes}
                </StyledText>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    overflow: 'hidden',
  },
  shadowProp: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  machineName: {
    fontSize: 16,
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  typeIcon: {
    opacity: 0.8,
  },
  detailsContainer: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusIcon: {
    marginRight: 6,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  notesContainer: {
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  notesText: {
    fontSize: 13,
    color: '#777',
    fontStyle: 'italic',
  },
});

export default LaundryMachine; 