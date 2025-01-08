import * as date from '@hpapp/foundation/date';
import { t } from '@hpapp/system/i18n';
import { graphql, useFragment } from 'react-relay';

import ElineupMallListItem from './ElineupMallListItem';
import { ElineupMallPurchaseHistoryListItemFragment$key } from './__generated__/ElineupMallPurchaseHistoryListItemFragment.graphql';

const ElineupMallPurchaseHistoryListItemGraphQL = graphql`
  fragment ElineupMallPurchaseHistoryListItemFragment on HPElineupMallItemPurchaseHistory {
    id
    orderID
    orderedAt
    name
    price
    num
    permalink
    elineupMallItem {
      images {
        url
        thumbnailUrl
      }
    }
  }
`;

export type ElineupMallPurchaseHistoryListItemProps = {
  data: ElineupMallPurchaseHistoryListItemFragment$key;
};

export default function ElineupMallPurchaseHistoryListItem({ data }: ElineupMallPurchaseHistoryListItemProps) {
  const record = useFragment(ElineupMallPurchaseHistoryListItemGraphQL, data);
  const imageUrl =
    (record.elineupMallItem?.images?.length ?? 0) > 0 ? record.elineupMallItem?.images[0].url : undefined;

  return (
    <ElineupMallListItem
      permalink={record.permalink}
      name={record.name}
      imageUrl={imageUrl}
      metadata={[
        {
          name: t('Purchased On'),
          value: date.toDateString(record.orderedAt)
        },
        {
          name: t('Num Purchased'),
          value: record.num.toString()
        },
        {
          name: t('Unit Price'),
          value: t('%{val} JPY', {
            val: record.price.toString()
          })
        },
        {
          name: t('Total Price'),
          value: t('%{val} JPY', {
            val: (record.num * record.price).toString()
          })
        }
      ]}
    />
  );
}
