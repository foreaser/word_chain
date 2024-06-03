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
} from 'react-native';

const API_KEY = '29BD89531F1E0A8F186082E4D609E572';
const SEARCH_URL = 'https://opendict.korean.go.kr/api/search';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!url) return;
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

const WordExistCheck = (word) =>
  `${SEARCH_URL}?key=${API_KEY}&req_type=json&q=${word}&advanced=y&method=exact`;

const GetWordDefinition = (lastChar) =>
  `${SEARCH_URL}?key=${API_KEY}&req_type=json&q=${lastChar}&advanced=y&sort=popular&type1=word&method=start&num=10&pos=1&type2=native,chinese&type3=general&type4=general`;

export default function GameScreen({ navigate }) {
  const [word, setWord] = useState('');
  const [computerWordInfo, setComputerWordInfo] = useState(null);
  const [words, setWords] = useState([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [wrongWord, setWrongWord] = useState(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const [wordUrl, setWordUrl] = useState(null);
  const [nextWordUrl, setNextWordUrl] = useState(null);
  const scrollViewRef = useRef();
  const timerRef = useRef(null);
  const [GameResult, setGameResult] = useState(0); // 0: 초기값, 1: 승리, 2: 패배

  const {
    data: wordData,
    loading: wordLoading,
    error: wordError,
  } = useFetch(wordUrl);
  const {
    data: nextWordsData,
    loading: nextWordsLoading,
    error: nextWordsError,
  } = useFetch(nextWordUrl);

  useEffect(() => {
    if (timerStarted && timeLeft > 0 && !gameOver) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
      setGameResult(2);
      alert('패배! 시간을 초과했습니다.');
    }

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gameOver, timerStarted]);

  useEffect(() => {
    if (wordData && !wordLoading && !wordError) {
      const wordDetails = wordData.channel?.item || [];
      if (wordDetails.length > 0) {
        const newWord = wordDetails[0].word;

        if (words.some((w) => w.word === newWord)) {
          setWrongWord(newWord);
          alert('이전에 입력된 단어입니다. 다른 단어를 입력하세요!');
          return;
        }

        if (words.length > 0) {
          const lastWord = words[words.length - 1].word;
          if (lastWord[lastWord.length - 1] !== newWord[0]) {
            setWrongWord(newWord);
            alert('올바른 단어를 입력하세요!');
            return;
          }
        }

        setWords((prevWords) => [
          ...prevWords,
          { word: newWord, definition: null },
        ]);
        setWord('');
        setWrongWord(null);

        const lastChar = newWord[newWord.length - 1];
        setNextWordUrl(GetWordDefinition(lastChar));
      } else {
        setWrongWord(word);
        alert('없는 단어입니다. 다시 입력하세요!');
      }
    }
  }, [wordData, wordLoading, wordError]);

  useEffect(() => {
    if (nextWordsData && !nextWordsLoading && !nextWordsError) {
      const items = nextWordsData.channel?.item || [];
      const validItems = items.filter((item) => item.word.length > 1);
      if (validItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * validItems.length);
        const randomItem = validItems[randomIndex];
        const nextWord = randomItem.word;
        const nextDefinition = randomItem.sense[0].definition;
        setWords((prevWords) => [
          ...prevWords,
          { word: nextWord, definition: nextDefinition },
        ]);
        setComputerWordInfo({ word: nextWord, definition: nextDefinition });
        setTimeLeft(10);
        setTimeout(() => {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }, 100);
      } else {
        setGameOver(true);
        setGameResult(1); // 승리
        alert('다음 단어를 찾을 수 없습니다. 당신이 승리했습니다!');
        console.log('끝');
      }
    }
  }, [nextWordsData, nextWordsLoading, nextWordsError]);

  useEffect(() => {
    if (gameOver) {
      clearTimeout(timerRef.current);
    }
  }, [gameOver]);

  const handleInputChange = (input) => {
    setWord(input);
    setWrongWord(null);
  };

  const handleInputSubmit = () => {
    if (gameOver) {
      alert('게임이 종료되었습니다. 다시 시작하세요!');
      return;
    }
    setWordUrl(WordExistCheck(word));
    setTimerStarted(true);
  };

  const handleRestart = () => {
    setWords([]);
    setWord('');
    setTimeLeft(10);
    setGameOver(false);
    setTimerStarted(false);
    setComputerWordInfo(null);
    setWordUrl(null);
    setNextWordUrl(null);
    setGameResult(0);
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
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <View style={styles.topEmptySpace}></View>
      <Image source={getTimerImage()} style={styles.timerImage} />
      <Text style={styles.timerText}>Time Left: {timeLeft} seconds</Text>
      <View style={styles.wordsWrapper}>
        <ScrollView
          style={[styles.wordsContainer, { height: 200 }]}
          contentContainerStyle={styles.wordsContent}
          ref={scrollViewRef}
        >
          {words.map((w, index) => (
            <Text key={index} style={styles.word}>
              <Text style={styles.bold}>{w.word}</Text>
            </Text>
          ))}
        </ScrollView>
      </View>
      <View style={styles.inputWrapper}>
        {computerWordInfo && (
          <Text style={styles.computerWordText}>
            <Text style={styles.bold}>{computerWordInfo.word} : </Text>{' '}
            {computerWordInfo.definition}
          </Text>
        )}
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
      </View>
      {GameResult === 2 && (
        <View style={styles.gameOverMessage}>
          <Text style={[styles.gameOverText, { color: 'red' }]}>
            패배! 시간을 초과했습니다.
          </Text>
          <Button title="다시 시작" onPress={handleRestart} />
        </View>
      )}
      {GameResult === 1 && (
        <View style={styles.gameOverMessage}>
          <Text style={[styles.gameOverText, { color: 'green' }]}>
            승리! 당신이 이겼습니다.
          </Text>
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
  timerImage: {
    width: 87,
    height: 100,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 30,
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
    height: 50,
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
  bold: {
    fontWeight: 'bold',
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  computerWordText: {
    fontSize: 18,
    marginBottom: 10,
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
    marginBottom: 10,
  },
  footer: {
    flex: 3,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
});
