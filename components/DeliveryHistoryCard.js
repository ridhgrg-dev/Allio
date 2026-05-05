import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function DeliveryHistoryCard({ item, onTrack, onToggleFavorite }) {
  return (
    <View style={styles.card}>
      <Pressable accessibilityRole="button" onPress={onToggleFavorite} style={styles.favorite}>
        <Ionicons
          name={item.favorite ? 'star' : 'star-outline'}
          size={22}
          color={item.favorite ? '#f59e0b' : '#6b7280'}
        />
      </Pressable>
      <Pressable accessibilityRole="button" onPress={onTrack} style={styles.copy}>
        <Text style={styles.tracking}>{item.trackingNumber}</Text>
        <Text style={styles.detail}>{item.carrier} · {item.status}</Text>
        <Text style={styles.detail}>ETA {item.estimatedDelivery}</Text>
      </Pressable>
      <Ionicons name="chevron-forward" size={18} color="#6b7280" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 76,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  favorite: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: '#f7f8fb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  tracking: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900',
  },
  detail: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '600',
  },
});
