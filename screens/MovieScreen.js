import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import FeatureHero from '../components/FeatureHero';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import ResultCard from '../components/ResultCard';
import ScreenContainer from '../components/ScreenContainer';
import { searchMovies } from '../services/movieService';

export default function MovieScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    Keyboard.dismiss();
    setError('');
    setResults([]);
    setLoading(true);

    try {
      const nextResults = await searchMovies(query);
      setResults(nextResults);
      if (!nextResults.length) {
        setError('No movie or TV results found.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <FeatureHero
        icon="film-outline"
        accent="#a855f7"
        title="Movies and TV"
        description="Search the starter catalog and explore movie or TV details without account setup clutter."
        stat="Mock"
        statLabel="catalog"
      />
      <View style={styles.form}>
        <InputField
          label="Movie or TV title"
          value={query}
          onChangeText={setQuery}
          placeholder="Example: Arrival"
          autoComplete="off"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <PrimaryButton title="Search" onPress={handleSearch} disabled={loading} />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.results}>
        {results.map((item) => (
          <ResultCard
            key={item.id}
            eyebrow={`${item.year} · ${item.rating}`}
            title={item.title}
            description={item.description}
            footer="Rating placeholder for future API data"
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
