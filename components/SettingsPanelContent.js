import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import InputField from './InputField';
import PrimaryButton from './PrimaryButton';
import MenuRow from './MenuRow';
import { checkBackendHealth, getBackendBaseUrl } from '../services/backendService';
import { getOrCreateAllioUserId, saveBackendUrl } from '../services/storageService';

export default function SettingsPanelContent({ navigation, onClose }) {
  const [backendUrl, setBackendUrl] = useState('');
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('Basic mode');
  const [message, setMessage] = useState('Real account linking needs the Allio backend.');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      const [savedBackendUrl, savedUserId] = await Promise.all([
        getBackendBaseUrl(),
        getOrCreateAllioUserId(),
      ]);

      if (mounted) {
        setBackendUrl(savedBackendUrl || '');
        setUserId(savedUserId);
      }
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSaveBackendUrl() {
    const savedUrl = await saveBackendUrl(backendUrl);
    setBackendUrl(savedUrl);
    setStatus(savedUrl ? 'Backend configured' : 'Basic mode');
    setMessage(savedUrl ? 'Backend URL saved. Test the connection next.' : 'Backend URL cleared. Allio is using prototype mode.');
  }

  async function handleTestBackend() {
    setChecking(true);
    setStatus('Checking');

    try {
      await saveBackendUrl(backendUrl);
      const result = await checkBackendHealth();
      setStatus('Backend connected');
      setMessage(`${result.service || 'Allio backend'} is reachable.`);
    } catch (err) {
      setStatus('Backend unavailable');
      setMessage(err.message);
    } finally {
      setChecking(false);
    }
  }

  function navigate(route) {
    onClose();
    navigation.navigate(route);
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Ionicons name={status === 'Backend connected' ? 'checkmark-circle' : 'information-circle-outline'} size={20} color={status === 'Backend connected' ? '#14754c' : '#3155d4'} />
          <Text style={styles.status}>{status}</Text>
        </View>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.userId}>Local user: {userId || 'Loading...'}</Text>
      </View>

      <InputField
        label="Allio backend URL"
        value={backendUrl}
        onChangeText={setBackendUrl}
        placeholder="http://192.168.1.10:4100"
        autoCapitalize="none"
        autoComplete="off"
        returnKeyType="done"
        onSubmitEditing={handleSaveBackendUrl}
      />

      <View style={styles.actions}>
        <PrimaryButton title="Save Backend URL" onPress={handleSaveBackendUrl} />
        <PrimaryButton title={checking ? 'Testing...' : 'Test Connection'} onPress={handleTestBackend} disabled={checking} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <MenuRow icon="link-outline" title="Linked Accounts" subtitle="Manage carriers, email, media, and knowledge services" onPress={() => navigate('Connections')} />
        <MenuRow icon="cube-outline" title="Delivery Setup" subtitle="Connect carriers and manage tracking history" onPress={() => navigate('Delivery')} />
        <MenuRow icon="mail-outline" title="Email Setup" subtitle="Link inbox providers and extract tracking numbers" onPress={() => navigate('Email')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  statusCard: {
    borderRadius: 18,
    backgroundColor: '#f7f8fb',
    padding: 14,
    gap: 5,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  status: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '900',
  },
  message: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 19,
  },
  userId: {
    color: '#3155d4',
    fontSize: 12,
    fontWeight: '800',
  },
  actions: {
    gap: 10,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900',
  },
});
