import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AppHeader({ title = 'Allio', tagline = 'Everything. One place.', subtitle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.tagline}>{tagline}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginBottom: 22,
  },
  title: {
    color: '#111827',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 0,
  },
  tagline: {
    color: '#3155d4',
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 15,
    lineHeight: 22,
  },
});
