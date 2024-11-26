import { useThemeColor } from '@hpapp/features/app/theme';
import { Icon } from '@rneui/base';
import { ComponentProps } from 'react';

type IconProps = ComponentProps<typeof Icon>;

export type BetaIconProps = Omit<IconProps, 'color' | 'type' | 'name'>;

export default function BetaIcon(props: BetaIconProps) {
  const [color] = useThemeColor('secondary');

  return <Icon type="material-community" name="beta" color={color} {...props} />;
}
