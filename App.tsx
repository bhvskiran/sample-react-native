import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Voice from '@react-native-voice/voice';

const App = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    console.log(Voice);
    if (!Voice) {
      console.error('Voice module is not available.');
      return;
    }

    Voice.onSpeechResults = onSpeechResultsHandler;
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStartHandler = () => {
    setIsListening(true);
  };

  const onSpeechEndHandler = () => {
    setIsListening(false);
  };

  const onSpeechResultsHandler = (event) => {
    const { value } = event;
    if (value && value.length > 0) {
      setRecognizedText(value[0]);
    }
  };

  const startListening = async () => {
    try {
      if (Voice) {
        await Voice.start('en-US');
      } else {
        console.error('Voice is not available');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = async () => {
    try {
      if (Voice) {
        await Voice.stop();
      } else {
        console.error('Voice is not available');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{recognizedText || 'Say something...'}</Text>
      <Button
        title={isListening ? 'Stop Listening' : 'Start Listening'}
        onPress={isListening ? stopListening : startListening}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default App;
