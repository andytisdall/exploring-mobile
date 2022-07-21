import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import TrackPlayer from 'react-native-track-player';

import Root from './root';
import Header from './components/layout/Header';

const Stack = createNativeStackNavigator();

const initialState = {};

export default function App() {
  useEffect(async () => {
    TrackPlayer.registerPlaybackService(() => require('./service'));
    await TrackPlayer.setupPlayer();
  });

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
