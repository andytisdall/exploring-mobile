import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
// import TrackPlayer from 'react-native-track-player';

import Root from './root';
import Header from './components/layout/Header';

const Stack = createNativeStackNavigator();

const initialState = {};

// TrackPlayer.registerPlaybackService(() => require('./service'));
// await TrackPlayer.setupPlayer();

export default function App() {
  return (
    <Root initialState={initialState}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Band" component={Header} />
        </Stack.Navigator>
      </NavigationContainer>
    </Root>
  );
}
