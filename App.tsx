import React from 'react';
import HomeScreen from './src/components/HomeScreen';
import {StatusBar, View} from 'react-native';

const App: React.FC = () => {
  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
      <HomeScreen />
    </View>
  );
};

export default App;
