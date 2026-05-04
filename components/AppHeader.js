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
    color: '#18201f',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 0,
  },
  tagline: {
    color: '#43615c',
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    color: '#6d6960',
    fontSize: 15,
    lineHeight: 22,
  },
});
