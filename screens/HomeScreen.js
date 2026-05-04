import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppCard from '../components/AppCard';
import AppHeader from '../components/AppHeader';
import ScreenContainer from '../components/ScreenContainer';

const categories = [
  {
    title: 'Delivery Tracking',
    description: 'Check package progress with a mock carrier feed.',
    route: 'Delivery',
    accent: '#236c5e',
  },
  {
    title: 'Wikipedia Search',
    description: 'Look up encyclopedia summaries from one hub.',
    route: 'Wikipedia',
    accent: '#4e6896',
  },
  {
    title: 'Movie/TV Search',
    description: 'Search a starter catalog for films and series.',
    route: 'Movies',
    accent: '#9a5a35',
  },
  {
    title: 'Email (basic)',
    description: 'Compose a simple mock email confirmation.',
    route: 'Email',
    accent: '#7a5b8a',
  },
  {
    title: 'Coming Soon',
    description: 'A place for future app and service connectors.',
    disabled: true,
    accent: '#8a8f88',
  },
];

export default function HomeScreen({ navigation }) {
  return (
    <ScreenContainer>
      <AppHeader subtitle="Start with focused utilities, then expand into connected services when each integration earns its place." />
      <View style={styles.grid}>
        {categories.map((category) => (
          <AppCard
            key={category.title}
            title={category.title}
            description={category.description}
            accent={category.accent}
            disabled={category.disabled}
            onPress={category.route ? () => navigation.navigate(category.route) : undefined}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 12,
  },
});
