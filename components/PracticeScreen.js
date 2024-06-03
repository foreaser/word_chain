import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  Image,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';

export default function PracticeScreen({ navigate }) {
  const [word, setWord] = useState('');
  const [words, setWords] = useState([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [wrongWord, setWrongWord] = useState(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRotationEnabled, setIsRotationEnabled] = useState(false);
  const scrollViewRef = useRef();
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerStarted && timeLeft > 0 && !gameOver) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
      Alert.alert('패배! 시간을 초과했습니다.');
      return;
    }

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gameOver, timerStarted]);

  useEffect(() => {
    if (gameOver) {
      setTimerStarted(false);
    }
  }, [gameOver]);

  const handleInputChange = (input) => {
    setWord(input);
    setWrongWord(null);
  };

  const handleInputSubmit = () => {
    if (gameOver) {
      Alert.alert('게임이 종료되었습니다. 다시 시작하세요!');
      return;
    }

    if (words.includes(word)) {
      setWrongWord(word);
      Alert.alert(
        `${word}는(은) 이전에 입력된 단어입니다. 다른 단어를 입력하세요!`
      );
      return;
    }

    if (words.length > 0) {
      const lastWord = words[words.length - 1];
      if (lastWord[lastWord.length - 1] !== word[0]) {
        setWrongWord(word);
        Alert.alert(`${word}는(은) 틀린 단어입니다. 다른 단어를 입력하세요!`);
        return;
      }
    } else {
      setTimerStarted(true);
    }

    setWords([...words, word]);
    setWord('');
    setTimeLeft(10);
    if (isRotationEnabled) {
      setIsFlipped(!isFlipped);
    }
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  const handleRestart = () => {
    setWords([]);
    setWord('');
    setTimeLeft(10);
    setGameOver(false);
    setTimerStarted(false);
    setIsFlipped(false);
  };

  const getBackgroundColor = () => {
    if (gameOver) {
      return 'white';
    }
    if (timeLeft <= 0) {
      return 'rgba(255, 0, 0, 0.8)';
    } else if (timeLeft <= 1) {
      return 'rgba(255, 0, 0, 0.5)';
    } else if (timeLeft <= 2) {
      return 'rgba(255, 0, 0, 0.3)';
    }
    return 'white';
  };

  const getTimerImage = () => {
    const images = {
      10: require('./assets/timer10.png'),
      9: require('./assets/timer9.png'),
      8: require('./assets/timer8.png'),
      7: require('./assets/timer7.png'),
      6: require('./assets/timer6.png'),
      5: require('./assets/timer5.png'),
      4: require('./assets/timer4.png'),
      3: require('./assets/timer3.png'),
      2: require('./assets/timer2.png'),
      1: require('./assets/timer1.png'),
      0: require('./assets/timer0.png'),
    };
    return images[timeLeft];
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          transform: [
            { rotate: isFlipped && isRotationEnabled ? '180deg' : '0deg' },
          ],
        },
      ]}
    >
      <View style={styles.topEmptySpace}></View>
      {isRotationEnabled && (
        <Text style={styles.turnText}>
          {isFlipped ? '2nd 순서' : '1st 순서'}
        </Text>
      )}
      <Image source={getTimerImage()} style={styles.timerImage} />
      <View style={styles.wordsWrapper}>
        <ScrollView
          style={styles.wordsContainer}
          contentContainerStyle={styles.wordsContent}
          ref={scrollViewRef}
        >
          {words.map((w, index) => (
            <Text key={index} style={styles.word}>
              {w}
            </Text>
          ))}
        </ScrollView>
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, { color: wrongWord ? 'red' : 'black' }]}
          value={word}
          onChangeText={handleInputChange}
          placeholder="단어 입력"
          onSubmitEditing={handleInputSubmit}
          blurOnSubmit={false}
          editable={!gameOver}
        />
        <Button title="입력" onPress={handleInputSubmit} />
        <View style={styles.switchContainer}>
          <Text>2인 게임 모드</Text>
          <Switch
            value={isRotationEnabled}
            onValueChange={setIsRotationEnabled}
          />
        </View>
      </View>
      {gameOver && (
        <View style={styles.gameOverMessage}>
          <Text style={styles.gameOverText}>패배! 시간을 초과했습니다.</Text>
          <Button title="다시 시작" onPress={handleRestart} />
        </View>
      )}
      <View style={styles.footer}>
        <Button title="뒤로가기" onPress={() => navigate('Home')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  topEmptySpace: {
    flex: 1,
  },
  turnText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerImage: {
    width: 87,
    height: 100,
    marginBottom: 20,
  },
  wordsWrapper: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  wordsContainer: {
    width: '80%',
  },
  wordsContent: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  word: {
    fontSize: 20,
    marginVertical: 5,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  gameOverMessage: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  gameOverText: {
    fontSize: 20,
    color: 'red',
    marginBottom: 10,
  },
  footer: {
    flex: 3,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});
