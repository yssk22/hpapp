import { useMe } from '@hpapp/features/app/user';
import { Text } from '@hpapp/features/common';
import { HPSortResultListView } from '@hpapp/features/hpsort';
import { t } from '@hpapp/system/i18n';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function HomeTabArtistBySortView() {
  const me = useMe();
  const result = useMemo(() => {
    if (me.sortResult === null) {
      return null;
    }
    return me.sortResult.map((r) => {
      return {
        memberId: r.memberId,
        previousRank: undefined
      };
    });
  }, [me.sortResult]);
  if (result === null) {
    return (
      <View style={styles.container} testID="HomeTabArtistBySortView.NoSortYet">
        <Text>{t('NO-SORT-YET')}</Text>
      </View>
    );
  }
  return (
    <ScrollView testID="HomeTabArtistBySortView.ScrollView">
      <HPSortResultListView list={result} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
