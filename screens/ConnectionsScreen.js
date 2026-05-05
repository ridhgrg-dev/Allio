import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppHeader from '../components/AppHeader';
import ScreenContainer from '../components/ScreenContainer';
import ServiceConnectionCard from '../components/ServiceConnectionCard';
import { connectionGroups, createInitialConnections } from '../services/connectionService';

export default function ConnectionsScreen() {
  const [connections, setConnections] = useState(createInitialConnections);

  const connectedCount = useMemo(() => {
    return Object.values(connections).filter(Boolean).length;
  }, [connections]);

  function toggleConnection(providerId) {
    setConnections((current) => ({
      ...current,
      [providerId]: !current[providerId],
    }));
  }

  return (
    <ScreenContainer>
      <AppHeader
        title="Connected Services"
        tagline={`${connectedCount} linked for the prototype`}
        subtitle="Linking is mocked for now. The UI is ready for OAuth, carrier APIs, and provider-specific account setup later."
      />

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
                  connected={Boolean(connections[provider.id])}
                  provider={provider}
                  onToggle={() => toggleConnection(provider.id)}
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
});
