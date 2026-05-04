import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ResultCard({ title, eyebrow, description, footer }) {
  return (
    <View style={styles.card}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {footer ? <Text style={styles.footer}>{footer}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1d7c8',
    backgroundColor: '#fffdf8',
    padding: 16,
    gap: 8,
  },
  eyebrow: {
    color: '#7f4f24',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: '#17211f',
    fontSize: 18,
    fontWeight: '800',
  },
  description: {
    color: '#514f49',
    fontSize: 14,
    lineHeight: 21,
  },
  footer: {
    color: '#2f645a',
    fontSize: 13,
    fontWeight: '700',
  },
});
