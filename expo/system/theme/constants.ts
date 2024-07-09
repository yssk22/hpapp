import { ThemeColorDef } from './types';

export const ThemeAvailableColors: ThemeColorDef[] = [
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

export const ThemeAvailableColorsKeyToColor = ThemeAvailableColors.reduce(
  (h, v) => {
    h[v.key] = v;
    return h;
  },
  {} as { [key: string]: ThemeColorDef }
);

export const ThemeAvailableColorsRGBToColor = ThemeAvailableColors.reduce(
  (h, v) => {
    h[v.color] = v;
    return h;
  },
  {} as { [key: string]: ThemeColorDef }
);
