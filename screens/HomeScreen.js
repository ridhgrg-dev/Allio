import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppCard from '../components/AppCard';
import AppHeader from '../components/AppHeader';
import ScreenContainer from '../components/ScreenContainer';

const categories = [
  {
    title: 'Connected Services',
    description: 'Link delivery, Wikipedia, movie/TV, and email accounts in one place.',
    route: 'Connections',
    accent: '#111827',
    meta: 'Account hub',
    label: 'Manage',
  },
  {
    title: 'Delivery Tracking',
    description: 'Track packages now and prepare for carrier account sync.',
    route: 'Delivery',
    accent: '#0f766e',
    meta: '4 carrier options',
  },
  {
    title: 'Wikipedia Search',
    description: 'Search public pages and connect a Wikimedia profile later.',
    route: 'Wikipedia',
    accent: '#3155d4',
    meta: 'Real search',
  },
  {
    title: 'Movie/TV Search',
    description: 'Explore titles and reserve room for watchlist integrations.',
    route: 'Movies',
    accent: '#a855f7',
    meta: 'Media hub',
  },
  {
    title: 'Email (basic)',
    description: 'Compose now, then link Gmail or Outlook when auth is ready.',
    route: 'Email',
    accent: '#ea580c',
    meta: 'Mock send',
  },
  {
    title: 'Coming Soon',
    description: 'A place for future app and service connectors.',
    disabled: true,
    accent: '#94a3b8',
    meta: 'Roadmap',
  },
];

export default function HomeScreen({ navigation }) {
  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <AppHeader subtitle="A single mobile command center for the services you already use, starting with safe prototype links and focused utilities." />
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>4</Text>
            <Text style={styles.summaryLabel}>service areas</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>2</Text>
            <Text style={styles.summaryLabel}>mock links</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>1</Text>
            <Text style={styles.summaryLabel}>live API</Text>
          </View>
        </View>
      </View>
      <View style={styles.grid}>
        {categories.map((category) => (
          <AppCard
            key={category.title}
            title={category.title}
            description={category.description}
            accent={category.accent}
            disabled={category.disabled}
            label={category.label}
            meta={category.meta}
            onPress={category.route ? () => navigation.navigate(category.route) : undefined}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 18,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  summaryItem: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#f7f8fb',
    padding: 12,
    gap: 2,
  },
  summaryValue: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '900',
  },
  summaryLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  grid: {
    gap: 12,
  },
});
