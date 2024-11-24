import { Spacing } from '@hpapp/features/common/constants';
import { Divider } from '@rneui/base';
import { StyleSheet, View } from 'react-native';

import HPSortResultListItem from './HPSortResultListItem';
import HPSortResultListTopItem from './HPSortResultListTopItem';
import { HPSortResultMemberRank } from './types';

export type HPSortResultListViewProps = {
  list: HPSortResultMemberRank[];
};

export default function HPSortResultListView({ list }: HPSortResultListViewProps) {
  const top3 = list.slice(0, 3) ?? [];
  const rest = list.slice(3) ?? [];
  return (
    <>
      <View style={styles.top3Row}>
        {top3.map((r, i) => {
          return (
            <HPSortResultListTopItem
              key={r.memberId}
              memberId={r.memberId}
              previousRank={r.previousRank}
              rank={r.rank ?? i}
            />
          );
        })}
      </View>
      <Divider />
      {rest.map((r, i) => {
        return (
          <HPSortResultListItem
            key={r.memberId}
            memberId={r.memberId}
            previousRank={r.previousRank}
            rank={r.rank ?? i + 3}
          />
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  top3Row: {
    flexDirection: 'row',
    marginTop: Spacing.XSmall,
    marginBottom: Spacing.Medium
  }
});
