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
  ScrollView,
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
      id: `welcome-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text: 'Hello! I\'m your Laundrify assistant. Ask me anything about laundry machines, how to use them, or troubleshooting tips! You can also share a photo of your clothing for washing instructions.',
      isUser: false,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [image, setImage] = useState<string | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200);
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

  // Pick image from library
  const pickImage = async () => {
    try {
      // Request permissions for camera
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Camera access is required to take pictures');
          return;
        }
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        addMessage('photo', result.assets[0].uri, 'user');
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try selecting from gallery instead.');
    }
  };

  // Pick image from gallery
  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      addMessage('photo', result.assets[0].uri, 'user');
    }
  };

  // Add a message to chat history
  const addMessage = (type: 'text' | 'photo', content: string, sender: 'user' | 'assistant'): void => {
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text: type === 'text' ? content : '',
      isUser: sender === 'user',
      image: type === 'photo' ? content : undefined
    };
    
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages, newMessage];
      
      // If user sent a message, generate a response
      if (sender === 'user' && type === 'text') {
        generateResponse(content).catch(error => {
          console.error('Failed to generate response:', error);
        });
      } else if (sender === 'user' && type === 'photo') {
        // Pass the image URI directly to the analysis function
        generateImageAnalysis(content).catch(error => {
          console.error('Failed to analyze image:', error);
        });
      }
      
      return updatedMessages;
    });
  };

  // Generate a response to image
  const generateImageAnalysis = async (imageUri: string): Promise<void> => {
    setLoading(true);
    
    try {
      if (!imageUri) {
        addMessage('text', "I couldn't process the image. Please try again.", 'assistant');
        setLoading(false);
        return;
      }

      // Call the actual OpenAI image analysis function
      const analysis = await analyzeClothingImage(imageUri);
      
      addMessage('text', analysis, 'assistant');
    } catch (error) {
      console.error('Error analyzing image:', error);
      addMessage('text', "I'm sorry, I encountered an error analyzing your image. Please try again later.", 'assistant');
    } finally {
      setLoading(false);
      setImage(null); // Clear the image after analysis
    }
  };

  // Generate a response to text message
  const generateResponse = async (userMessage: string): Promise<void> => {
    setLoading(true);
    
    try {
      // Call the actual OpenAI text response function
      const response = await sendMessageToOpenAI(userMessage);
      
      addMessage('text', response, 'assistant');
    } catch (error) {
      console.error('Error generating response:', error);
      addMessage('text', "I'm sorry, I encountered an error processing your message. Please try again later.", 'assistant');
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const handleSend = async () => {
    if (inputText.trim() === '') return;

    // Add user message
    addMessage('text', inputText.trim(), 'user');
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <StyledText style={styles.headerTitle}>Laundry Chat</StyledText>
      </View>
      <StatusBar style="light" />
      
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatMessages}
          contentContainerStyle={styles.chatMessagesContent}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessageContainer : styles.botMessageContainer,
              ]}
            >
              {message.image && (
                <View style={styles.imagePreviewContainer}>
                  <Image 
                    source={{ uri: message.image }} 
                    style={styles.imagePreview} 
                    resizeMode="cover"
                  />
                </View>
              )}
              
              {message.text && (
                <StyledText 
                  weight={message.isUser ? 'medium' : 'regular'} 
                  style={[
                    styles.messageText, 
                    message.isUser ? styles.userMessageText : null
                  ]}
                >
                  {message.text}
                </StyledText>
              )}
            </View>
          ))}
          
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#BF5700" />
              <StyledText style={styles.loadingText}>Analyzing...</StyledText>
            </View>
          )}
        </ScrollView>
        
        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={pickImage}
          >
            <Ionicons name="camera" size={24} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={pickImageFromGallery}
          >
            <Ionicons name="images" size={24} color="#666" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            multiline={false}
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              !inputText.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
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
  chatMessages: {
    flex: 1,
  },
  chatMessagesContent: {
    paddingHorizontal: 16,
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
  botMessageContainer: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 16,
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  userMessageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
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
    alignItems: 'center',
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
    height: 150,
    marginVertical: 5,
    borderRadius: 8,
    overflow: 'hidden',
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
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
    paddingBottom: 40,
  },
  captureButton: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  cameraButtonPlaceholder: {
    width: 40,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 80,
  },
  welcomeText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 10,
    margin: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 16,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  iconButton: {
    padding: 8,
    marginRight: 6,
  },
}); 