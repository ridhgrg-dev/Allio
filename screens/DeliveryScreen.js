import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import AccountLinkPanel from '../components/AccountLinkPanel';
import DeliveryHistoryCard from '../components/DeliveryHistoryCard';
import FeatureHero from '../components/FeatureHero';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import ResultCard from '../components/ResultCard';
import ScreenContainer from '../components/ScreenContainer';
import useLinkedAccounts from '../hooks/useLinkedAccounts';
import { serviceGroups } from '../services/accountLinkService';
import { trackPackage } from '../services/deliveryService';
import {
  loadDeliveryHistory,
  saveDeliveryHistory,
  toggleShipmentFavorite,
  upsertShipmentHistory,
} from '../services/storageService';

export default function DeliveryScreen() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const { linkedAccounts, toggleLinked, linkError } = useLinkedAccounts();

  const favorites = useMemo(() => history.filter((item) => item.favorite), [history]);

  useEffect(() => {
    let mounted = true;

    async function loadHistory() {
      try {
        const saved = await loadDeliveryHistory();
        if (mounted) {
          setHistory(saved);
        }
      } catch (err) {
        if (mounted) {
          setError('Saved delivery history could not be loaded.');
        }
      }
    }

    loadHistory();

    return () => {
      mounted = false;
    };
  }, []);

  async function persistHistory(nextHistory) {
    setHistory(nextHistory);

    try {
      await saveDeliveryHistory(nextHistory);
    } catch (err) {
      setError('Delivery history could not be saved.');
    }
  }

  async function handleTrack(nextTrackingNumber = trackingNumber) {
    Keyboard.dismiss();
    setError('');
    setShipment(null);
    setLoading(true);

    try {
      const result = await trackPackage(nextTrackingNumber);
      setShipment(result);
      setTrackingNumber(result.trackingNumber);
      await persistHistory(upsertShipmentHistory(history, result));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleFavorite(trackingNumberToToggle) {
    setError('');
    await persistHistory(toggleShipmentFavorite(history, trackingNumberToToggle));
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
      {linkError ? <Text style={styles.error}>{linkError}</Text> : null}
      <View style={styles.form}>
        <InputField
          label="Tracking number"
          value={trackingNumber}
          onChangeText={setTrackingNumber}
          placeholder="Example: ALLIO123456"
          autoCapitalize="characters"
          autoComplete="off"
          returnKeyType="search"
          onSubmitEditing={() => handleTrack()}
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
          <PrimaryButton
            title={history.find((item) => item.trackingNumber === shipment.trackingNumber)?.favorite ? 'Remove Favorite' : 'Add to Favorites'}
            onPress={() => handleToggleFavorite(shipment.trackingNumber)}
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

      {favorites.length ? (
        <View style={styles.savedSection}>
          <Text style={styles.sectionTitle}>Favorites</Text>
          {favorites.map((item) => (
            <DeliveryHistoryCard
              key={`favorite-${item.trackingNumber}`}
              item={item}
              onTrack={() => handleTrack(item.trackingNumber)}
              onToggleFavorite={() => handleToggleFavorite(item.trackingNumber)}
            />
          ))}
        </View>
      ) : null}

      {history.length ? (
        <View style={styles.savedSection}>
          <Text style={styles.sectionTitle}>History</Text>
          {history.map((item) => (
            <DeliveryHistoryCard
              key={item.trackingNumber}
              item={item}
              onTrack={() => handleTrack(item.trackingNumber)}
              onToggleFavorite={() => handleToggleFavorite(item.trackingNumber)}
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
  savedSection: {
    gap: 10,
    marginTop: 22,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 6,
  },
});
