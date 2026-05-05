import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import ServiceConnectionCard from '../components/ServiceConnectionCard';
import useLinkedAccounts from '../hooks/useLinkedAccounts';
import {
  disconnectBackendConnection,
  loadBackendConnections,
  loadBackendProviderStatus,
  startEmailConnection,
} from '../services/backendService';
import { connectionGroups } from '../services/connectionService';

export default function ConnectionsScreen() {
  const { linkedAccounts, setLinked, mergeLinked, linkError } = useLinkedAccounts();
  const [backendMessage, setBackendMessage] = useState('Checking backend account linking...');
  const [backendError, setBackendError] = useState('');
  const [providerStatus, setProviderStatus] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const connectedCount = useMemo(() => {
    return Object.values(linkedAccounts).filter(Boolean).length;
  }, [linkedAccounts]);

  async function refreshBackendState() {
    setRefreshing(true);
    setBackendError('');

    try {
      const [statusData, connectionData] = await Promise.all([
        loadBackendProviderStatus(),
        loadBackendConnections(),
      ]);
      const nextProviderStatus = {};

      for (const carrier of statusData.carriers) {
        nextProviderStatus[carrier.id] = {
          configured: carrier.configured,
          mode: carrier.mode,
          kind: 'carrier',
        };
      }

      for (const emailProvider of statusData.emailProviders) {
        nextProviderStatus[emailProvider.id] = {
          configured: emailProvider.configured,
          mode: emailProvider.mode,
          kind: 'email',
        };
      }

      const nextLinkedAccounts = {};
      Object.keys(connectionData.connections || {}).forEach((providerId) => {
        nextLinkedAccounts[providerId] = true;
      });
      Object.keys(nextProviderStatus).forEach((providerId) => {
        nextLinkedAccounts[providerId] = Boolean(connectionData.connections?.[providerId]);
      });

      setProviderStatus(nextProviderStatus);
      await mergeLinked(nextLinkedAccounts);
      setBackendMessage('Backend is connected. Available providers can be linked with the provider sign-in page.');
    } catch (err) {
      setBackendError(err.message);
      setBackendMessage('Backend account linking is unavailable. Check Settings and make sure the backend server is running.');
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    refreshBackendState();
  }, []);

  async function handleProviderAction(group, provider) {
    setBackendError('');

    try {
      const supportsBackend = provider.id === 'gmail';
      const status = providerStatus[provider.id];

      if (!supportsBackend) {
        setBackendMessage(`${provider.name} is on the roadmap. Gmail is the first production account connection.`);
        return;
      }

      if (linkedAccounts[provider.id]) {
        await disconnectBackendConnection(provider.id);
        await setLinked(provider.id, false);
        setBackendMessage(`${provider.name} disconnected from Allio.`);
        return;
      }

      if (!status?.configured) {
        setBackendMessage(`${provider.name} is not available yet. In production, Allio will enable this after backend provider approval and OAuth credentials are deployed. Users will only tap Connect and sign in.`);
        return;
      }

      const opened = await startEmailConnection(provider.id);

      if (opened) {
        setBackendMessage(`${provider.name} connection opened. Finish the browser step, return to Allio, then tap Refresh Linked Accounts.`);
      }
    } catch (err) {
      setBackendError(err.message);
    }
  }

  function getHelperText(group, provider) {
    const status = providerStatus[provider.id];

    if (linkedAccounts[provider.id]) {
      return 'Saved through Allio backend for this local user.';
    }

    if (group.id === 'delivery') {
      return 'Coming soon. Gmail tracking extraction is the first production account link.';
    }

    if (group.id === 'email' && ['gmail', 'outlook'].includes(provider.id)) {
      if (provider.id !== 'gmail') {
        return 'Coming soon after Gmail account linking is stable.';
      }

      return status?.configured
        ? 'Available. Sign in with Google to let Allio read shipping emails.'
        : 'Gmail OAuth is not configured on the backend yet.';
    }

    return 'Coming soon after Gmail account linking is stable.';
  }

  return (
    <ScreenContainer>
      <AppHeader
        title="Account Setup"
        tagline={`${connectedCount} linked to Allio`}
        subtitle="Connect Gmail first so Allio can read shipping emails and extract tracking numbers. More providers stay on the roadmap."
      />
      {linkError ? <Text style={styles.error}>{linkError}</Text> : null}
      <View style={styles.backendCard}>
        <Text style={styles.backendTitle}>Backend Account Linking</Text>
        <Text style={styles.backendMessage}>{backendMessage}</Text>
        {backendError ? <Text style={styles.error}>{backendError}</Text> : null}
        <PrimaryButton title={refreshing ? 'Refreshing...' : 'Refresh Linked Accounts'} onPress={refreshBackendState} disabled={refreshing} />
      </View>

      <View style={styles.stack}>
        {connectionGroups.map((group) => (
          <View key={group.id} style={styles.group}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              <Text style={styles.groupDescription}>{group.description}</Text>
            </View>
            <View style={styles.providers}>
              {group.providers.map((provider) => (
                <ServiceConnectionCard
                  key={provider.id}
                  name={provider.name}
                  status={provider.status}
                  connected={Boolean(linkedAccounts[provider.id])}
                  provider={provider}
                  actionLabel={provider.id === 'gmail' ? 'Connect' : 'Soon'}
                  helperText={getHelperText(group, provider)}
                  onOpen={() => handleProviderAction(group, provider)}
                  onToggle={() => handleProviderAction(group, provider)}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 22,
  },
  group: {
    gap: 12,
  },
  groupHeader: {
    gap: 5,
  },
  groupTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '900',
  },
  groupDescription: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
  },
  providers: {
    gap: 10,
  },
  error: {
    color: '#b1432d',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  backendCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dbe2f0',
    backgroundColor: '#ffffff',
    padding: 14,
    gap: 10,
    marginBottom: 20,
  },
  backendTitle: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '900',
  },
  backendMessage: {
    color: '#5f6b7a',
    fontSize: 13,
    lineHeight: 19,
  },
});
