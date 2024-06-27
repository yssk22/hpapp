import CalendarDateIcon from '@hpapp/features/common/components/CalendarDateIcon';
import Text from '@hpapp/features/common/components/Text';
import ListItem from '@hpapp/features/common/components/list/ListItem';
import SectionListSectionHeader from '@hpapp/features/common/components/list/SectionListSectionHeader';
import { FontSize, IconSize, Spacing } from '@hpapp/features/common/constants';
import { HomeTabSection } from '@hpapp/features/home/types';
import { UPFCEventApplicationTickets } from '@hpapp/features/upfc/internals/scraper/types';
import * as date from '@hpapp/foundation/date';
import { t } from '@hpapp/system/i18n';
import { Icon } from '@rneui/base';
import { View, StyleSheet } from 'react-native';

export default class PendingPaymentsSection implements HomeTabSection<UPFCEventApplicationTickets> {
  private primaryColor: string;
  public readonly data: UPFCEventApplicationTickets[];

  constructor(primaryColor: string, data: UPFCEventApplicationTickets[]) {
    this.primaryColor = primaryColor;
    const now = new Date();
    // take only events with pending payment tickets
    this.data = data
      .map((event) => {
        const tickets = event.tickets.filter((t) => {
          if (t.status !== '入金待') {
            return false;
          }
          const pendingDueDate = event.paymentDueDate ?? t.openAt ?? t.startAt;
          if (now.getTime() > pendingDueDate.getTime()) {
            return false;
          }
          return true;
        });
        return {
          ...event,
          tickets
        };
      })
      .filter((event) => event.tickets.length > 0);
  }

  renderSectionHeader() {
    if (this.data.length > 0) {
      return <SectionListSectionHeader>{t('Pending Payments')}</SectionListSectionHeader>;
    }
    return <></>;
  }

  renderListItem({ item, index }: { item: UPFCEventApplicationTickets; index: number }) {
    const venue = item.tickets[0].venue ?? '';
    return (
      <ListItem
        containerStyle={styles.listItem}
        leftContent={<CalendarDateIcon date={item.paymentDueDate} />}
        rightContent={<Icon name="pay-circle1" type="antdesign" size={IconSize.Medium} color={this.primaryColor} />}
        onPress={() => {}}
      >
        <View style={styles.listItemCenter}>
          <View>
            <Text style={styles.listItemCenterText} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.listItemCenterText} numberOfLines={1}>
              {venue}
            </Text>
            <View style={styles.listItemCenterTextFooterRow}>
              <Text style={[styles.listItemCenterText, styles.listItemCenterTextColumn]}>
                {t('Payment Due')}: {date.toDateString(item.paymentDueDate)}
              </Text>
              <Text style={[styles.listItemCenterText, styles.listItemCenterTextColumn]}>
                {t('# of Tickets')}: {item.tickets.length}
              </Text>
            </View>
          </View>
        </View>
      </ListItem>
    );
  }
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
