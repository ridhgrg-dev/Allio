import React, { useState } from 'react';
import { View } from 'react-native';
import AppPanel from './AppPanel';
import AppTopBar from './AppTopBar';
import MenuPanelContent from './MenuPanelContent';
import SettingsPanelContent from './SettingsPanelContent';

export default function AppShell({ navigation, children }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <View>
      <AppTopBar onOpenMenu={() => setMenuVisible(true)} onOpenSettings={() => setSettingsVisible(true)} />
      {children}
      <AppPanel
        visible={menuVisible}
        title="Menu"
        subtitle="Move around Allio without returning to the dashboard."
        onClose={() => setMenuVisible(false)}
      >
        <MenuPanelContent
          navigation={navigation}
          onClose={() => setMenuVisible(false)}
          onOpenSettings={() => setSettingsVisible(true)}
        />
      </AppPanel>
      <AppPanel
        visible={settingsVisible}
        title="Settings"
        subtitle="Backend setup, linked accounts, and service preferences."
        onClose={() => setSettingsVisible(false)}
      >
        <SettingsPanelContent navigation={navigation} onClose={() => setSettingsVisible(false)} />
      </AppPanel>
    </View>
  );
}
