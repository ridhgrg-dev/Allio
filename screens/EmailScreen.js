import React, { useRef, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import EmailMessageCard from '../components/EmailMessageCard';
import FeatureHero from '../components/FeatureHero';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { loadBackendEmailInbox } from '../services/backendService';
import { trackPackage } from '../services/deliveryService';
import { sendMockEmail } from '../services/emailService';
import { loadDeliveryHistory, saveDeliveryHistory, upsertShipmentHistory } from '../services/storageService';

export default function EmailScreen() {
  const subjectRef = useRef(null);
  const bodyRef = useRef(null);
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncingInbox, setSyncingInbox] = useState(false);
  const [messages, setMessages] = useState([]);

  async function handleSend() {
    Keyboard.dismiss();
    setError('');
    setConfirmation('');
    setLoading(true);

    try {
      const result = await sendMockEmail({ recipient, subject, body });
      setConfirmation(result.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSyncInbox() {
    Keyboard.dismiss();
    setError('');
    setConfirmation('');
    setSyncingInbox(true);

    try {
      const nextMessages = await loadBackendEmailInbox();
      setMessages(nextMessages);
      setConfirmation(`Checked ${nextMessages.length} email messages.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSyncingInbox(false);
    }
  }

  async function handleUseTracking(candidate) {
    setError('');
    setConfirmation('');

    try {
      const shipment = await trackPackage(candidate.trackingNumber, {
        preferredCarrier: candidate.carrier,
      });
      const history = await loadDeliveryHistory();
      await saveDeliveryHistory(upsertShipmentHistory(history, shipment));
      setConfirmation(`${candidate.trackingNumber} saved to Delivery history.`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <ScreenContainer>
      <FeatureHero
        icon="mail-outline"
        accent="#ea580c"
        title="Email Composer"
        description="Check linked Gmail for shipping emails, extract tracking numbers, and save them to Delivery."
        stat="Gmail"
        statLabel="tracking scan"
      />
      <View style={styles.inboxActions}>
        <PrimaryButton title={syncingInbox ? 'Checking Inbox...' : 'Check Linked Email'} onPress={handleSyncInbox} disabled={syncingInbox} />
      </View>

      {messages.length ? (
        <View style={styles.inbox}>
          <Text style={styles.sectionTitle}>Inbox Signals</Text>
          {messages.map((message) => (
            <EmailMessageCard key={message.id} message={message} onUseTracking={handleUseTracking} />
          ))}
        </View>
      ) : null}

      <View style={styles.form}>
        <InputField
          label="Recipient"
          value={recipient}
          onChangeText={setRecipient}
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          returnKeyType="next"
          onSubmitEditing={() => subjectRef.current?.focus()}
        />
        <InputField
          inputRef={subjectRef}
          label="Subject"
          value={subject}
          onChangeText={setSubject}
          placeholder="What is this about?"
          returnKeyType="next"
          onSubmitEditing={() => bodyRef.current?.focus()}
        />
        <InputField
          inputRef={bodyRef}
          label="Message"
          value={body}
          onChangeText={setBody}
          placeholder="Write your message"
          multiline
          blurOnSubmit={false}
        />
        <PrimaryButton title="Send Email" onPress={handleSend} disabled={loading} />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {confirmation ? <Text style={styles.confirmation}>{confirmation}</Text> : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 14,
    marginBottom: 18,
  },
  inboxActions: {
    marginBottom: 18,
  },
  inbox: {
    gap: 10,
    marginBottom: 22,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
  },
  error: {
    color: '#b1432d',
    fontSize: 14,
    fontWeight: '700',
  },
  confirmation: {
    borderWidth: 1,
    borderColor: '#b7d2c4',
    borderRadius: 8,
    backgroundColor: '#edf8f1',
    color: '#225245',
    fontSize: 15,
    fontWeight: '800',
    padding: 14,
  },
});
