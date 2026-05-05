import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { openProviderSignIn } from '../services/accountLinkService';

export default function AccountLinkPanel({ group, linkedAccounts, onToggleLinked, onOpenProvider }) {
  const [error, setError] = useState('');

  async function handleOpen(provider) {
    setError('');

    try {
      const handled = onOpenProvider ? await onOpenProvider(provider) : false;

      if (!handled) {
        await openProviderSignIn(provider);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <View style={[styles.headerIcon, { backgroundColor: `${group.accent}18` }]}>
          <Ionicons name={group.icon} size={22} color={group.accent} />
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{group.title}</Text>
          <Text style={styles.subtitle}>Open real provider sign-in, then mark the account as linked in Allio.</Text>
        </View>
      </View>

      <View style={styles.providers}>
        {group.providers.map((provider) => {
          const linked = Boolean(linkedAccounts[provider.id]);

          return (
            <View key={provider.id} style={styles.providerRow}>
              <View style={styles.providerIdentity}>
                <View style={[styles.providerIcon, linked && styles.providerIconLinked]}>
                  <Ionicons name={provider.icon} size={20} color={linked ? '#14754c' : group.accent} />
                </View>
                <View style={styles.providerCopy}>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  <Text style={styles.providerStatus}>{linked ? 'Linked in Allio' : 'Not linked yet'}</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => handleOpen(provider)}
                  style={({ pressed }) => [styles.openButton, pressed && styles.pressed]}
                >
                  <Ionicons name="open-outline" size={16} color="#111827" />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => onToggleLinked(provider.id)}
                  style={({ pressed }) => [
                    styles.linkButton,
                    linked && styles.linkButtonActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.linkButtonText, linked && styles.linkButtonTextActive]}>
                    {linked ? 'Linked' : 'Link'}
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    padding: 16,
    gap: 14,
    marginBottom: 18,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 18,
  },
  providers: {
    gap: 10,
  },
  providerRow: {
    minHeight: 64,
    borderRadius: 16,
    backgroundColor: '#f7f8fb',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  providerIdentity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  providerIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerIconLinked: {
    backgroundColor: '#e8f8ef',
  },
  providerCopy: {
    flex: 1,
    gap: 2,
  },
  providerName: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
  },
  providerStatus: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  openButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkButton: {
    minWidth: 68,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  linkButtonActive: {
    backgroundColor: '#e8f8ef',
  },
  linkButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  linkButtonTextActive: {
    color: '#14754c',
  },
  pressed: {
    opacity: 0.76,
  },
  error: {
    color: '#b1432d',
    fontSize: 13,
    fontWeight: '700',
  },
});
