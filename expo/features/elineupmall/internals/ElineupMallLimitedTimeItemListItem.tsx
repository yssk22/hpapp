/* eslint-disable local-rules/no-translation-entry */
import * as date from '@hpapp/foundation/date';
import { t } from '@hpapp/system/i18n';
import { graphql, useFragment } from 'react-relay';

import ElineupMallListItem from './ElineupMallListItem';
import { ElineupMallLimitedTimeItemListItemFragment$key } from './__generated__/ElineupMallLimitedTimeItemListItemFragment.graphql';

const ElineupMallLimitedTimeItemListItemFragmentGraphQL = graphql`
  fragment ElineupMallLimitedTimeItemListItemFragment on HPElineupMallItem {
    id
    name
    permalink
    description
    price
    isLimitedToFc
    isOutOfStock
    images {
      url
    }
    category
    orderStartAt
    orderEndAt
  }
`;

export function ElineupMallLimitedTimeItemListItem({ data }: { data: ElineupMallLimitedTimeItemListItemFragment$key }) {
  const item = useFragment<ElineupMallLimitedTimeItemListItemFragment$key>(
    ElineupMallLimitedTimeItemListItemFragmentGraphQL,
    data
  );
  const dateString = date.toDateString(item.orderEndAt);
  return (
    <ElineupMallListItem
      permalink={item.permalink}
      category={t(item.category)}
      name={item.name}
      imageUrl={item.images[0].url}
      enableCartMutation
      metadata={[
        {
          name: t('Order End On'),
          value: dateString
        },
        {
          name: t('Price'),
          value: t('%{price} JPY', { price: item.price })
        }
      ]}
    />
  );
}
