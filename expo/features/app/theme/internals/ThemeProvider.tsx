import { useUserConfig } from '@hpapp/features/app/settings';
import { createTheme } from '@hpapp/system/theme/helper';
import { ThemeProvider as RNEUIThemeProvider } from '@rneui/themed';
import React, { useMemo } from 'react';

/**
 * provides the theme context. It has to be under SettingsProvider.
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const userConfig = useUserConfig();
  const appTheme = useMemo(() => {
    return createTheme(
      userConfig?.themeColorKeyPrimary ?? 'hpofficial',
      userConfig?.themeColorKeySecondary ?? 'hotpink',
      userConfig?.themeColorKeyBackground ?? 'white'
    );
  }, [userConfig?.themeColorKeyPrimary, userConfig?.themeColorKeySecondary, userConfig?.themeColorKeyBackground]);
  return <RNEUIThemeProvider theme={appTheme}>{children}</RNEUIThemeProvider>;
}
