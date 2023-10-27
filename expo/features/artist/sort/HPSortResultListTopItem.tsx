import FollowIcon from '@hpapp/features/artist/FollowIcon';
import MemberIcon from '@hpapp/features/artist/MemberIcon';
import HPSortResultRankDiffIcon from '@hpapp/features/artist/sort/HPSortResultRankDiffIcon';
import Text from '@hpapp/features/common/components/Text';
import { FontSize, IconSize, MemberIconSize, Spacing } from '@hpapp/features/common/constants';
import { useHelloProject } from '@hpapp/features/root/protected/context';
import { Icon } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';

export default function HPSortResultListTopItem({
  memberId,
  rank,
  previousRank
}: {
  memberId: string;
  rank: number;
  previousRank?: number;
}) {
  const hp = useHelloProject();
  const member = hp.useMember(memberId);
  const iconColor = rank === 0 ? 'gold' : rank === 1 ? 'silver' : '#cd7f32';
  const rankDiff = previousRank !== undefined ? previousRank - rank : undefined;
  return (
    <View style={styles.container}>
      <View style={styles.labelHeader}>
        <View style={styles.labelHeaderRank}>
          <Icon type="material-community" name="chess-king" size={IconSize.Small} color={iconColor} />
          <Text style={styles.labelHeaderRankText}>{rank + 1}</Text>
          <HPSortResultRankDiffIcon diff={rankDiff} />
        </View>
        <Text style={styles.labelHeaderText}>{member!.name}</Text>
        <FollowIcon member={memberId} size={IconSize.Small} />
      </View>
      <MemberIcon member={memberId} size={MemberIconSize.Medium} showFollowIcon />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '33%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  labelHeaderRank: {
    alignItems: 'center',
    marginRight: Spacing.Small
  },
  labelHeaderRankText: {
    fontSize: FontSize.Small
  },
  labelHeaderText: {
    fontSize: FontSize.Medium,
    fontWeight: 'bold'
  }
});
