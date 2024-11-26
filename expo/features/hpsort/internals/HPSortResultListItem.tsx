import { useHelloProject } from '@hpapp/features/app/user';
import { ArtistMemberFollowIcon, ArtistMemberIcon, ArtistMemberIconSize } from '@hpapp/features/artist';
import ArtistMemberScreen from '@hpapp/features/artist/ArtistMemberScreen';
import { Text } from '@hpapp/features/common';
import { Spacing, FontSize, IconSize } from '@hpapp/features/common/constants';
import { useNavigation } from '@hpapp/features/common/stack';
import { Divider } from '@rneui/themed';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import HPSortResultRankDiffIcon from './HPSortResultRankDiffIcon';

export default function HPSortResultListItem({
  memberId,
  previousRank,
  rank,
  enableMemberNavigation
}: {
  memberId: string;
  previousRank?: number;
  rank: number;
  enableMemberNavigation?: boolean;
}) {
  const navigation = useNavigation();
  const hp = useHelloProject();
  const member = hp.useMember(memberId);
  const rankDiff = previousRank !== undefined ? previousRank - rank : undefined;
  const content = (
    <>
      <View style={styles.rank}>
        <Text style={styles.rankText}>{rank}位</Text>
      </View>
      <View style={styles.rankDiff}>
        <HPSortResultRankDiffIcon diff={rankDiff} />
      </View>
      <ArtistMemberIcon member={memberId} size={ArtistMemberIconSize.Small} />
      <View style={styles.name}>
        <Text style={styles.nameText}>{member!.name}</Text>
      </View>
      <View style={styles.followIcon}>
        <ArtistMemberFollowIcon member={memberId} size={IconSize.Small} />
      </View>
    </>
  );
  if (enableMemberNavigation) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          navigation.push(ArtistMemberScreen, { memberId });
        }}
      >
        {content}
      </TouchableOpacity>
    );
  }
  return (
    <>
      <View style={styles.container}>{content}</View>
      <Divider />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: Spacing.Medium
  },
  rank: {
    width: 50,
    paddingRight: Spacing.Medium
  },
  rankText: {
    textAlign: 'right',
    fontSize: FontSize.Small
  },
  rankDiff: {
    paddingRight: Spacing.Medium
  },
  name: {
    paddingLeft: Spacing.Medium
  },
  nameText: {
    textAlign: 'right',
    fontSize: FontSize.Small
  },
  followIcon: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: Spacing.Medium
  }
});
