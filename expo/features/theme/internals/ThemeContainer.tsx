import { useThemeColor } from '@hpapp/features/app/theme';
import { Text } from '@hpapp/features/common';
import { Spacing } from '@hpapp/features/common/constants';
import { NavigationListItem } from '@hpapp/features/common/list';
import ThemeColorSelectorScreen from '@hpapp/features/theme/ThemeColorSelectorScreen';
import { t } from '@hpapp/system/i18n';
import { ThemeColorScheme } from '@hpapp/system/theme';
import { View, StyleSheet } from 'react-native';

export default function ThemeContainer() {
  const [primary, primaryContrast] = useThemeColor('primary');
  const [secondary, secondaryContrast] = useThemeColor('secondary');
  const [background, backgroundContrast] = useThemeColor('background');
  return (
    <View style={styles.container}>
      <NavigationListItem
        screen={ThemeColorSelectorScreen}
        params={{
          title: t('Primary Color'),
          scheme: 'primary' as ThemeColorScheme
        }}
      >
        <Text style={[styles.text, { backgroundColor: primary, color: primaryContrast }]}>{t('Primary Color')}</Text>
      </NavigationListItem>
      <NavigationListItem
        screen={ThemeColorSelectorScreen}
        params={{
          title: t('Secondary Color'),
          scheme: 'secondary' as ThemeColorScheme
        }}
      >
        <Text style={[styles.text, { backgroundColor: secondary, color: secondaryContrast }]}>
          {t('Secondary Color')}
        </Text>
      </NavigationListItem>
      <NavigationListItem
        screen={ThemeColorSelectorScreen}
        params={{
          title: t('Background Color'),
          scheme: 'background' as ThemeColorScheme
        }}
      >
        <Text style={[styles.text, { backgroundColor: background, color: backgroundContrast }]}>
          {t('Background Color')}
        </Text>
      </NavigationListItem>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    paddingHorizontal: Spacing.Small,
    paddingVertical: Spacing.XXSmall
  }
});
