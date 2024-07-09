import { useThemeSkeltonColor } from '@hpapp/features/app/theme';
import { Spacing } from '@hpapp/features/common/constants';
import { ThemeColorScheme } from '@hpapp/system/theme';
import ContentLoader, { Rect } from 'react-content-loader/native';

export type CardSkeltonProps = {
  colorScheme?: ThemeColorScheme;
};

export default function CardSkelton({ colorScheme = 'primary' }: CardSkeltonProps) {
  const primary = useThemeSkeltonColor(colorScheme);
  const innerBarX = Spacing.Small + 3 + Spacing.Medium + 50 + Spacing.Medium;
  const innerBarWidth = 400 - (Spacing.Small + 3 + Spacing.Medium + 50 + Spacing.Medium * 3);
  return (
    <ContentLoader speed={2} width="100%" height="225" viewBox="0 0 400 225" backgroundColor={primary}>
      <Rect x={Spacing.Small} y="0" rx="0" ry="0" width={400 - 2 * Spacing.Small} height="45" />
      <Rect x={Spacing.Small} y="225" rx="0" ry="0" width={400 - 2 * Spacing.Small} height="3" />

      <Rect x={Spacing.Small} y="45" rx="0" ry="0" width="3" height="180" />
      <Rect x={400 - Spacing.Small - 3} y="45" rx="0" ry="0" width="3" height="180" />

      <Rect x={Spacing.Small + 3 + Spacing.Medium} y="65" rx="0" ry="0" width="50" height="50" />
      <Rect x={Spacing.Small + 3 + Spacing.Medium} y="145" rx="0" ry="0" width="50" height="50" />

      <Rect x={innerBarX} y="75" rx="0" ry="0" width={innerBarWidth} height="5" />
      <Rect x={innerBarX} y="100" rx="0" ry="0" width={innerBarWidth} height="5" />

      <Rect x={innerBarX} y="155" rx="0" ry="0" width={innerBarWidth} height="5" />
      <Rect x={innerBarX} y="180" rx="0" ry="0" width={innerBarWidth} height="5" />
    </ContentLoader>
  );
}
