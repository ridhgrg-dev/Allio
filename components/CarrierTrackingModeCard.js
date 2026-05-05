import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function CarrierTrackingModeCard({ linkedCarriers, selectedCarrierId, onSelectCarrier }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <Ionicons name="git-network-outline" size={22} color="#0f766e" />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>Track with linked carriers</Text>
          <Text style={styles.subtitle}>
            Choose the carrier account Allio should use for this tracking lookup.
          </Text>
        </View>
      </View>

      {linkedCarriers.length ? (
        <View style={styles.chips}>
          {linkedCarriers.map((carrier) => {
            const selected = carrier.id === selectedCarrierId;

            return (
              <Pressable
                key={carrier.id}
                accessibilityRole="button"
                onPress={() => onSelectCarrier(carrier.id)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Ionicons name={carrier.icon} size={16} color={selected ? '#ffffff' : '#0f766e'} />
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{carrier.name}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Text style={styles.empty}>Connect UPS, FedEx, USPS, or DHL first.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#b7d2c4',
    backgroundColor: '#f7fffb',
    padding: 16,
    gap: 14,
    marginBottom: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#e8f8ef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
  },
  subtitle: {
    color: '#4b625b',
    fontSize: 13,
    lineHeight: 18,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    minHeight: 38,
    borderRadius: 19,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cde5da',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipSelected: {
    backgroundColor: '#0f766e',
    borderColor: '#0f766e',
  },
  chipText: {
    color: '#0f766e',
    fontSize: 13,
    fontWeight: '900',
  },
  chipTextSelected: {
    color: '#ffffff',
  },
  empty: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '700',
  },
});
