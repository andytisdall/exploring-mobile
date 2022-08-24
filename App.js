import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Root from './src/root';
import Main from './src/components/layout/Main';
import Home from './src/components/pages/Home';
import baseStyle from './src/style/baseStyle';
import Help from './src/components/pages/Help';

const Stack = createNativeStackNavigator();

const initialState = {};

export default function App() {
  return (
    <Root initialState={initialState}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Band"
            component={Main}
            options={({ route }) => ({
              title: route.params.band.name,
              headerStyle: [baseStyle.background, baseStyle.header],
              headerTintColor: '#65d478',
              headerTitleStyle: {
                fontSize: 25,
              },
              headerBackTitleVisible: false,
            })}
          />
          <Stack.Screen
            name="Help"
            component={Help}
            options={() => ({
              title: 'Help',
              headerStyle: [baseStyle.background, baseStyle.header],
              headerTintColor: '#65d478',
              headerTitleStyle: {
                fontSize: 25,
              },
              headerBackTitleVisible: false,
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Root>
  );
}
