import { useColor } from '@hpapp/contexts/settings/theme';
import { IconSize } from '@hpapp/features/common/constants';
import { FeedListItemViewHistoryIconFragment$key } from '@hpapp/features/feed/__generated__/FeedListItemViewHistoryIconFragment.graphql';
import { Icon } from '@rneui/themed';
import { graphql, useFragment } from 'react-relay';

const FeedListItemViewHistoryIconFragmentGraphQL = graphql`
  fragment FeedListItemViewHistoryIconFragment on HPFeedItem {
    myViewHistory {
      id
      isFavorite
    }
  }
`;

const FeedListItemViewHistoryIcon: React.FC<{
  data: FeedListItemViewHistoryIconFragment$key;
}> = ({ data }) => {
  const item = useFragment<FeedListItemViewHistoryIconFragment$key>(FeedListItemViewHistoryIconFragmentGraphQL, data);
  const [primary] = useColor('primary');
  const [secondary] = useColor('secondary');
  return (
    <>
      {item.myViewHistory === null && <Icon type="entypo" name="new" size={IconSize.Small} color={secondary} />}
      {item.myViewHistory?.isFavorite && <Icon type="entypo" name="heart" size={IconSize.Small} color={primary} />}
    </>
  );
};

export default FeedListItemViewHistoryIcon;
