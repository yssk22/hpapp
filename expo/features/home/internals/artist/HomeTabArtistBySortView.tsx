import { useThemeColor } from '@hpapp/features/app/theme';
import { useMe, useUserRootReloader } from '@hpapp/features/app/user';
import { Text } from '@hpapp/features/common';
import { useNavigation } from '@hpapp/features/common/stack';
import { HPSortResultListView } from '@hpapp/features/hpsort';
import HPSortNewScreen from '@hpapp/features/hpsort/HPSortNewScreen';
import { t } from '@hpapp/system/i18n';
import { FAB, Icon } from '@rneui/themed';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

export default function HomeTabArtistBySortView() {
  const [color, contrast] = useThemeColor('secondary');
  const me = useMe()!;
  const [reload, isLoading] = useUserRootReloader();
  const navigation = useNavigation();
  const fab = (
    <FAB
      placement="right"
      color={color}
      style={styles.fab}
      icon={<Icon name="sort-numeric-asc" type="font-awesome" color={contrast} />}
      onPress={() => {
        navigation.push(HPSortNewScreen);
      }}
    />
  );
  if (me.latestSortReult === null) {
    return (
      <View style={styles.container} testID="HomeTabArtistBySortView.NoSortYet">
        {fab}
        <Text>{t('NO-SORT-YET')}</Text>
      </View>
    );
  }
  return (
    <>
      {fab}
      <ScrollView
        testID="HomeTabArtistBySortView.ScrollView"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              reload();
            }}
          />
        }
      >
        <HPSortResultListView list={me.latestSortReult} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fab: {
    zIndex: 1000
  }
});
