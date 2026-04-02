import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './Navigation/AppNavigation';

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigation />
    </NavigationContainer>
  );
}