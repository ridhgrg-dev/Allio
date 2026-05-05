import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DeliveryScreen from '../screens/DeliveryScreen';
import WikipediaScreen from '../screens/WikipediaScreen';
import MovieScreen from '../screens/MovieScreen';
import EmailScreen from '../screens/EmailScreen';
import ConnectionsScreen from '../screens/ConnectionsScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: '#f7f8fb',
  },
  headerShadowVisible: false,
  headerTitleStyle: {
    color: '#111827',
    fontWeight: '700',
  },
  headerTintColor: '#111827',
  contentStyle: {
    backgroundColor: '#f7f8fb',
  },
};

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Delivery" component={DeliveryScreen} options={{ title: 'Delivery Tracking' }} />
      <Stack.Screen name="Wikipedia" component={WikipediaScreen} options={{ title: 'Wikipedia Search' }} />
      <Stack.Screen name="Movies" component={MovieScreen} options={{ title: 'Movie/TV Search' }} />
      <Stack.Screen name="Email" component={EmailScreen} options={{ title: 'Email' }} />
      <Stack.Screen name="Connections" component={ConnectionsScreen} options={{ title: 'Connected Services' }} />
    </Stack.Navigator>
  );
}
