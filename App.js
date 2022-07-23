import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Root from './root';
import Header from './components/layout/Header';
import setupTrackPlayer from './track-player/setup';

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
