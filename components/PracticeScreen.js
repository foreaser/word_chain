import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  Keyboard,
} from 'react-native';

export default function PracticeScreen({ navigate }) {
  const [word, setWord] = useState('');
  const [words, setWords] = useState([]);
  const scrollViewRef = useRef();

  const handleInputChange = (input) => {
    setWord(input);
  };

  const handleInputSubmit = () => {
    if (words.includes(word)) {
      Alert.alert('이전에 입력된 단어입니다. 다른 단어를 입력하세요!');
      return;
    }

    if (words.length > 0) {
      const lastWord = words[words.length - 1];
      if (lastWord[lastWord.length - 1] !== word[0]) {
        Alert.alert('다른 단어를 입력하세요!');
        return;
      }
    }

    setWords([...words, word]);
    setWord('');

    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topEmptySpace}></View>
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
          style={styles.input}
          value={word}
          onChangeText={handleInputChange}
          placeholder="단어 입력"
          onSubmitEditing={handleInputSubmit}
          blurOnSubmit={false}
        />
        <Button title="입력" onPress={handleInputSubmit} />
      </View>
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
    width: 200, // 고정적인 가로 길이
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  footer: {
    flex: 3,
    justifyContent: 'top',
    alignItems: 'center',
    width: '100%',
  },
});
