import React from 'react';
import { StyleSheet, View } from 'react-native';
import MenuRow from './MenuRow';

const rows = [
  { route: 'Home', icon: 'home-outline', title: 'Home', subtitle: 'Allio dashboard' },
  { route: 'Delivery', icon: 'cube-outline', title: 'Delivery Tracking', subtitle: 'Track packages and saved shipments' },
  { route: 'Email', icon: 'mail-outline', title: 'Email', subtitle: 'Compose, check inbox, extract tracking' },
  { route: 'Wikipedia', icon: 'library-outline', title: 'Wikipedia', subtitle: 'Search public knowledge' },
  { route: 'Movies', icon: 'film-outline', title: 'Movie/TV', subtitle: 'Search media catalog' },
  { route: 'Connections', icon: 'link-outline', title: 'Linked Accounts', subtitle: 'Manage connected services' },
];

export default function MenuPanelContent({ navigation, onClose, onOpenSettings }) {
  function navigate(route) {
    onClose();
    navigation.navigate(route);
  }

  return (
    <View style={styles.container}>
      {rows.map((row) => (
        <MenuRow
          key={row.route}
          icon={row.icon}
          title={row.title}
          subtitle={row.subtitle}
          onPress={() => navigate(row.route)}
        />
      ))}
      <MenuRow
        icon="settings-outline"
        title="Settings"
        subtitle="Backend setup and account preferences"
        onPress={() => {
          onClose();
          onOpenSettings();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
});
