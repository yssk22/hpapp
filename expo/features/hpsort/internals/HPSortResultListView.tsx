import { Spacing } from '@hpapp/features/common/constants';
import { HPSortResultMemberRank } from '@hpapp/features/hpsort/helper';
import { Divider } from '@rneui/base';
import { StyleSheet, View } from 'react-native';

import HPSortResultListItem from './HPSortResultListItem';
import HPSortResultListTopItem from './HPSortResultListTopItem';

export type HPSortResultListViewProps = {
  list: HPSortResultMemberRank[];
  enableMemberNavigation?: boolean;
};

export default function HPSortResultListView({ list, enableMemberNavigation }: HPSortResultListViewProps) {
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
              enableMemberNavigation={enableMemberNavigation}
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
            enableMemberNavigation={enableMemberNavigation}
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
