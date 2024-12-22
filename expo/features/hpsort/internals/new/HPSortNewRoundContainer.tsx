import { useHelloProject } from '@hpapp/features/app/user';
import { FontSize, Spacing } from '@hpapp/features/common/constants';
import { useNavigation } from '@hpapp/features/common/stack';
import * as object from '@hpapp/foundation/object';
import { logEvent } from '@hpapp/system/firebase';
import { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HPSortNewResult from './HPSortNewResult';
import HPSortNewRoundHeader from './HPSortNewRoundHeader';
import HPSortNewRoundMemberSelector from './HPSortNewRoundMemberSelector';
import { HPSortMemberNode, HPSortNewConfig, HPSortNewRoundState } from './types';
import HPSortBase from '../sort/HPSortBase';
import HPSortClassicMergeSort from '../sort/HPSortClassicMergeSort';

export type HPSortNewRoundContainerProps = {
  config: HPSortNewConfig;
};

export default function HPSortNewRoundContainer({ config }: HPSortNewRoundContainerProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const hp = useHelloProject();
  const members = hp.useMembers(false);
  const list = useMemo(() => {
    logEvent('hpsort_start', {
      num_members_to_select: config.numMembersToSelect
    });
    return object.shuffle([...members]).map((m) => new HPSortMemberNode(m));
  }, [members]);
  const [sorter, setSorter] = useState<HPSortBase<HPSortMemberNode>>(new HPSortClassicMergeSort(list));
  const comparable = sorter.getComparable();
  const [stats, setStats] = useState<HPSortNewRoundState>({
    numCompared: 0,
    startTime: new Date(),
    endTime: null
  });
  if (stats.endTime !== null) {
    return (
      <View style={{ flex: 1, paddingBottom: insets.bottom }}>
        <HPSortNewResult
          sorter={sorter}
          onRetryPress={() => {
            logEvent('hpsort_retry', {
              num_members_to_select: config.numMembersToSelect
            });
            setSorter(new HPSortClassicMergeSort(list));
            setStats({
              numCompared: 0,
              startTime: new Date(),
              endTime: null
            });
          }}
          onSave={() => {
            logEvent('hpsort_saved', {
              num_members_to_select: config.numMembersToSelect
            });
            navigation.goBack();
          }}
        />
      </View>
    );
  }
  const { numerator, denominator } = sorter.getProgress();
  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <HPSortNewRoundHeader round={stats.numCompared + 1} current={numerator} total={denominator} />
      <ScrollView>
        <View style={styles.selector}>
          <HPSortNewRoundMemberSelector
            images={comparable!.map((m) => m.member.thumbnailURL)}
            onSelect={(selections) => {
              sorter.select(...selections);
              const endTime = sorter.getComparable() === null ? new Date() : null;
              logEvent('hpsort_complete', {
                num_members_to_select: config.numMembersToSelect
              });
              setStats({
                ...stats,
                endTime,
                numCompared: stats.numCompared + 1
              });
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  selector: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  round: {
    fontSize: FontSize.XLarge,
    textAlign: 'center',
    marginTop: Spacing.Large
  }
});
