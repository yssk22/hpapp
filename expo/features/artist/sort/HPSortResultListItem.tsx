import FollowIcon from '@hpapp/features/artist/FollowIcon';
import MemberIcon from '@hpapp/features/artist/MemberIcon';
import HPSortResultRankDiffIcon from '@hpapp/features/artist/sort/HPSortResultRankDiffIcon';
import Text from '@hpapp/features/common/components/Text';
import { Spacing, FontSize, MemberIconSize, IconSize } from '@hpapp/features/common/constants';
import { useHelloProject } from '@hpapp/features/root/protected/context';
import { Divider } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';

export default function HPSortResultListItem({
  memberId,
  previousRank,
  rank
}: {
  memberId: string;
  previousRank?: number;
  rank: number;
}) {
  const hp = useHelloProject();
  const member = hp.useMember(memberId);
  const rankDiff = previousRank !== undefined ? previousRank - rank : undefined;
  return (
    <>
      <View style={styles.container}>
        <View style={styles.rank}>
          <Text style={styles.rankText}>{rank + 1}位</Text>
        </View>
        <View style={styles.rankDiff}>
          <HPSortResultRankDiffIcon diff={rankDiff} />
        </View>
        <MemberIcon member={memberId} size={MemberIconSize.Small} />
        <View style={styles.name}>
          <Text style={styles.nameText}>{member!.name}</Text>
        </View>
        <View style={styles.followIcon}>
          <FollowIcon member={memberId} size={IconSize.Small} />
        </View>
      </View>
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
