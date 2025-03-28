import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLostItems } from '../contexts/LostItemsContext';
import LostItemComponent from '../components/LostItem';
import { StyledText } from '../contexts/FontContext';

export default function LostFoundScreen() {
  const { lostItems, loading, addItem, filterStatus, setFilterStatus } = useLostItems();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [description, setDescription] = useState('');
  const [roomNumber, setRoomNumber] = useState('');

  // Filter out found items when filterStatus is 'all' - only display them when explicitly selected
  const displayItems = filterStatus === 'found' 
    ? lostItems 
    : filterStatus === 'lost'
      ? lostItems
      : lostItems.filter(item => item.status === 'lost'); // Only show lost items by default

  const handleAddItem = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    if (!roomNumber.trim()) {
      Alert.alert('Error', 'Please enter a room number');
      return;
    }

    await addItem(description.trim(), roomNumber.trim());
    setDescription('');
    setRoomNumber('');
    setIsAddingItem(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <StyledText style={styles.headerTitle}>Lost & Found</StyledText>
      </View>
      
      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filterStatus === 'all' && styles.activeFilterTab]}
          onPress={() => setFilterStatus('all')}
        >
          <StyledText 
            style={[styles.filterText, filterStatus === 'all' && styles.activeFilterText]}
            weight={filterStatus === 'all' ? 'bold' : 'regular'}
          >
            All
          </StyledText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, filterStatus === 'lost' && styles.activeFilterTab]}
          onPress={() => setFilterStatus('lost')}
        >
          <StyledText 
            style={[styles.filterText, filterStatus === 'lost' && styles.activeFilterText]}
            weight={filterStatus === 'lost' ? 'bold' : 'regular'}
          >
            Lost
          </StyledText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, filterStatus === 'found' && styles.activeFilterTab]}
          onPress={() => setFilterStatus('found')}
        >
          <StyledText 
            style={[styles.filterText, filterStatus === 'found' && styles.activeFilterText]}
            weight={filterStatus === 'found' ? 'bold' : 'regular'}
          >
            Found
          </StyledText>
        </TouchableOpacity>
      </View>
      
      {/* Add item form */}
      {isAddingItem && (
        <View style={styles.addItemForm}>
          <StyledText style={styles.formTitle} weight="bold">Report Lost Item</StyledText>
          
          <TextInput
            style={styles.input}
            placeholder="Description (e.g., Blue Hoodie)"
            value={description}
            onChangeText={setDescription}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Room Number"
            value={roomNumber}
            onChangeText={setRoomNumber}
            keyboardType="number-pad"
          />
          
          <View style={styles.formButtons}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={() => setIsAddingItem(false)}
            >
              <StyledText style={styles.buttonText}>Cancel</StyledText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.submitButton]} 
              onPress={handleAddItem}
            >
              <StyledText style={styles.submitButtonText}>Submit</StyledText>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Lost items list */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#BF5700" />
          <StyledText style={styles.loadingText}>Loading items...</StyledText>
        </View>
      ) : (
        <View style={styles.content}>
          <FlatList
            data={displayItems}
            renderItem={({ item }) => <LostItemComponent item={item} />}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color="#ccc" />
                <StyledText style={styles.emptyText}>No items found</StyledText>
              </View>
            }
          />
          
          {/* Add button */}
          {!isAddingItem && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setIsAddingItem(true)}
            >
              <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#BF5700',
    marginBottom: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeFilterTab: {
    borderBottomColor: '#BF5700',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#BF5700',
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  listContent: {
    paddingVertical: 8,
  },
  addItemForm: {
    margin: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  formTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
  },
  submitButton: {
    backgroundColor: '#BF5700',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    bottom: 80,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#BF5700',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  emptyContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    color: '#999',
    fontSize: 16,
  },
}); 