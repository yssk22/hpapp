import { AvailableColors, ColorScheme, useAppTheme, useColor } from '@hpapp/contexts/settings/theme';
import useLocalUserConfig from '@hpapp/contexts/settings/useLocalUserConfig';
import Text from '@hpapp/features/common/components/Text';
import { IconSize, Spacing } from '@hpapp/features/common/constants';
import { defineScreen, useScreenTitle } from '@hpapp/features/root/protected/stack';
import { useNavigation } from '@react-navigation/native';
import { Icon, ListItem } from '@rneui/themed';
import { StyleSheet, ScrollView } from 'react-native';

export default defineScreen(
  '/settings/theme/colors/',
  function ThemeColorSelectorScreen({ title, scheme }: { title: string; scheme: ColorScheme }) {
    useScreenTitle(title);
    const navigation = useNavigation();
    const [config, updateConfig] = useLocalUserConfig();
    const [, updateTheme] = useAppTheme();
    const [current] = useColor(scheme);
    return (
      <ScrollView>
        {AvailableColors.map((a) => {
          return (
            <ListItem
              key={a.key}
              bottomDivider
              containerStyle={styles.listItemContainer}
              onPress={() => {
                switch (scheme) {
                  case 'primary':
                    config!.themePrimaryColorKey = a.key;
                    break;
                  case 'secondary':
                    config!.themeSecondaryColorKey = a.key;
                    break;
                  case 'background':
                    config!.themeBackgroundColorKey = a.key;
                    break;
                  default:
                    return;
                }
                updateConfig(config!);
                updateTheme(
                  config!.themePrimaryColorKey ?? 'hpofficial',
                  config!.themeSecondaryColorKey ?? 'hotpink',
                  config!.themeBackgroundColorKey ?? 'white'
                );
                navigation.goBack();
              }}
            >
              <Text style={[styles.listItemTitle, { backgroundColor: a.color, color: a.contrastColor }]}>{a.name}</Text>
              {a.color === current && <Icon type="entypo" name="check" size={IconSize.Small} />}
            </ListItem>
          );
        })}
      </ScrollView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listItemContainer: {
    padding: Spacing.XSmall
  },
  listItemTitle: {
    paddingHorizontal: Spacing.XSmall,
    paddingVertical: Spacing.XXSmall,
    width: '50%'
  }
});
