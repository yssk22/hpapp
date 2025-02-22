import { CalendarDateIcon, Text } from '@hpapp/features/common';
import { FontSize, IconSize, Spacing } from '@hpapp/features/common/constants';
import { ListItem } from '@hpapp/features/common/list';
import { SectionListHeader, SectionListRenderer } from '@hpapp/features/common/sectionlist';
import { UPFCEventApplicationTickets } from '@hpapp/features/upfc/scraper';
import * as date from '@hpapp/foundation/date';
import { t } from '@hpapp/system/i18n';
import { Icon } from '@rneui/base';
import { View, StyleSheet } from 'react-native';

export type HomeTabHomeUPFCPendingPaymentsSectionProps = {
  primaryColor: string;
  data: UPFCEventApplicationTickets[];
  onPressListItem: (event: UPFCEventApplicationTickets) => void;
};
export default class HomeTabHomeUPFCPendingPaymentsSection implements SectionListRenderer<UPFCEventApplicationTickets> {
  private primaryColor: string;
  private onPressListItem: (event: UPFCEventApplicationTickets) => void;
  public readonly data: UPFCEventApplicationTickets[];

  constructor(props: HomeTabHomeUPFCPendingPaymentsSectionProps) {
    this.primaryColor = props.primaryColor;
    this.onPressListItem = props.onPressListItem;
    const now = new Date();
    // take only events with pending payment tickets
    this.data = props.data
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

  keyExtractor(item: UPFCEventApplicationTickets, index: number): string {
    return `HomeTabHomeUPFCPendingPaymentsSection-${index}`;
  }

  renderSectionHeader() {
    if (this.data.length > 0) {
      return <SectionListHeader>{t('Pending Payments')}</SectionListHeader>;
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
        onPress={() => this.onPressListItem(item)}
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
    paddingTop: 0,
    paddingBottom: 0,
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
