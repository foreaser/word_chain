import React from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';

export default function HomeScreen({ navigate }) {
  const handlePracticePress = () => {
    navigate('Practice');
  };

  const handleBattlePress = () => {
    navigate('MutualGame');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>끝말잇기 Game</Text>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: pressed ? 'deepskyblue' : 'dodgerblue' },
        ]}
        onPress={handlePracticePress}
      >
        {({ pressed }) => <Text style={styles.buttonText}>연습하기</Text>}
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: pressed ? 'darkblue' : 'blue' },
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
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'navy',
    marginBottom: 20,
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
