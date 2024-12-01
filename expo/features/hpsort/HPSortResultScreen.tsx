import { defineScreen, useScreenTitle } from '@hpapp/features/common/stack';
import { t } from '@hpapp/system/i18n';
import { useMemo } from 'react';
import { ScrollView } from 'react-native';

import { compareMemberRankDiff, HPSortResultMemberRank } from './helper';
import HPSortResultListView from './internals/HPSortResultListView';

type HPSortResultScreenProps = {
  createdAt: string;
  current: HPSortResultMemberRank[];
  previous?: HPSortResultMemberRank[];
};

export default defineScreen(
  '/hpsort/result/',
  function HPSortResultScreen({ current, previous }: HPSortResultScreenProps) {
    useScreenTitle(t('Sort Result'));
    const list = useMemo(() => {
      return compareMemberRankDiff(current, previous);
    }, [current, previous]);

    return (
      <ScrollView>
        <HPSortResultListView list={list} enableMemberNavigation />
      </ScrollView>
    );
  }
);
