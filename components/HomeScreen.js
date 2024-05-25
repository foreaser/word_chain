// HomeScreen.js
import React from 'react';
import { View, Pressable, StyleSheet, Alert, Text } from 'react-native';

export default function HomeScreen({ navigate }) {
  const handlePracticePress = () => {
    navigate('Practice');
  };

  const handleBattlePress = () => {
    Alert.alert('현재 서비스 준비중입니다');
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: pressed ? 'darkblue' : 'blue' },
        ]}
        onPress={handlePracticePress}
      >
        {({ pressed }) => <Text style={styles.buttonText}>연습하기</Text>}
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: pressed ? 'darkgreen' : 'green' },
        ]}
        onPress={handleBattlePress}
      >
        {({ pressed }) => <Text style={styles.buttonText}>1:1 대결</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
