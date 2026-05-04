import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function PrimaryButton({ title, onPress, disabled = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 8,
    backgroundColor: '#236c5e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  pressed: {
    backgroundColor: '#1d5a50',
  },
  disabled: {
    backgroundColor: '#a9b5ae',
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
});
