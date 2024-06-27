import CalendarDateIcon from '@hpapp/features/common/components/CalendarDateIcon';
import Text from '@hpapp/features/common/components/Text';
import Card from '@hpapp/features/common/components/card/Card';
import ListItem from '@hpapp/features/common/components/list/ListItem';
import { FontSize, IconSize, Spacing } from '@hpapp/features/common/constants';
import { useColor } from '@hpapp/features/settings/context/theme';
import useUPFCWebView from '@hpapp/features/upfc/hooks/useUPFCWebView';
import UPFCApplicationStatusLabel from '@hpapp/features/upfc/internals/UPFCApplicationStatusLabel';
import { UPFCEventApplicationTickets } from '@hpapp/features/upfc/internals/scraper/types';
import { toDateString, toTimeString } from '@hpapp/foundation/date';
import { Button, Icon } from '@rneui/themed';
import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
    margin: Spacing.XSmall
  },
  listItem: {
    paddingTop: Spacing.XXSmall,
    paddingBottom: Spacing.XSmall,
    paddingLeft: Spacing.XXSmall,
    paddingRight: Spacing.XSmall
  },
  listItemCenter: {
    justifyContent: 'space-around',
    paddingLeft: Spacing.Small,
    paddingRight: Spacing.Small,
    flexGrow: 1
  },
  listItemCenterText: {
    fontSize: FontSize.Small
  },
  footer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: Spacing.Small,
    paddingRight: Spacing.Small,
    paddingBottom: Spacing.Small
  },
  footerButtonIcon: {
    marginLeft: Spacing.Small
  }
});

export type UPFCApplicationCardProps = {
  event: UPFCEventApplicationTickets;
};

export default function UPFCApplicationCard({ event }: UPFCApplicationCardProps) {
  const [color] = useColor('primary');
  const openUPFCWeView = useUPFCWebView();
  const paymentWindowString = `${toDateString(event.paymentOpenDate)} ~ ${toDateString(event.paymentDueDate)}`;
  const items = useMemo(() => {
    return event.tickets.map((t) => {
      return (
        <ListItem
          containerStyle={styles.listItem}
          key={`${event.name}.${t.venue}.${t.startAt.getTime()}`}
          leftContent={<CalendarDateIcon date={t.startAt} />}
          rightContent={<UPFCApplicationStatusLabel ticket={t} />}
        >
          <View style={styles.listItemCenter}>
            <Text style={styles.listItemCenterText} numberOfLines={1}>
              {t.venue}
            </Text>
            <Text style={styles.listItemCenterText}>{`開場: ${toTimeString(t.openAt)} 開演:${toTimeString(
              t.startAt
            )}`}</Text>
          </View>
        </ListItem>
      );
    });
  }, [event]);
  const footer = useMemo(() => {
    if (event.paymentDueDate) {
      return (
        <View style={styles.footer}>
          <Button
            color="secondary"
            type="outline"
            onPress={() => {
              openUPFCWeView({
                urlParams: 'Contents=MYPAGE02'
              });
            }}
          >
            {paymentWindowString}
            <Icon
              style={styles.footerButtonIcon}
              type="antdesign"
              name="pay-circle1"
              size={IconSize.Small}
              color={color}
            />
          </Button>
        </View>
      );
    }
    return null;
  }, [event.paymentDueDate]);
  return (
    <Card containerStyle={styles.card} headerText={event.name}>
      {items}
      {footer}
    </Card>
  );
}
