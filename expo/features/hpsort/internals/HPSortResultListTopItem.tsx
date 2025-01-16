import { useMember } from '@hpapp/features/app/user';
import { ArtistMemberIcon, ArtistMemberIconSize } from '@hpapp/features/artist';
import ArtistMemberScreen from '@hpapp/features/artist/ArtistMemberScreen';
import { Text } from '@hpapp/features/common';
import { FontSize, IconSize, Spacing } from '@hpapp/features/common/constants';
import { useNavigation } from '@hpapp/features/common/stack';
import { Icon } from '@rneui/themed';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import HPSortResultRankDiffIcon from './HPSortResultRankDiffIcon';

export default function HPSortResultListTopItem({
  memberId,
  rank,
  previousRank,
  enableMemberNavigation
}: {
  memberId: string;
  rank: number;
  previousRank?: number;
  enableMemberNavigation?: boolean;
}) {
  const navigation = useNavigation();
  const member = useMember(memberId);
  const iconColor = rank === 1 ? 'gold' : rank === 2 ? 'silver' : '#cd7f32';
  const rankDiff = previousRank !== undefined ? previousRank - rank : undefined;
  const content = (
    <>
      <View style={styles.labelHeader}>
        <View style={styles.labelHeaderRank}>
          <Icon type="material-community" name="chess-king" size={IconSize.Small} color={iconColor} />
          <Text style={styles.labelHeaderRankText}>{rank}</Text>
        </View>
        <View style={styles.labelHeaderRankDiff}>
          <HPSortResultRankDiffIcon diff={rankDiff} />
        </View>
        <Text style={styles.labelHeaderText}>{member!.name}</Text>
      </View>
      <ArtistMemberIcon memberId={memberId} size={ArtistMemberIconSize.Medium} showFollowIcon />
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
  return <View style={styles.container}>{content}</View>;
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
    alignItems: 'center'
  },
  labelHeaderRankText: {
    fontSize: FontSize.Small
  },
  labelHeaderRankDiff: {
    fontSize: FontSize.Small,
    marginLeft: Spacing.XXSmall,
    marginRight: Spacing.XXSmall
  },
  labelHeaderText: {
    fontSize: FontSize.Medium,
    fontWeight: 'bold'
  }
});
