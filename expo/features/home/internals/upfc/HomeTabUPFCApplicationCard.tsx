import { useThemeColor } from '@hpapp/features/app/theme';
import { CalendarDateIcon, Text } from '@hpapp/features/common';
import { Card, CardBody } from '@hpapp/features/common/card';
import { FontSize, IconSize, Spacing } from '@hpapp/features/common/constants';
import { ListItem } from '@hpapp/features/common/list';
import { UPFCApplicationStatusLabel, useUPFCWebView } from '@hpapp/features/upfc';
import { UPFCEventApplicationTickets } from '@hpapp/features/upfc/scraper';
import { toDateString, toTimeString } from '@hpapp/foundation/date';
import { Button, Icon } from '@rneui/themed';
import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

export type UPFCApplicationCardProps = {
  event: UPFCEventApplicationTickets;
};

export default function UPFCApplicationCard({ event }: UPFCApplicationCardProps) {
  const [color] = useThemeColor('primary');
  const openUPFCWebView = useUPFCWebView();
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
              openUPFCWebView({
                site: event.site,
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
      <CardBody>
        <>{items}</>
        <>{footer}</>
      </CardBody>
    </Card>
  );
}
const styles = StyleSheet.create({
  card: {
    margin: Spacing.XSmall
  },
  listItem: {
    paddingTop: Spacing.XXSmall,
    paddingBottom: Spacing.XXSmall,
    paddingLeft: 0,
    paddingRight: 0
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
