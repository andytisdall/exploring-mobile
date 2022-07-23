import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Root from './src/root';
import Header from './src/components/layout/Header';
import setupTrackPlayer from './src/track-player/setup';

const Stack = createNativeStackNavigator();

const initialState = {};

setupTrackPlayer();

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
