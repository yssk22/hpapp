import { useUserRoles } from '@hpapp/features/auth';
import { AmebloIcon } from '@hpapp/features/common';
import { IconSize, Spacing } from '@hpapp/features/common/constants';
import { useNavigation } from '@hpapp/features/common/stack';
import { t } from '@hpapp/system/i18n';
import { Icon } from '@rneui/themed';
import { Linking, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { graphql, useLazyLoadQuery } from 'react-relay';

import FeedItemAmeblo from './FeedItemAmeblo';
import FeedItemCTA from './FeedItemCTA';
import { FeedItemCTADownload } from './FeedItemCTADownload';
import { FeedItemCTALove } from './FeedItemCTALove';
import { FeedItemCTAShare } from './FeedItemCTAShare';
import FeedItemInstagram from './FeedItemInstagram';
import { FeedItemQuery } from './__generated__/FeedItemQuery.graphql';

const FeedItemQueryGraphQL = graphql`
  query FeedItemQuery($feedId: ID!) {
    node(id: $feedId) {
      id
      ... on HPFeedItem {
        title
        sourceURL
        assetType
        sourceID
        ownerMember {
          name
        }
        media {
          url
        }
        ...FeedItemCTALove
      }
    }
  }
`;

export type FeedItemProps = {
  feedId: string;
};

export default function FeedItem({ feedId }: FeedItemProps) {
  const roles = useUserRoles();
  const data = useLazyLoadQuery<FeedItemQuery>(FeedItemQueryGraphQL, { feedId });
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  navigation.setOptions({
    title: data.node!.title
  });
  const ownerName = data.node!.ownerMember?.name ?? 'unknown';
  const urls = data.node!.media?.map((m) => m.url) ?? [];
  const albumName = `hellofanapp.${ownerName}`;
  const optimize = roles.includes('fcmember');
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {data.node?.assetType === 'ameblo' && <FeedItemAmeblo url={data.node!.sourceURL!} optimize={optimize} />}
        {data.node?.assetType === 'instagram' && (
          <FeedItemInstagram url={data.node!.sourceURL!} sourceId={data.node.sourceID!} optimize={optimize} />
        )}
      </View>
      <View style={[styles.ctaContainer, { marginBottom: insets.bottom }]}>
        {data.node!.assetType === 'ameblo' && (
          <FeedItemCTA
            label={t('Open Ameblo')}
            icon={<AmebloIcon size={IconSize.Medium} />}
            onPress={() => {
              Linking.openURL(data.node!.sourceURL!);
            }}
          />
        )}
        {data.node!.assetType === 'instagram' && (
          <FeedItemCTA
            label={t('Open Instagram')}
            icon={<Icon type="ionicon" name="logo-instagram" size={IconSize.Medium} />}
            onPress={() => {
              Linking.openURL(data.node!.sourceURL!);
            }}
          />
        )}
        <FeedItemCTAShare url={data.node!.sourceURL!} />
        {urls.length > 0 && <FeedItemCTADownload albumName={albumName} urls={urls} />}
        <FeedItemCTALove fragment={data.node!} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    flexGrow: 1
  },
  ctaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop: Spacing.XSmall,
    paddingBottom: Spacing.XSmall
  }
});
