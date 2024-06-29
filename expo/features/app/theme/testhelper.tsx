import { SettingsProviderProps } from '@hpapp/features/app/settings';
import { renderSettingsProvider } from '@hpapp/features/app/settings/testhelper';

import { ThemeProvider } from './';

export async function renderThemeProvider(children: React.ReactNode, props: SettingsProviderProps = {}) {
  return renderSettingsProvider(<ThemeProvider>{children}</ThemeProvider>, props);
}
