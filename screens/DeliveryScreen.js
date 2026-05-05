import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AccountLinkPanel from '../components/AccountLinkPanel';
import FeatureHero from '../components/FeatureHero';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import ResultCard from '../components/ResultCard';
import ScreenContainer from '../components/ScreenContainer';
import { initialLinkedAccounts, serviceGroups } from '../services/accountLinkService';
import { trackPackage } from '../services/deliveryService';

export default function DeliveryScreen() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState(initialLinkedAccounts);

  function toggleLinked(providerId) {
    setLinkedAccounts((current) => ({
      ...current,
      [providerId]: !current[providerId],
    }));
  }

  async function handleTrack() {
    setError('');
    setShipment(null);
    setLoading(true);

    try {
      const result = await trackPackage(trackingNumber);
      setShipment(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <FeatureHero
        icon="cube-outline"
        accent="#0f766e"
        title="Track Every Delivery"
        description="Link carrier accounts for a future unified package inbox, or enter a tracking number manually today."
        stat="4"
        statLabel="carrier links"
      />
      <AccountLinkPanel
        group={serviceGroups.delivery}
        linkedAccounts={linkedAccounts}
        onToggleLinked={toggleLinked}
      />
      <View style={styles.form}>
        <InputField
          label="Tracking number"
          value={trackingNumber}
          onChangeText={setTrackingNumber}
          placeholder="Example: ALLIO123456"
          autoCapitalize="characters"
        />
        <PrimaryButton title="Track Package" onPress={handleTrack} disabled={loading} />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {shipment ? (
        <View style={styles.results}>
          <ResultCard
            eyebrow={shipment.carrier}
            title={shipment.status}
            description={`Tracking ${shipment.trackingNumber}`}
            footer={`Estimated delivery: ${shipment.estimatedDelivery}`}
          />
          <Text style={styles.sectionTitle}>Updates</Text>
          {shipment.updates.map((update) => (
            <ResultCard
              key={`${update.time}-${update.location}`}
              eyebrow={update.time}
              title={update.location}
              description={update.detail}
            />
          ))}
        </View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 14,
    marginBottom: 18,
  },
  error: {
    color: '#b1432d',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 16,
  },
  results: {
    gap: 12,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 6,
  },
});
