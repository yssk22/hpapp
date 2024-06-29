import { createTheme as rneuiCreateTheme } from '@rneui/themed';

import { ThemeAvailableColors } from './constants';
import { ThemeColorDef, ThemeColorKey } from './types';

// https://en.wikipedia.org/wiki/YIQ
export function calcYIQ(color: string) {
  // #aabbcc => [R, G, B] as numbers
  const [r, g, b] = colorToRGB(color);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

const ThemeAvailableColorsKeyToColor = ThemeAvailableColors.reduce(
  (h, v) => {
    h[v.key] = v;
    return h;
  },
  {} as { [key: string]: ThemeColorDef }
);

const ThemeAvailableColorsRGBToColor = ThemeAvailableColors.reduce(
  (h, v) => {
    h[v.color] = v;
    return h;
  },
  {} as { [key: string]: ThemeColorDef }
);

export function keyToColor(key: ThemeColorKey) {
  return ThemeAvailableColorsKeyToColor[key];
}

export function rgbToColor(rgb: string) {
  return ThemeAvailableColorsRGBToColor[rgb];
}

export function colorToRGB(color: string) {
  return color
    .toUpperCase()
    .split('')
    .slice(1, 7)
    .reduce((acc: string[], curr, n, arr) => (n % 2 ? [...acc, `${arr[n - 1]}${curr}`] : acc), [])
    .map((h) => parseInt(h, 16));
}

export function createTheme(primaryColor: ThemeColorKey, secondaryColor: ThemeColorKey, bgColor: ThemeColorKey) {
  const primary = keyToColor(primaryColor).color;
  const secondary = keyToColor(secondaryColor).color;
  const background = keyToColor(bgColor).color;
  return rneuiCreateTheme({
    lightColors: {
      primary,
      secondary,
      background
    },
    darkColors: {
      primary,
      secondary,
      background
    }
  });
}
