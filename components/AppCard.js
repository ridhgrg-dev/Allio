import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function AppCard({ title, description, accent = '#2f7d6d', disabled, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View style={[styles.accent, { backgroundColor: accent }]} />
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Text style={styles.arrow}>{disabled ? 'Soon' : 'Open'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 96,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2d9ca',
    backgroundColor: '#fffaf1',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
    borderColor: '#aac6bd',
  },
  disabled: {
    opacity: 0.62,
  },
  accent: {
    width: 8,
    height: 56,
    borderRadius: 8,
  },
  copy: {
    flex: 1,
    gap: 5,
  },
  title: {
    color: '#18201f',
    fontSize: 18,
    fontWeight: '800',
  },
  description: {
    color: '#665f55',
    fontSize: 14,
    lineHeight: 20,
  },
  arrow: {
    color: '#2f5f57',
    fontSize: 13,
    fontWeight: '700',
  },
});
