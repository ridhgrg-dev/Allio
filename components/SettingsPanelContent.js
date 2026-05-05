import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import InputField from './InputField';
import PrimaryButton from './PrimaryButton';
import MenuRow from './MenuRow';
import {
  checkBackendHealth,
  getBackendBaseUrl,
  loadBackendConnections,
  loadBackendProviderStatus,
  startEmailConnection,
} from '../services/backendService';
import { getOrCreateAllioUserId, saveBackendUrl } from '../services/storageService';

export default function SettingsPanelContent({ navigation, onClose }) {
  const [backendUrl, setBackendUrl] = useState('');
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('Basic mode');
  const [message, setMessage] = useState('Real account linking needs the Allio backend.');
  const [checking, setChecking] = useState(false);
  const [gmailStatus, setGmailStatus] = useState('Checking Gmail');
  const [gmailMessage, setGmailMessage] = useState('Checking Gmail connection status...');
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailConfigured, setGmailConfigured] = useState(false);
  const [connectingGmail, setConnectingGmail] = useState(false);

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

      await refreshGmailStatus();
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  async function refreshGmailStatus() {
    try {
      const [providerData, connectionData] = await Promise.all([
        loadBackendProviderStatus(),
        loadBackendConnections(),
      ]);
      const gmail = providerData.emailProviders.find((provider) => provider.id === 'gmail');
      const connected = Boolean(connectionData.connections?.gmail);

      setGmailConnected(connected);
      setGmailConfigured(Boolean(gmail?.configured));

      if (connected) {
        setGmailStatus('Gmail connected');
        setGmailMessage('Allio can scan Gmail shipping emails for tracking numbers.');
        return { configured: Boolean(gmail?.configured), connected };
      }

      if (gmail?.configured) {
        setGmailStatus('Gmail ready');
        setGmailMessage('Tap Connect Gmail to open Google consent and grant read-only mail access.');
        return { configured: true, connected };
      }

      setGmailStatus('Gmail not enabled');
      setGmailMessage('Backend Google OAuth credentials are not configured yet. Once configured, users only sign in with Google.');
      return { configured: false, connected };
    } catch (err) {
      setGmailStatus('Gmail unavailable');
      setGmailMessage(err.message);
      return { configured: false, connected: false };
    }
  }

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
      await refreshGmailStatus();
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

  async function handleConnectGmail() {
    setConnectingGmail(true);

    try {
      const latest = await refreshGmailStatus();

      if (!latest.configured) {
        setGmailStatus('Gmail not enabled');
        setGmailMessage('Allio backend needs Google OAuth credentials before users can open the Google consent screen.');
        return;
      }

      if (latest.connected) {
        setGmailStatus('Gmail connected');
        setGmailMessage('Allio can scan Gmail shipping emails for tracking numbers.');
        return;
      }

      await startEmailConnection('gmail');
      setGmailStatus('Google consent opened');
      setGmailMessage('Finish the Google sign-in flow, return to Allio, then refresh Gmail status.');
    } catch (err) {
      setGmailStatus('Gmail error');
      setGmailMessage(err.message);
    } finally {
      setConnectingGmail(false);
    }
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
        placeholder="http://192.168.8.142:4100"
        autoCapitalize="none"
        autoComplete="off"
        returnKeyType="done"
        onSubmitEditing={handleSaveBackendUrl}
      />

      <View style={styles.actions}>
        <PrimaryButton title="Save Backend URL" onPress={handleSaveBackendUrl} />
        <PrimaryButton title={checking ? 'Testing...' : 'Test Connection'} onPress={handleTestBackend} disabled={checking} />
      </View>

      <View style={styles.gmailCard}>
        <View style={styles.statusHeader}>
          <Ionicons name={gmailConnected ? 'mail' : 'logo-google'} size={20} color={gmailConnected ? '#14754c' : '#3155d4'} />
          <Text style={styles.status}>{gmailStatus}</Text>
        </View>
        <Text style={styles.message}>{gmailMessage}</Text>
        <View style={styles.actions}>
          <PrimaryButton title={connectingGmail ? 'Opening Google...' : 'Connect Gmail'} onPress={handleConnectGmail} disabled={connectingGmail || gmailConnected} />
          <PrimaryButton title="Refresh Gmail Status" onPress={refreshGmailStatus} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Setup</Text>
        <MenuRow icon="link-outline" title="Linked Accounts" subtitle="Connect or disconnect providers in one place" onPress={() => navigate('Connections')} />
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
  gmailCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dbe2f0',
    backgroundColor: '#ffffff',
    padding: 14,
    gap: 10,
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
