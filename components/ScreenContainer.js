import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

export default function ScreenContainer({ children, scroll = true }) {
  const content = <>{children}</>;

  return (
    <SafeAreaView style={styles.safeArea}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f8fb',
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },
});
