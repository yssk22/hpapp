import HPSortResultListItem from '@hpapp/features/artist/sort/HPSortResultListItem';
import HPSortResultListTopItem from '@hpapp/features/artist/sort/HPSortResultListTopItem';
import { Spacing } from '@hpapp/features/common/constants';
import { Divider } from '@rneui/base';
import { StyleSheet, View } from 'react-native';

export default function HPSortResultListView({
  list
}: {
  list: {
    memberId: string;
    previousRank?: number;
  }[];
}) {
  const top3 = list.slice(0, 3) ?? [];
  const rest = list.slice(3) ?? [];
  return (
    <>
      <View style={styles.top3Row}>
        {top3.map((r, i) => {
          return (
            <HPSortResultListTopItem key={r.memberId} memberId={r.memberId} previousRank={r.previousRank} rank={i} />
          );
        })}
      </View>
      <Divider />
      {rest.map((r, i) => {
        return (
          <HPSortResultListItem key={r.memberId} memberId={r.memberId} previousRank={r.previousRank} rank={i + 3} />
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
