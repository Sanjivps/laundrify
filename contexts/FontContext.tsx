import React, { createContext, useContext, useState, useEffect } from 'react';
import { Text, TextStyle, TextProps, Platform } from 'react-native';
import * as Font from 'expo-font';

// Define font family names
const fontConfig = {
  regular: Platform.select({
    ios: 'SF Pro Text',
    android: 'SF-Pro-Text-Regular',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'SF Pro Text',
    android: 'SF-Pro-Text-Medium',
    default: 'System',
  }),
  semibold: Platform.select({
    ios: 'SF Pro Text',
    android: 'SF-Pro-Text-Semibold', 
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'SF Pro Text',
    android: 'SF-Pro-Text-Bold',
    default: 'System',
  }),
};

// Define the context type
interface FontContextType {
  fontsLoaded: boolean;
  fontFamily: typeof fontConfig;
}

// Create the context
const FontContext = createContext<FontContextType>({
  fontsLoaded: false,
  fontFamily: fontConfig,
});

// Custom text component that uses our fonts
interface StyledTextProps extends TextProps {
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}

export const StyledText: React.FC<StyledTextProps> = ({ 
  children, 
  style, 
  weight = 'regular',
  ...props 
}) => {
  const { fontsLoaded, fontFamily } = useContext(FontContext);
  
  // Set the font weight and family
  const fontStyle: TextStyle = {
    fontFamily: fontFamily[weight],
    fontWeight: weight === 'regular' ? 'normal' 
              : weight === 'medium' ? '500'
              : weight === 'semibold' ? '600'
              : 'bold',
  };

  return (
    <Text style={[fontStyle, style]} {...props}>
      {children}
    </Text>
  );
};

// Provider component that loads fonts
export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  useEffect(() => {
    // On iOS, SF Pro is already available as a system font
    if (Platform.OS === 'ios') {
      setFontsLoaded(true);
      return;
    }
    
    // Only load custom fonts for Android
    const loadFonts = async () => {
      try {
        // Note: For a real implementation, you would need to add the font files
        // to the assets/fonts directory and load them here
        await Font.loadAsync({
          'SF-Pro-Text-Regular': require('../assets/fonts/SF-Pro-Text-Regular.otf'),
          'SF-Pro-Text-Medium': require('../assets/fonts/SF-Pro-Text-Medium.otf'),
          'SF-Pro-Text-Semibold': require('../assets/fonts/SF-Pro-Text-Semibold.otf'),
          'SF-Pro-Text-Bold': require('../assets/fonts/SF-Pro-Text-Bold.otf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.warn('Error loading fonts:', error);
        // Fallback to system fonts if loading fails
        setFontsLoaded(true);
      }
    };
    
    loadFonts();
  }, []);
  
  // Provide the font context
  return (
    <FontContext.Provider value={{ fontsLoaded, fontFamily: fontConfig }}>
      {children}
    </FontContext.Provider>
  );
};

// Hook to use font context
export const useFonts = () => useContext(FontContext); 