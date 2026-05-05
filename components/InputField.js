import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = false,
  autoComplete,
  returnKeyType = 'done',
  onSubmitEditing,
  blurOnSubmit,
  inputRef,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={inputRef}
        style={[styles.input, multiline && styles.multiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#938b80"
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        autoComplete={autoComplete}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={blurOnSubmit ?? !multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    color: '#2d3533',
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    backgroundColor: '#fffdf8',
    color: '#111827',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  multiline: {
    minHeight: 132,
    textAlignVertical: 'top',
  },
});
