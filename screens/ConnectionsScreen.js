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
  startCarrierConnection,
  startEmailConnection,
} from '../services/backendService';
import { connectionGroups } from '../services/connectionService';

export default function ConnectionsScreen() {
  const { linkedAccounts, toggleLinked, setLinked, mergeLinked, linkError } = useLinkedAccounts();
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
          kind: 'carrier',
        };
      }

      for (const emailProvider of statusData.emailProviders) {
        nextProviderStatus[emailProvider.id] = {
          configured: emailProvider.configured,
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
      setBackendMessage('Backend is connected. UPS, FedEx, USPS, DHL, Gmail, and Outlook can use backend linking.');
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
      const supportsBackend = group.id === 'delivery' || (group.id === 'email' && ['gmail', 'outlook'].includes(provider.id));

      if (!supportsBackend) {
        await toggleLinked(provider.id);
        return;
      }

      if (linkedAccounts[provider.id]) {
        await disconnectBackendConnection(provider.id);
        await setLinked(provider.id, false);
        setBackendMessage(`${provider.name} disconnected from Allio.`);
        return;
      }

      const opened = group.id === 'delivery'
        ? await startCarrierConnection(provider.id)
        : await startEmailConnection(provider.id);

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
      return status?.configured
        ? 'Real OAuth credentials are configured on the backend.'
        : 'Backend is ready; carrier developer credentials are not configured yet, so this uses dev linking.';
    }

    if (group.id === 'email' && ['gmail', 'outlook'].includes(provider.id)) {
      return status?.configured
        ? 'Real OAuth credentials are configured on the backend.'
        : 'Backend is ready; email app credentials are not configured yet, so this uses dev linking.';
    }

    return 'Prototype link state only until this provider gets backend support.';
  }

  return (
    <ScreenContainer>
      <AppHeader
        title="Connected Services"
        tagline={`${connectedCount} linked to Allio`}
        subtitle="Connect carrier and email accounts through the Allio backend. Other services stay as prototype links for now."
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
                  actionLabel={group.id === 'delivery' || (group.id === 'email' && ['gmail', 'outlook'].includes(provider.id)) ? 'Connect' : 'Link'}
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
