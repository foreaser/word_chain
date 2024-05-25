import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import HomeScreen from './components/HomeScreen';
import PracticeScreen from './components/PracticeScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');

  return (
    <View style={styles.container}>
      {currentScreen === 'Home' ? (
        <HomeScreen navigate={setCurrentScreen} />
      ) : (
        <PracticeScreen navigate={setCurrentScreen} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
