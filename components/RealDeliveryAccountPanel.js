import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import InputField from './InputField';
import PrimaryButton from './PrimaryButton';

export default function RealDeliveryAccountPanel({
  account,
  onSave,
  onDisconnect,
  onSync,
  syncing,
  error,
}) {
  const [apiKey, setApiKey] = useState(account.apiKey || '');
  const connected = Boolean(account.apiKey);

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons name="shield-checkmark-outline" size={22} color="#0f766e" />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>Real delivery account</Text>
          <Text style={styles.subtitle}>
            Connect AfterShip with your API key to sync real tracking records into Allio.
          </Text>
        </View>
      </View>

      <InputField
        label="AfterShip API key"
        value={apiKey}
        onChangeText={setApiKey}
        placeholder="Paste your AfterShip API key"
        autoCapitalize="none"
        autoComplete="off"
        returnKeyType="done"
        secureTextEntry
      />

      <Text style={styles.note}>
        Prototype note: this stores the key locally on this device. A production release should move API keys to a backend.
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.actions}>
        <PrimaryButton title={connected ? 'Update Key' : 'Connect AfterShip'} onPress={() => onSave(apiKey)} />
        {connected ? (
          <>
            <PrimaryButton title={syncing ? 'Syncing...' : 'Sync Real Trackings'} onPress={onSync} disabled={syncing} />
            <Pressable accessibilityRole="button" onPress={onDisconnect} style={styles.disconnect}>
              <Ionicons name="unlink-outline" size={16} color="#b1432d" />
              <Text style={styles.disconnectText}>Disconnect</Text>
            </Pressable>
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
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
  iconWrap: {
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
  note: {
    color: '#6b7280',
    fontSize: 12,
    lineHeight: 17,
  },
  error: {
    color: '#b1432d',
    fontSize: 13,
    fontWeight: '700',
  },
  actions: {
    gap: 10,
  },
  disconnect: {
    minHeight: 42,
    borderRadius: 21,
    backgroundColor: '#fff1f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disconnectText: {
    color: '#b1432d',
    fontSize: 14,
    fontWeight: '900',
  },
});
