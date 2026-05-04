import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import ResultCard from '../components/ResultCard';
import ScreenContainer from '../components/ScreenContainer';
import { searchWikipedia } from '../services/wikipediaService';

export default function WikipediaScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setError('');
    setResults([]);
    setLoading(true);

    try {
      const nextResults = await searchWikipedia(query);
      setResults(nextResults);
      if (!nextResults.length) {
        setError('No Wikipedia results found.');
      }
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
          label="Search Wikipedia"
          value={query}
          onChangeText={setQuery}
          placeholder="Example: renewable energy"
        />
        <PrimaryButton title="Search" onPress={handleSearch} disabled={loading} />
      </View>

      {loading ? <ActivityIndicator color="#236c5e" style={styles.loader} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.results}>
        {results.map((result) => (
          <ResultCard
            key={result.id}
            eyebrow="Wikipedia"
            title={result.title}
            description={result.summary}
            footer="Link placeholder for article details"
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 14,
    marginBottom: 18,
  },
  loader: {
    marginVertical: 12,
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
});
