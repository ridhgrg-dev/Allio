import React, { useRef, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import AccountLinkPanel from '../components/AccountLinkPanel';
import FeatureHero from '../components/FeatureHero';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import useLinkedAccounts from '../hooks/useLinkedAccounts';
import { serviceGroups } from '../services/accountLinkService';
import { sendMockEmail } from '../services/emailService';

export default function EmailScreen() {
  const subjectRef = useRef(null);
  const bodyRef = useRef(null);
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const { linkedAccounts, toggleLinked, linkError } = useLinkedAccounts();

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

  return (
    <ScreenContainer>
      <FeatureHero
        icon="mail-outline"
        accent="#ea580c"
        title="Email Composer"
        description="Send a safe mock email now, and open real email provider sign-in for a future OAuth-backed inbox."
        stat="4"
        statLabel="email links"
      />
      <AccountLinkPanel
        group={serviceGroups.email}
        linkedAccounts={linkedAccounts}
        onToggleLinked={toggleLinked}
      />
      {linkError ? <Text style={styles.error}>{linkError}</Text> : null}
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
