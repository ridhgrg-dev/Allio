import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function AppCard({
  title,
  description,
  accent = '#3155d4',
  disabled,
  onPress,
  label = 'Open',
  meta,
  icon,
}) {
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
      <View style={[styles.accent, { backgroundColor: accent }]}>
        {icon ? (
          <Ionicons name={icon} size={24} color="#ffffff" />
        ) : (
          <Text style={styles.accentText}>{title.slice(0, 1)}</Text>
        )}
      </View>
      <View style={styles.copy}>
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.arrowWrap}>
        <Text style={styles.arrow}>{disabled ? 'Soon' : label}</Text>
        {!disabled ? <Ionicons name="chevron-forward" size={16} color="#111827" /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 112,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
    borderColor: '#bfcbff',
  },
  disabled: {
    opacity: 0.62,
  },
  accent: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accentText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  copy: {
    flex: 1,
    gap: 5,
  },
  meta: {
    color: '#3155d4',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
  },
  description: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
  },
  arrow: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '900',
  },
  arrowWrap: {
    alignItems: 'center',
    gap: 4,
  },
});
