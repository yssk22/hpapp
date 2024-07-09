import { useThemeColor } from '@hpapp/features/app/theme';
import { IconSize } from '@hpapp/features/common/constants';
import { Icon } from '@rneui/themed';
import { graphql, useFragment } from 'react-relay';

import { FeedListItemViewHistoryIconFragment$key } from './__generated__/FeedListItemViewHistoryIconFragment.graphql';

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
  const [primary] = useThemeColor('primary');
  const [secondary] = useThemeColor('secondary');
  return (
    <>
      {item.myViewHistory === null && <Icon type="entypo" name="new" size={IconSize.Small} color={secondary} />}
      {item.myViewHistory?.isFavorite && <Icon type="entypo" name="heart" size={IconSize.Small} color={primary} />}
    </>
  );
};

export default FeedListItemViewHistoryIcon;
