import { SectionListSectionHeader } from '@hpapp/features/common';
import { FeedListItem } from '@hpapp/features/feed';
import { HPFeedItem } from '@hpapp/features/feed/context/FeedContext';
import { HomeTabSection } from '@hpapp/features/home';
import { t } from '@hpapp/system/i18n';

export default class HomeFeedSection implements HomeTabSection<HPFeedItem> {
  public readonly data: HPFeedItem[];

  constructor(data: HPFeedItem[]) {
    this.data = data;
  }

  renderSectionHeader() {
    return <SectionListSectionHeader>{t('Latest Posts')}</SectionListSectionHeader>;
  }

  renderListItem({ item, index }: { item: HPFeedItem; index: number }) {
    return <FeedListItem data={item} />;
  }
}
