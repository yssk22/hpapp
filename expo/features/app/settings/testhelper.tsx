import { act, render } from '@testing-library/react-native';

import { SettingsProvider, SettingsProviderProps } from './';
import SettingsList from './internals/SettingsList';

/**
 * Clear all settings
 */
export async function clearSettings() {
  await Promise.all(
    SettingsList.map((settings) => {
      settings.clear();
    })
  );
}

export async function renderSettingsProvider(children: React.ReactNode, props: SettingsProviderProps = {}) {
  await clearSettings();
  const content = render(<SettingsProvider {...props}>{children}</SettingsProvider>);
  await act(async () => {});
  return content;
}
