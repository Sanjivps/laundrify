import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { sendMessageToOpenAI, analyzeClothingImage } from '../services/openaiService';
import AppHeader from '../components/AppHeader';
import { StyledText } from '../contexts/FontContext';
import * as ImagePicker from 'expo-image-picker';

// Message type definition
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  image?: string; // URI for image if present
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Laundrify assistant. Ask me anything about laundry machines, how to use them, or troubleshooting tips! You can also share a photo of your clothing for washing instructions.',
      isUser: false,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Request permissions for camera/gallery
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Sorry, we need camera roll permissions to upload images!');
        }
      }
    })();
  }, []);

  // Handle sending a text message
  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await sendMessageToOpenAI(inputText.trim());
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response || "Sorry, I couldn't process that request. Please try again.",
        isUser: false,
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message to OpenAI:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting. Please check your internet connection and try again.",
        isUser: false,
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Handle image picker
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleImageUpload(result.assets[0].uri);
    }
  };

  // Handle camera
  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera permissions to take pictures!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleImageUpload(result.assets[0].uri);
    }
  };

  // Process the selected image
  const handleImageUpload = async (imageUri: string) => {
    // Add user message with image
    const userMessage: Message = {
      id: Date.now().toString(),
      text: "Can you analyze this clothing item and provide laundry instructions?",
      isUser: true,
      image: imageUri
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setLoading(true);

    try {
      // Process the image with OpenAI
      const analysisResult = await analyzeClothingImage(imageUri);
      
      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: analysisResult,
        isUser: false,
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error analyzing image:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I couldn't analyze this image. Please try again with a clearer picture of the clothing item.",
        isUser: false,
      };

      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Render each chat message
  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessageContainer : null,
      ]}
    >
      {item.image && (
        <Image 
          source={{ uri: item.image }} 
          style={styles.imagePreview} 
          resizeMode="cover"
        />
      )}
      <StyledText 
        weight={item.isUser ? 'medium' : 'regular'} 
        style={[
          styles.messageText, 
          item.isUser && { color: '#fff' }
        ]}
      >
        {item.text}
      </StyledText>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <StyledText style={styles.headerTitle}>Laundry Chat</StyledText>
      </View>
      
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
        />
        
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TouchableOpacity 
              style={styles.cameraButton} 
              onPress={pickImage}
              disabled={loading}
            >
              <Ionicons name="image-outline" size={22} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cameraButton} 
              onPress={takePicture}
              disabled={loading}
            >
              <Ionicons name="camera-outline" size={22} color="#666" />
            </TouchableOpacity>
            
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              multiline
              maxLength={1000}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              blurOnSubmit={false}
            />
            
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && loading && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="send" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    borderBottomColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#BF5700',
  },
  keyboardView: {
    flex: 1,
    paddingBottom: 20,
  },
  messageList: {
    padding: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 6,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
    backgroundColor: '#BF5700',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  userMessageText: {
    color: '#fff',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#BF5700',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#E8A87C',
  },
  imagePreviewContainer: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
}); 