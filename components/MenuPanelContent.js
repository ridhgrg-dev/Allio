import React from 'react';
import { StyleSheet, View } from 'react-native';
import MenuRow from './MenuRow';
import { menuSections } from '../services/appSectionService';

export default function MenuPanelContent({ navigation, onClose }) {
  function navigate(route) {
    onClose();
    navigation.navigate(route);
  }

  return (
    <View style={styles.container}>
      {menuSections.map((row) => (
        <MenuRow
          key={row.route}
          icon={row.icon}
          title={row.title}
          subtitle={row.subtitle}
          onPress={() => navigate(row.route)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
});
