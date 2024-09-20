import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';

const HomeScreen: React.FC = () => {
  const [fullName, setFullName] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);

  useEffect(() => {
    initialSetup();
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const initialSetup = async () => {
    try {
      await Tts.getInitStatus();
      console.log('TTS initialized successfully');
      handleVoice(
        'Welcome to the Krishi Vedika App. Enter your full name, or, Press the button to start speaking your full name to enter automatically.',
      );
    } catch (error: any) {
      console.error('TTS Initialization Error:', error);
      if (error.code === 'no_engine') {
        Tts.requestInstallEngine();
      }
    }

    // Voice.onSpeechStart = onSpeechStart;
    // Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechResults = onSpeechResults;
  };

  const handleVoice = (ttsText: string) => {
    Tts.speak(ttsText, {
      iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
      rate: 0.5,
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 1,
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
      },
    });
  };

  //   const onSpeechStart = (e: any) => {
  //     console.log('Listening.....', e);
  //   };

  //   const onSpeechRecognized = (e: any) => {
  //     console.log('Speach Recognized....', e);
  //   };

  const onSpeechResults = (e: any) => {
    // console.log('onSpeechResults:', e);
    setFullName(e.value[0]);
    stopListening();
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      setIsListening(true);
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
    <SafeAreaView style={styles.mainView}>
      <View style={styles.mainView2}>
        <Text style={styles.labelText}>Full Name</Text>
        <TextInput
          style={styles.inputStyle}
          value={fullName}
          onChangeText={(text: string) => setFullName(text)}
        />
        <TouchableOpacity
          style={styles.speakBtnStyle}
          onPressIn={() => startListening()}
          onPressOut={() => stopListening()}>
          <Text style={styles.speakText}>HOLD & SPEAK</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainView: {flex: 1, backgroundColor: '#FFF'},
  mainView2: {flex: 1, padding: 20, marginVertical: 30},
  labelText: {color: '#333333'},
  inputStyle: {
    width: '100%',
    borderColor: '#DDDDDD',
    borderBottomWidth: 2,
    backgroundColor: '#F7F7F7',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    color: '#333333',
    fontSize: 16,
  },
  speakBtnStyle: {
    backgroundColor: '#F7F7F7',
    borderRadius: 50,
    padding: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderWidth: 5,
    marginVertical: 20,
    borderColor: 'orange',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  speakText: {
    color: '#000',
    fontWeight: '500',
  },
  //
});
