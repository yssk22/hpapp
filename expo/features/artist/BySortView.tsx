import { useMe } from '@hpapp/contexts/serviceroot';
import HPSortResultListView from '@hpapp/features/artist/sort/HPSortResultListView';
import { t } from '@hpapp/system/i18n';
import { Text } from '@rneui/themed';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function BySortView() {
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
      <View style={styles.container}>
        <Text>{t('NO-SORT-YET')}</Text>
      </View>
    );
  }
  return (
    <ScrollView>
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
