import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function EmailMessageCard({ message, onUseTracking }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <Ionicons name="mail-unread-outline" size={20} color="#ea580c" />
        </View>
        <View style={styles.copy}>
          <Text style={styles.from}>{message.from}</Text>
          <Text style={styles.subject}>{message.subject}</Text>
        </View>
      </View>
      <Text style={styles.body}>{message.body}</Text>

      {message.trackingCandidates?.length ? (
        <View style={styles.trackingArea}>
          <Text style={styles.trackingTitle}>Tracking found</Text>
          {message.trackingCandidates.map((candidate) => (
            <Pressable
              key={`${candidate.carrier}-${candidate.trackingNumber}`}
              accessibilityRole="button"
              onPress={() => onUseTracking(candidate)}
              style={styles.trackingChip}
            >
              <Ionicons name="cube-outline" size={15} color="#0f766e" />
              <Text style={styles.trackingText}>{candidate.carrier} · {candidate.trackingNumber}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    padding: 14,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#fff4ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  from: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '800',
  },
  subject: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900',
  },
  body: {
    color: '#4b5563',
    fontSize: 13,
    lineHeight: 19,
  },
  trackingArea: {
    gap: 8,
  },
  trackingTitle: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  trackingChip: {
    minHeight: 36,
    borderRadius: 18,
    backgroundColor: '#e8f8ef',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
  },
  trackingText: {
    color: '#0f766e',
    fontSize: 13,
    fontWeight: '900',
  },
});
