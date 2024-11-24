import { ArtistMemberIcon } from '@hpapp/features/artist';
import { Text } from '@hpapp/features/common';
import { Spacing } from '@hpapp/features/common/constants';
import { NavigationListItem } from '@hpapp/features/common/list';
import HPSortResultScreen from '@hpapp/features/hpsort/HPSortResultScreen';
import { toDateTimeString } from '@hpapp/foundation/date';
import { StyleSheet, View } from 'react-native';

import { HPSortResultMemberRank } from './types';

export type HPSortHistoryListItemProps = {
  createdAt: string;
  current: HPSortResultMemberRank[];
  previous?: HPSortResultMemberRank[];
};

export default function HPSortHistoryListItem({ createdAt, current, previous }: HPSortHistoryListItemProps) {
  return (
    <NavigationListItem
      screen={HPSortResultScreen}
      params={{
        createdAt,
        current,
        previous
      }}
    >
      <View style={styles.row}>
        <View style={styles.memberThumbnails}>
          {current.map((v, i) => {
            if (i >= 3) {
              return null;
            }
            return <ArtistMemberIcon member={v.memberId} key={v.memberId} />;
          })}
        </View>
        <View style={styles.sortMetadata}>
          <Text>{toDateTimeString(createdAt)}</Text>
        </View>
      </View>
    </NavigationListItem>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  memberThumbnails: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexGrow: 1
  },
  sortMetadata: {
    padding: Spacing.XSmall,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
