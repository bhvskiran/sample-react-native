import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Tts from 'react-native-tts';

const App = () => {
  useEffect(() => {
    Tts.getInitStatus()
      .then(() => {
        console.log('TTS initialized successfully');
        handleVoice('Welcome to the app. Click on text');
      })
      .catch(err => {
        console.error('TTS Initialization Error:', err);
        if (err.code === 'no_engine') {
          Tts.requestInstallEngine();
        }
      });
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

  return (
    <View style={styles.container}>
      <Text style={styles.text} onPress={() => handleVoice('Apple')}>
        Say Apple
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    color: 'blue',
  },
});

export default App;