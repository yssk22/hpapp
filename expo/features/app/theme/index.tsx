import { SettingsProvider, SettingsProviderProps } from '@hpapp/features/app/settings';
import { createTheme, calcYIQ, rgbToColor, colorToRGB } from '@hpapp/system/theme/helper';
import { ThemeColorScheme, ThemeColorKey } from '@hpapp/system/theme/types';
import { useTheme } from '@rneui/themed';
import React, { useCallback } from 'react';

import Provider from './internals/ThemeProvider';

export type ThemeProviderProps = SettingsProviderProps;

/**
 * provides the theme context. It has to be under SettingsProvider.
 */
export function ThemeProvider({ children, ...props }: { children: React.ReactNode } & SettingsProviderProps) {
  return (
    <SettingsProvider {...props}>
      <Provider>{children}</Provider>
    </SettingsProvider>
  );
}

const yiqThreshod = 64;

/**
 * get the color and contrast color from the color scheme
 * @param scheme
 * @returns
 */
export function useThemeColor(scheme: ThemeColorScheme) {
  const { theme } = useTheme();
  const color = theme.colors[scheme];
  const def = rgbToColor(color);
  if (def) {
    return [color, def.contrastColor];
  }
  const yiq = calcYIQ(color);
  return [color, yiq > yiqThreshod ? theme.colors.white : theme.colors.black];
}

/**
 * get the color for the skelton
 * @param scheme
 * @param percent
 * @returns
 */
export function useThemeSkeltonColor(scheme: ThemeColorScheme, percent = 0.8) {
  const { theme } = useTheme();
  const color = theme.colors[scheme];
  const [r, g, b] = colorToRGB(color);
  const r1 = Math.min(255, Math.floor(r + (255 - r) * percent));
  const g1 = Math.min(255, Math.floor(g + (255 - g) * percent));
  const b1 = Math.min(255, Math.floor(b + (255 - b) * percent));
  // convert r1, g1, b1 to hex
  return `#${r1.toString(16).padStart(2, '0')}${g1.toString(16).padStart(2, '0')}${b1.toString(16).padStart(2, '0')}`;
}

/**
 * Get the updator function for the theme
 * @returns a function to update the theme
 */
export function useThemeUpdator() {
  const theme = useTheme();
  return useCallback(
    () =>
      function (primaryColor: ThemeColorKey, secondaryColor: ThemeColorKey, bgColor: ThemeColorKey) {
        theme.updateTheme(createTheme(primaryColor, secondaryColor, bgColor));
      },
    [theme.updateTheme]
  );
}
