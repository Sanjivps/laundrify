import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { StyledText } from '../contexts/FontContext';
import { LinearGradient } from 'expo-linear-gradient';

interface AppHeaderProps {
  subtitle?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ subtitle }) => {
  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8F9FA']}
      style={styles.header}
    >
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/laundrify.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <StyledText weight="bold" style={styles.logoText}>Laundrify</StyledText>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 32,
    height: 32,
  },
  logoText: {
    fontSize: 26,
    color: '#BF5700',
    marginLeft: 10,
    letterSpacing: -0.5,
  }
});

export default AppHeader; 