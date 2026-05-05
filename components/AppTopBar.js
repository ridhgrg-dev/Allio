import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function AppTopBar({ onOpenMenu, onOpenSettings }) {
  return (
    <View style={styles.bar}>
      <Pressable accessibilityRole="button" onPress={onOpenMenu} style={styles.iconButton}>
        <Ionicons name="menu" size={24} color="#111827" />
      </Pressable>
      <Text style={styles.brand}>Allio</Text>
      <Pressable accessibilityRole="button" onPress={onOpenSettings} style={styles.iconButton}>
        <Ionicons name="settings-outline" size={22} color="#111827" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  brand: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
