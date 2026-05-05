import React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

export default function ScreenContainer({ children, scroll = true }) {
  const content = <>{children}</>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
        style={styles.keyboard}
      >
        {scroll ? (
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f8fb',
  },
  keyboard: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 96,
  },
});
