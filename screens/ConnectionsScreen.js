import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppHeader from '../components/AppHeader';
import ScreenContainer from '../components/ScreenContainer';
import ServiceConnectionCard from '../components/ServiceConnectionCard';
import useLinkedAccounts from '../hooks/useLinkedAccounts';
import { connectionGroups } from '../services/connectionService';

export default function ConnectionsScreen() {
  const { linkedAccounts, toggleLinked, linkError } = useLinkedAccounts();

  const connectedCount = useMemo(() => {
    return Object.values(linkedAccounts).filter(Boolean).length;
  }, [linkedAccounts]);

  return (
    <ScreenContainer>
      <AppHeader
        title="Connected Services"
        tagline={`${connectedCount} linked for the prototype`}
        subtitle="Linking is mocked for now. The UI is ready for OAuth, carrier APIs, and provider-specific account setup later."
      />
      {linkError ? <Text style={styles.error}>{linkError}</Text> : null}

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
                  onToggle={() => toggleLinked(provider.id)}
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
});
