import { ExternalImage, Text } from '@hpapp/features/common';
import { Spacing } from '@hpapp/features/common/constants';
import { ListItem } from '@hpapp/features/common/list';
import { useNavigation } from '@hpapp/features/common/stack';
import ElineupMallWebViewScreen from '@hpapp/features/elineupmall/ElineupMallWebViewScreen';
import * as date from '@hpapp/foundation/date';
import { t } from '@hpapp/system/i18n';
import { Divider } from '@rneui/base';
import { StyleSheet, View } from 'react-native';
import { graphql, useFragment } from 'react-relay';

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
  const navigation = useNavigation();
  const item = useFragment<ElineupMallLimitedTimeItemListItemFragment$key>(
    ElineupMallLimitedTimeItemListItemFragmentGraphQL,
    data
  );
  const dateString = date.toDateString(item.orderEndAt);
  const imageUrl = item.images[0].url;
  return (
    <>
      <Divider />
      <ListItem
        containerStyle={styles.container}
        rightContent={
          <ExternalImage
            uri={imageUrl}
            style={styles.image}
            width={imageSize}
            height={imageSize}
            cachePolicy="memory-disk"
          />
        }
        onPress={() => {
          navigation.navigate(ElineupMallWebViewScreen, { uri: item.permalink });
        }}
      >
        <View style={styles.nameAndMetadata}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.metadata}>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel} numberOfLines={1} ellipsizeMode="tail">
                {t('Order End At')}
              </Text>
              <Text style={styles.metadataValue} numberOfLines={1} ellipsizeMode="tail">
                {dateString}
              </Text>
            </View>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel} numberOfLines={1} ellipsizeMode="tail">
                {t('Price')}
              </Text>
              <Text style={styles.metadataValue} numberOfLines={1} ellipsizeMode="tail">
                {t('%{price} JPY', { price: item.price })}
              </Text>
            </View>
          </View>
        </View>
      </ListItem>
    </>
  );
}

const imageSize = 160;

const styles = StyleSheet.create({
  container: {
    height: 180,
    padding: Spacing.Small
  },
  image: {
    width: imageSize,
    height: imageSize
  },
  nameAndMetadata: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: Spacing.Medium
  },
  name: {
    flexGrow: 1,
    fontWeight: 'bold',
    marginBottom: Spacing.XSmall
  },
  metadata: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  metadataRow: {
    flexDirection: 'row'
  },
  metadataLabel: {
    width: 80,
    marginRight: Spacing.Small
  },
  metadataValue: {},
  dateString: {}
});
