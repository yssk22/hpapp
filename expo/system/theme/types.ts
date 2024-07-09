export type ThemeColorScheme = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'disabled' | 'background';

export type ThemeColorDef = {
  key: ThemeColorKey;
  name: string;
  color: string;
  contrastColor: string;
};

export type ThemeColorKey =
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
