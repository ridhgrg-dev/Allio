import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import AccountLinkPanel from '../components/AccountLinkPanel';
import DeliveryHistoryCard from '../components/DeliveryHistoryCard';
import FeatureHero from '../components/FeatureHero';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import RealDeliveryAccountPanel from '../components/RealDeliveryAccountPanel';
import ResultCard from '../components/ResultCard';
import ScreenContainer from '../components/ScreenContainer';
import useLinkedAccounts from '../hooks/useLinkedAccounts';
import { serviceGroups } from '../services/accountLinkService';
import { syncAfterShipTrackings, trackPackage } from '../services/deliveryService';
import {
  clearDeliveryAccount,
  loadDeliveryAccount,
  loadDeliveryHistory,
  saveDeliveryAccount,
  saveDeliveryHistory,
  toggleShipmentFavorite,
  upsertShipmentHistory,
} from '../services/storageService';

export default function DeliveryScreen() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState('');
  const [accountError, setAccountError] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [history, setHistory] = useState([]);
  const [deliveryAccount, setDeliveryAccount] = useState({
    provider: 'aftership',
    apiKey: '',
    connectedAt: null,
  });
  const { linkedAccounts, toggleLinked, setLinked, linkError } = useLinkedAccounts();

  const favorites = useMemo(() => history.filter((item) => item.favorite), [history]);

  useEffect(() => {
    let mounted = true;

    async function loadSavedDelivery() {
      try {
        const [savedHistory, savedAccount] = await Promise.all([
          loadDeliveryHistory(),
          loadDeliveryAccount(),
        ]);
        if (mounted) {
          setHistory(savedHistory);
          setDeliveryAccount(savedAccount);
        }
      } catch (err) {
        if (mounted) {
          setError('Saved delivery history could not be loaded.');
        }
      }
    }

    loadSavedDelivery();

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

  async function handleSaveDeliveryAccount(apiKey) {
    const trimmedKey = String(apiKey || '').trim();
    setAccountError('');

    if (!trimmedKey) {
      setAccountError('Paste an AfterShip API key to connect real tracking.');
      return;
    }

    const nextAccount = {
      provider: 'aftership',
      apiKey: trimmedKey,
      connectedAt: new Date().toISOString(),
    };

    setDeliveryAccount(nextAccount);

    try {
      await saveDeliveryAccount(nextAccount);
      await setLinked('aftership', true);
    } catch (err) {
      setAccountError('AfterShip account could not be saved.');
    }
  }

  async function handleDisconnectDeliveryAccount() {
    setAccountError('');

    try {
      const cleared = await clearDeliveryAccount();
      setDeliveryAccount(cleared);
      await setLinked('aftership', false);
    } catch (err) {
      setAccountError('AfterShip account could not be disconnected.');
    }
  }

  async function handleSyncRealTrackings() {
    setAccountError('');
    setError('');
    setSyncing(true);

    try {
      const syncedShipments = await syncAfterShipTrackings(deliveryAccount.apiKey);
      const nextHistory = syncedShipments.reduce((currentHistory, syncedShipment) => {
        return upsertShipmentHistory(currentHistory, syncedShipment);
      }, history);

      if (syncedShipments[0]) {
        setShipment(syncedShipments[0]);
        setTrackingNumber(syncedShipments[0].trackingNumber);
      }

      await persistHistory(nextHistory);

      if (!syncedShipments.length) {
        setAccountError('AfterShip connected, but no tracking records were returned yet.');
      }
    } catch (err) {
      setAccountError(err.message);
    } finally {
      setSyncing(false);
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
      {linkError ? <Text style={styles.error}>{linkError}</Text> : null}
      <RealDeliveryAccountPanel
        account={deliveryAccount}
        onSave={handleSaveDeliveryAccount}
        onDisconnect={handleDisconnectDeliveryAccount}
        onSync={handleSyncRealTrackings}
        syncing={syncing}
        error={accountError}
      />
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
