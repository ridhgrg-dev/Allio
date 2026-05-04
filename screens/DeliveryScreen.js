import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import ResultCard from '../components/ResultCard';
import ScreenContainer from '../components/ScreenContainer';
import { trackPackage } from '../services/deliveryService';

export default function DeliveryScreen() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    color: '#18201f',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 6,
  },
});
