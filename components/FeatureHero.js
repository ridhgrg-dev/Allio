import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function FeatureHero({ icon, accent, title, description, stat, statLabel }) {
  return (
    <View style={styles.hero}>
      <View style={[styles.iconWrap, { backgroundColor: `${accent}18` }]}>
        <Ionicons name={icon} size={28} color={accent} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {stat ? (
        <View style={styles.stat}>
          <Text style={styles.statValue}>{stat}</Text>
          <Text style={styles.statLabel}>{statLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    gap: 6,
  },
  title: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '900',
  },
  description: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 21,
  },
  stat: {
    borderRadius: 16,
    backgroundColor: '#f7f8fb',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statValue: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
