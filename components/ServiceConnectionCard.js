import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { openProviderSignIn } from '../services/accountLinkService';

export default function ServiceConnectionCard({ name, status, connected, onToggle, provider }) {
  const isPlanned = status === 'planned';

  async function handleOpen() {
    try {
      if (provider?.url) {
        await openProviderSignIn(provider);
      }
    } catch (err) {
      // External provider links can fail if the device blocks the URL.
    }
  }

  return (
    <View style={styles.card}>
      <View style={[styles.logo, connected && styles.logoConnected]}>
        {provider?.icon ? (
          <Ionicons name={provider.icon} size={20} color={connected ? '#14754c' : '#3155d4'} />
        ) : (
          <Text style={[styles.logoText, connected && styles.logoTextConnected]}>{name.slice(0, 1)}</Text>
        )}
      </View>
      <View style={styles.copy}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.status}>{connected ? 'Connected' : isPlanned ? 'Roadmap' : 'Ready to link'}</Text>
      </View>
      <View style={styles.actions}>
        {provider?.url ? (
          <Pressable accessibilityRole="button" onPress={handleOpen} style={styles.iconButton}>
            <Ionicons name="open-outline" size={16} color="#111827" />
          </Pressable>
        ) : null}
        <Pressable
          accessibilityRole="button"
          disabled={isPlanned}
          onPress={onToggle}
          style={({ pressed }) => [
            styles.button,
            connected && styles.buttonConnected,
            isPlanned && styles.buttonDisabled,
            pressed && !isPlanned && styles.buttonPressed,
          ]}
        >
          <Text style={[styles.buttonText, connected && styles.buttonTextConnected]}>
            {connected ? 'Linked' : isPlanned ? 'Soon' : 'Link'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 72,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoConnected: {
    backgroundColor: '#dff7eb',
  },
  logoText: {
    color: '#3155d4',
    fontSize: 17,
    fontWeight: '900',
  },
  logoTextConnected: {
    color: '#14754c',
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  name: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },
  status: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    minWidth: 68,
    minHeight: 36,
    borderRadius: 18,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  buttonConnected: {
    backgroundColor: '#e8f8ef',
  },
  buttonDisabled: {
    backgroundColor: '#f3f4f6',
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  buttonTextConnected: {
    color: '#14754c',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
