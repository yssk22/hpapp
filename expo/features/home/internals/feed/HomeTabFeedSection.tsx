import { SectionListHeader, SectionListRenderer } from '@hpapp/features/common/sectionlist';
import { FeedListItem } from '@hpapp/features/feed';
import { HPFeedItem } from '@hpapp/features/feed/context/FeedContext';
import { t } from '@hpapp/system/i18n';

export default class HomeFeedSection implements SectionListRenderer<HPFeedItem> {
  public readonly data: HPFeedItem[];

  constructor(data: HPFeedItem[]) {
    this.data = data;
  }

  renderSectionHeader() {
    return <SectionListHeader>{t('Latest Posts')}</SectionListHeader>;
  }

  renderListItem({ item, index }: { item: HPFeedItem; index: number }) {
    return <FeedListItem data={item} />;
  }
}
