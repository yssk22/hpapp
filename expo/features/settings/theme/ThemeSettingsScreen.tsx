import Text from '@hpapp/features/common/components/Text';
import NavigationListItem from '@hpapp/features/common/components/list/NavigationListItem';
import { Spacing } from '@hpapp/features/common/constants';
import { defineScreen, useScreenTitle } from '@hpapp/features/root/protected/stack';
import { ColorScheme, useColor } from '@hpapp/features/settings/context/theme';
import ThemeColorSelectorScreen from '@hpapp/features/settings/theme/ThemeColorSelectorScreen';
import { t } from '@hpapp/system/i18n';
import { View, StyleSheet } from 'react-native';

export default defineScreen('/settings/theme/', function ThemeSettngsScreen() {
  useScreenTitle(t('Theme Settings'));
  const [primary, primaryContrast] = useColor('primary');
  const [secondary, secondaryContrast] = useColor('secondary');
  const [background, backgroundContrast] = useColor('background');
  return (
    <View style={styles.container}>
      <NavigationListItem
        screen={ThemeColorSelectorScreen}
        params={{
          title: t('Primary Color'),
          scheme: 'primary' as ColorScheme
        }}
      >
        <Text style={[styles.text, { backgroundColor: primary, color: primaryContrast }]}>{t('Primary Color')}</Text>
      </NavigationListItem>
      <NavigationListItem
        screen={ThemeColorSelectorScreen}
        params={{
          title: t('Secondary Color'),
          scheme: 'secondary' as ColorScheme
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
          scheme: 'background' as ColorScheme
        }}
      >
        <Text style={[styles.text, { backgroundColor: background, color: backgroundContrast }]}>
          {t('Background Color')}
        </Text>
      </NavigationListItem>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    paddingHorizontal: Spacing.Small,
    paddingVertical: Spacing.XXSmall
  }
});
