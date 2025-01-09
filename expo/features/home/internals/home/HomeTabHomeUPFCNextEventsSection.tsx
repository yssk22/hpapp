import { CalendarDateIcon, Text } from '@hpapp/features/common';
import { FontSize, IconSize, Spacing } from '@hpapp/features/common/constants';
import { ListItem } from '@hpapp/features/common/list';
import { SectionListHeader, SectionListRenderer } from '@hpapp/features/common/sectionlist';
import { UPFCEventApplicationTickets, UPFCEventTicket } from '@hpapp/features/upfc/scraper';
import * as date from '@hpapp/foundation/date';
import { t } from '@hpapp/system/i18n';
import { Icon } from '@rneui/base';
import { Linking, View, StyleSheet } from 'react-native';

type ApplicationEventTicket = UPFCEventTicket & {
  name: string;
};

export default class HomeTabHomeUPFCNextEventsSection implements SectionListRenderer<ApplicationEventTicket> {
  private primaryColor: string;
  public readonly data: ApplicationEventTicket[];

  constructor(primaryColor: string, data: UPFCEventApplicationTickets[]) {
    this.primaryColor = primaryColor;
    const now = new Date();
    // convert the mapping from application -> tickets to ticket -> application to sort by ticket start date,
    // then recompose ApplicationEventTicket
    this.data = data
      .map((event) => {
        return event.tickets.map((t) => {
          return { ...t, name: event.name };
        });
      })
      .flat()
      .filter((t) => {
        if (t.status !== '入金済') {
          return false; // not eligible to join
        }
        if (now.getTime() > t.startAt.getTime()) {
          return false; // already started
        }
        return true;
      })
      .sort((a, b) => {
        return a.startAt.getTime() - b.startAt.getTime();
      });
  }

  keyExtractor(item: ApplicationEventTicket, index: number): string {
    return `HomeTabHomeUPFCNextEventsSection-${index}`;
  }

  renderSectionHeader() {
    if (this.data.length > 0) {
      return <SectionListHeader>{t('Next Events')}</SectionListHeader>;
    }
    return <></>;
  }

  renderListItem({ item, index }: { item: ApplicationEventTicket; index: number }) {
    if (index > 1) {
      return <></>;
    }
    const venue = item.venue ?? '';
    return (
      <ListItem
        containerStyle={styles.listItem}
        leftContent={<CalendarDateIcon date={item.startAt} />}
        rightContent={<Icon name="place" size={IconSize.Medium} color={this.primaryColor} />}
        onPress={() => {
          Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`);
        }}
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
              {item.openAt && (
                <Text style={[styles.listItemCenterText, styles.listItemCenterTextColumn]}>
                  {t('Open At')}: {date.toTimeString(item.openAt)}
                </Text>
              )}
              <Text style={[styles.listItemCenterText, styles.listItemCenterTextColumn]}>
                {t('Start At')}: {date.toTimeString(item.startAt)}
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
