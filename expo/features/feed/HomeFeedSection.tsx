import SectionListSectionHeader from '@hpapp/features/common/components/list/SectionListSectionHeader';
import FeedListItem from '@hpapp/features/feed/FeedListItem';
import { HPFeedItem } from '@hpapp/features/feed/context/FeedContext';
import { HomeTabSection } from '@hpapp/features/home/types';
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
