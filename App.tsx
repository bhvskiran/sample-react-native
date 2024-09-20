import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';

const App = () => {
  const [recognized, setRecognized] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState([]);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    Tts.getInitStatus()
      .then(() => {
        console.log('TTS initialized successfully');
        handleVoice('Welcome to the app. Click on text to hear or on button to start speaking.');
      })
      .catch(err => {
        console.error('TTS Initialization Error:', err);
        if (err.code === 'no_engine') {
          Tts.requestInstallEngine();
        }
      });

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handleVoice = ttsText => {
    Tts.speak(ttsText, {
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 1, 
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
      },
    });
  };

  const onSpeechStart = e => {
    setStarted('Listening...');
    console.log('onSpeechStart:', e);
  };

  const onSpeechRecognized = e => {
    setRecognized('Speech recognized');
    console.log('onSpeechRecognized:', e);
  };

  const onSpeechResults = e => {
    setResults(e.value); 
    console.log('onSpeechResults:', e);
    stopListening();
    setStarted('');
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      setIsListening(true);
      setStarted('Listening...');
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text} onPress={() => handleVoice('Apple')}>
        Say Apple
      </Text>

      <Button
        title={isListening ? 'Stop Listening' : 'Start Listening'}
        onPress={isListening ? stopListening : startListening}
      />

      <Text style={styles.infoText}>Recognized: {recognized}</Text>
      <Text style={styles.infoText}>Started: {started}</Text>

      {results.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>Results:</Text>
          {results.map((result, index) => (
            <Text key={index} style={styles.resultText}>
              {result}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 24,
    color: 'blue',
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 20,
    width: '60%',
  },
  infoText: {
    marginVertical: 10,
    fontSize: 16,
  },
  resultsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  resultsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 16,
    marginVertical: 5,
  },
});


export default App;