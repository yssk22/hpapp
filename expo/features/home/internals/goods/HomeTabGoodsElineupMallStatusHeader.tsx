import { useThemeColor } from '@hpapp/features/app/theme';
import { IconSize, Spacing } from '@hpapp/features/common/constants';
import { ElineupMallPurchaseHistoryLoadingStatus } from '@hpapp/features/elineupmall/scraper';
import { Button, Icon } from '@rneui/themed';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export type HomeTabGoodsElineupMallStatusHeaderPros = {
  status: ElineupMallPurchaseHistoryLoadingStatus;
};

export default function HomeTabGoodsElineupMallStatusHeader({ status }: HomeTabGoodsElineupMallStatusHeaderPros) {
  const [successColor] = useThemeColor('success');
  const [errorColor] = useThemeColor('error');
  const [disabledColor] = useThemeColor('disabled');
  const succsesIcon = (
    <Icon
      containerStyle={styles.authStatusIcon}
      color={successColor}
      name="check-circle"
      type="fontawesome"
      size={IconSize.Small}
    />
  );
  const errorIcon = (
    <Icon
      containerStyle={styles.authStatusIcon}
      color={errorColor}
      name="error"
      type="material-icons"
      size={IconSize.Small}
    />
  );
  const disabledIcon = (
    <Icon
      containerStyle={styles.authStatusIcon}
      color={disabledColor}
      name="settings"
      type="ionicons"
      size={IconSize.Small}
    />
  );
  const loadingIcon = <ActivityIndicator color={successColor} size="small" />;
  return (
    <View style={styles.authStatus}>
      <Button
        title="Elineup!Mall"
        type="outline"
        size="sm"
        color="secondary"
        containerStyle={styles.authStatusButton}
        icon={
          status === 'loaded'
            ? succsesIcon
            : status === 'loading'
              ? loadingIcon
              : status === 'error_fetch'
                ? errorIcon
                : disabledIcon
        }
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  authStatus: {
    flexDirection: 'row',
    padding: Spacing.XXSmall,
    justifyContent: 'flex-end'
  },
  authStatusButton: {
    marginRight: Spacing.XSmall
  },
  authStatusIcon: {
    marginRight: Spacing.XXSmall
  }
});
