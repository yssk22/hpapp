import { useThemeColor } from '@hpapp/features/app/theme';
import { CalendarDateIcon, Text } from '@hpapp/features/common';
import { FontSize, IconSize, Spacing } from '@hpapp/features/common/constants';
import { ListItem } from '@hpapp/features/common/list';
import * as date from '@hpapp/foundation/date';
import { t } from '@hpapp/system/i18n';
import { Icon } from '@rneui/base';
import { Linking, View, StyleSheet } from 'react-native';

export type UPFCEventListItemProps = {
  name: string;
  venue: string;
  openAt?: Date;
  startAt: Date;
  iconName?: string;
  onPress?: () => void;
};

export default function UPFCEventListItem({ name, venue, openAt, startAt, iconName, onPress }: UPFCEventListItemProps) {
  const [color] = useThemeColor('primary');
  return (
    <ListItem
      containerStyle={styles.listItem}
      leftContent={<CalendarDateIcon date={startAt} />}
      rightContent={iconName !== undefined ? <Icon name={iconName} size={IconSize.Medium} color={color} /> : <></>}
      onPress={() => {
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`);
      }}
    >
      <View style={styles.listItemCenter}>
        <View>
          <Text style={styles.listItemCenterText} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.listItemCenterText} numberOfLines={1}>
            {venue}
          </Text>
          <View style={styles.listItemCenterTextFooterRow}>
            {openAt && (
              <Text style={[styles.listItemCenterText, styles.listItemCenterTextColumn]}>
                {t('Open At')}: {date.toTimeString(openAt)}
              </Text>
            )}
            <Text style={[styles.listItemCenterText, styles.listItemCenterTextColumn]}>
              {t('Start At')}: {date.toTimeString(startAt)}
            </Text>
          </View>
        </View>
      </View>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  listItem: {
    paddingLeft: Spacing.XSmall,
    paddingRight: Spacing.XSmall
  },
  listItemCenter: {
    padding: Spacing.XXSmall
  },
  listItemCenterText: {
    fontSize: FontSize.Small
  },
  listItemCenterTextColumn: {
    marginRight: Spacing.Large
  },
  listItemCenterTextFooterRow: {
    flexDirection: 'row'
  }
});
