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
        title="Navigation"
        subtitle="Jump to the part of Allio you want to use."
        onClose={() => setMenuVisible(false)}
      >
        <MenuPanelContent
          navigation={navigation}
          onClose={() => setMenuVisible(false)}
        />
      </AppPanel>
      <AppPanel
        visible={settingsVisible}
        title="Settings"
        subtitle="Backend setup and account-linking preferences."
        onClose={() => setSettingsVisible(false)}
      >
        <SettingsPanelContent navigation={navigation} onClose={() => setSettingsVisible(false)} />
      </AppPanel>
    </View>
  );
}
