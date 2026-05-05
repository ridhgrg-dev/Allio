import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function MenuRow({ icon, title, subtitle, onPress, danger = false }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={[styles.icon, danger && styles.iconDanger]}>
        <Ionicons name={icon} size={20} color={danger ? '#b1432d' : '#3155d4'} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.title, danger && styles.dangerText]}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 66,
    borderRadius: 16,
    backgroundColor: '#f7f8fb',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pressed: {
    opacity: 0.75,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDanger: {
    backgroundColor: '#fff1f0',
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  title: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900',
  },
  dangerText: {
    color: '#b1432d',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '600',
  },
});
