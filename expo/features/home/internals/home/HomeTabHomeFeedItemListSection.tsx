import { SectionListHeader, SectionListRenderer } from '@hpapp/features/common/sectionlist';
import { FeedListItem, HPFeedItem } from '@hpapp/features/feed';
import { t } from '@hpapp/system/i18n';

export default class HomeTabHomeFeedItemListSection implements SectionListRenderer<HPFeedItem> {
  public readonly data: HPFeedItem[];

  constructor(data: HPFeedItem[]) {
    this.data = data;
  }

  keyExtractor(item: HPFeedItem, index: number) {
    return `HomeTabHomeFeedItemListSection-${index}`;
  }

  renderSectionHeader() {
    return <SectionListHeader>{t('Latest Posts')}</SectionListHeader>;
  }

  renderListItem({ item, index }: { item: HPFeedItem; index: number }) {
    return <FeedListItem data={item} />;
  }
}
