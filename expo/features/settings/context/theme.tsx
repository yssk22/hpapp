import useLocalUserConfig from '@hpapp/features/settings/context/useLocalUserConfig';
import { createTheme, CreateThemeOptions, useTheme, ThemeProvider, Colors, Theme } from '@rneui/themed';
import React from 'react';

type ColorScheme = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'disabled' | 'background';

type ColorDef = {
  key: ColorKey;
  name: string;
  color: string;
  contrastColor: string;
};

type ColorKey =
  | 'hpofficial'
  | 'hotpink'
  | 'greenyellow'
  | 'loyalblue'
  | 'lavender'
  | 'purple'
  | 'pink'
  | 'orange'
  | 'italianred'
  | 'goldenyellow'
  | 'white'
  | 'seablue'
  | 'daisy'
  | 'brightgreen'
  | 'blue'
  | 'yellow'
  | 'aquablue'
  | 'lightpurple'
  | 'lightorange'
  | 'purered'
  | 'green'
  | 'lightgreen'
  | 'melon'
  | 'lightpink'
  | 'lightblue'
  | 'mintgreen'
  | 'mediumblue';

const AvailableColors: ColorDef[] = [
  {
    key: 'hpofficial',
    name: 'Hello Project',
    color: '#0075c2',
    contrastColor: 'white'
  },
  {
    key: 'hotpink',
    name: 'Hot Pink',
    color: '#e5007f',
    contrastColor: 'white'
  },
  {
    key: 'greenyellow',
    name: 'Green Yellow',
    color: '#adff2f',
    contrastColor: 'black'
  },
  {
    key: 'loyalblue',
    name: 'Loyal Blue',
    color: '#0233cb',
    contrastColor: 'white'
  },
  {
    key: 'lavender',
    name: 'Lavender',
    color: '#985ba1',
    contrastColor: 'white'
  },
  { key: 'purple', name: 'Purple', color: '#4f2573', contrastColor: 'white' },
  { key: 'pink', name: 'Pink', color: '#ffc0cb', contrastColor: 'white' },
  { key: 'orange', name: 'Orange', color: '#ffa500', contrastColor: 'white' },
  {
    key: 'italianred',
    name: 'Italian Red',
    color: '#db092c',
    contrastColor: 'white'
  },
  {
    key: 'goldenyellow',
    name: 'Golden Yellow',
    color: '#edae3c',
    contrastColor: 'black'
  },
  { key: 'white', name: 'White', color: '#ffffff', contrastColor: 'black' },
  {
    key: 'seablue',
    name: 'Sea Blue',
    color: '#56bed9',
    contrastColor: 'white'
  },
  { key: 'daisy', name: 'Daisy', color: '#ffdd00', contrastColor: 'black' },
  {
    key: 'brightgreen',
    name: 'Bright Green',
    color: '#02a23e',
    contrastColor: 'white'
  },
  { key: 'blue', name: 'Blue', color: '#0f2d9e', contrastColor: 'white' },
  { key: 'yellow', name: 'Yellow', color: '#ffd700', contrastColor: 'black' },
  {
    key: 'aquablue',
    name: 'Aqua Blue',
    color: '#7fffd4',
    contrastColor: 'black'
  },
  {
    key: 'lightpurple',
    name: 'Light Purple',
    color: '#dda0dd',
    contrastColor: 'white'
  },
  {
    key: 'lightorange',
    name: 'Light Orange',
    color: '#f5b48c',
    contrastColor: 'white'
  },
  {
    key: 'purered',
    name: 'Pure Red',
    color: '#ff0000',
    contrastColor: 'white'
  },
  { key: 'green', name: 'Green', color: '#008000', contrastColor: 'white' },
  {
    key: 'lightgreen',
    name: 'Light Green',
    color: '#90ee90',
    contrastColor: 'black'
  },
  { key: 'melon', name: 'Melon', color: '#7fff00', contrastColor: 'black' },
  {
    key: 'lightpink',
    name: 'Light Pink',
    color: '#fec1be',
    contrastColor: 'white'
  },
  {
    key: 'lightblue',
    name: 'Light Blue',
    color: '#9bdcfa',
    contrastColor: 'black'
  },
  {
    key: 'mintgreen',
    name: 'Mint Green',
    color: '#49b9ab',
    contrastColor: 'white'
  },
  {
    key: 'mediumblue',
    name: 'Medium Blue',
    color: '#0069b5',
    contrastColor: 'white'
  }
];

const createAppTheme = (primaryColor: ColorKey, secondaryColor: ColorKey, bgColor: ColorKey): CreateThemeOptions => {
  const primary = keyToColor(primaryColor).color;
  const secondary = keyToColor(secondaryColor).color;
  const background = keyToColor(bgColor).color;
  return createTheme({
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
};

function AppThemeProvider({ children }: { children: React.ReactElement }) {
  const [userConfig] = useLocalUserConfig();
  const appTheme = createAppTheme(
    userConfig?.themePrimaryColorKey ?? 'hpofficial',
    userConfig?.themeSecondaryColorKey ?? 'hotpink',
    userConfig?.themeBackgroundColorKey ?? 'white'
  );
  return <ThemeProvider theme={appTheme}>{children}</ThemeProvider>;
}

function useAppTheme(): [
  { colors: Colors } & Theme,
  (primaryColor: ColorKey, secondaryColor: ColorKey, bgColor: ColorKey) => void
] {
  const theme = useTheme();
  return [
    theme.theme,
    (primaryColor: ColorKey, secondaryColor: ColorKey, bgColor: ColorKey) => {
      theme.updateTheme(createAppTheme(primaryColor, secondaryColor, bgColor));
    }
  ];
}

const useColor = (scheme: ColorScheme) => {
  const { theme } = useTheme();
  const color = theme.colors[scheme];
  const def = rgbToColor(color);
  if (def) {
    return [color, def.contrastColor];
  }
  const yiq = calcYIQ(color);
  return [color, yiq > yiqThreshod ? theme.colors.white : theme.colors.black];
};

const useSkeltonColor = (scheme: ColorScheme, percent = 0.8) => {
  const { theme } = useTheme();
  const color = theme.colors[scheme];
  const [r, g, b] = colorToRGB(color);
  const r1 = Math.min(255, Math.floor(r + (255 - r) * percent));
  const g1 = Math.min(255, Math.floor(g + (255 - g) * percent));
  const b1 = Math.min(255, Math.floor(b + (255 - b) * percent));
  // convert r1, g1, b1 to hex
  return `#${r1.toString(16).padStart(2, '0')}${g1.toString(16).padStart(2, '0')}${b1.toString(16).padStart(2, '0')}`;
};

const yiqThreshod = 64;
// https://en.wikipedia.org/wiki/YIQ
const calcYIQ = (color: string) => {
  // #aabbcc => [R, G, B] as numbers
  const [r, g, b] = colorToRGB(color);
  return (r * 299 + g * 587 + b * 114) / 1000;
};

const AvailableColorsKeyToColor = AvailableColors.reduce(
  (h, v) => {
    h[v.key] = v;
    return h;
  },
  {} as { [key: string]: ColorDef }
);

const AvailableColorsRGBToColor = AvailableColors.reduce(
  (h, v) => {
    h[v.color] = v;
    return h;
  },
  {} as { [key: string]: ColorDef }
);

const keyToColor = (key: ColorKey) => {
  return AvailableColorsKeyToColor[key];
};

const rgbToColor = (rgb: string): ColorDef | undefined => {
  return AvailableColorsRGBToColor[rgb];
};

function colorToRGB(color: string) {
  return color
    .toUpperCase()
    .split('')
    .slice(1, 7)
    .reduce((acc: string[], curr, n, arr) => (n % 2 ? [...acc, `${arr[n - 1]}${curr}`] : acc), [])
    .map((h) => parseInt(h, 16));
}

export { AppThemeProvider, useAppTheme, useColor, useSkeltonColor, ColorScheme, ColorKey, AvailableColors };
