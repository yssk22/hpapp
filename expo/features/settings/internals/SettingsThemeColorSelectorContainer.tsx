import { useUserConfig, useUserConfigUpdator } from '@hpapp/features/app/settings';
import { useThemeColor } from '@hpapp/features/app/theme';
import { Text } from '@hpapp/features/common';
import { IconSize, Spacing } from '@hpapp/features/common/constants';
import { ThemeAvailableColors, ThemeColorScheme } from '@hpapp/system/theme';
import { useNavigation } from '@react-navigation/native';
import { Icon, ListItem } from '@rneui/themed';
import { StyleSheet, ScrollView } from 'react-native';

export default function SettingsThemeColorSelectorContainer({ scheme }: { scheme: ThemeColorScheme }) {
  const navigation = useNavigation();
  const userConfig = useUserConfig();
  const updateConfig = useUserConfigUpdator();
  const [current] = useThemeColor(scheme);
  return (
    <ScrollView>
      {ThemeAvailableColors.map((a) => {
        return (
          <ListItem
            key={a.key}
            bottomDivider
            containerStyle={styles.listItemContainer}
            onPress={() => {
              switch (scheme) {
                case 'primary':
                  userConfig!.themeColorKeyPrimary = a.key;
                  break;
                case 'secondary':
                  userConfig!.themeColorKeySecondary = a.key;
                  break;
                case 'background':
                  userConfig!.themeColorKeySecondary = a.key;
                  break;
                default:
                  return;
              }
              updateConfig(userConfig!);
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
