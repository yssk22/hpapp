import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useCurrentUser } from '@hpapp/features/app/settings';
import { useThemeColor } from '@hpapp/features/app/theme';
import { IconSize } from '@hpapp/features/common/constants';
import { t } from '@hpapp/system/i18n';
import { useCallback, useEffect } from 'react';
import { graphql, useFragment } from 'react-relay';

import FeedItemCTA from './FeedItemCTA';
import { FeedItemCTALove$key } from './__generated__/FeedItemCTALove.graphql';
import useViewHistory from './useViewHistory';

const FeedItemCTALoveGraphQL = graphql`
  fragment FeedItemCTALove on HPFeedItem {
    id
    myViewHistory {
      id
      isFavorite
    }
  }
`;

export type FeedItemCTALoveProps = {
  fragment: FeedItemCTALove$key;
};

export function FeedItemCTALove({ fragment }: FeedItemCTALoveProps) {
  const user = useCurrentUser();
  const [color] = useThemeColor('secondary');
  const [updateViewHistory] = useViewHistory();
  const data = useFragment(FeedItemCTALoveGraphQL, fragment);
  useEffect(() => {
    if (data.myViewHistory === null) {
      updateViewHistory(data.id, user!.id, false);
    }
  }, [data, updateViewHistory]);
  const isFavorite = data.myViewHistory?.isFavorite ?? false;
  const name = isFavorite ? 'heart' : 'heart-o';
  const onPress = useCallback(() => {
    updateViewHistory(data.id, user!.id, !isFavorite, data.myViewHistory?.id);
  }, [updateViewHistory, isFavorite]);
  return (
    <FeedItemCTA
      label={t('Love')}
      icon={<FontAwesome name={name} color={color} size={IconSize.Medium} />}
      onPress={onPress}
    />
  );
}
