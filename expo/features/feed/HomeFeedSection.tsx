import SectionListSectionHeader from '@hpapp/features/common/components/list/SectionListSectionHeader';
import FeedListItem from '@hpapp/features/feed/FeedListItem';
import useFeed from '@hpapp/features/feed/useFeed';
import { HomeTabSection } from '@hpapp/features/home/types';
import { t } from '@hpapp/system/i18n';

type FeedNode = NonNullable<
  NonNullable<NonNullable<NonNullable<ReturnType<typeof useFeed>['data']['feed']>['edges']>[number]>['node']
>;

export default class HomeFeedSection implements HomeTabSection<FeedNode> {
  public readonly data: FeedNode[];

  constructor(data: FeedNode[]) {
    this.data = data;
  }

  renderSectionHeader() {
    return <SectionListSectionHeader>{t('Latest Posts')}</SectionListSectionHeader>;
  }

  renderListItem({ item, index }: { item: FeedNode; index: number }) {
    return <FeedListItem data={item} />;
  }
}
