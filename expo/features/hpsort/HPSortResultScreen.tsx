import { defineScreen, useScreenTitle } from '@hpapp/features/common/stack';
import { t } from '@hpapp/system/i18n';
import { useMemo } from 'react';

import HPSortResultListView from './internals/HPSortResultListView';
import { buildHPSortResult } from './internals/helper';

type HPSortResultScreenProps = {
  createdAt: string;
  current: {
    memberIds: string[];
  };
  previous?: {
    memberIds: string[];
  };
};

export default defineScreen(
  '/hpsort/result/',
  /**
   * TODO: #103 optimize and fix the logic for HPSortHistoryScreen.
   */
  function HPSortResultScreen({ current, previous }: HPSortResultScreenProps) {
    useScreenTitle(t('Sort'));
    const list = useMemo(() => {
      return buildHPSortResult(current.memberIds, previous?.memberIds);
    }, [current.memberIds, previous?.memberIds]);

    return <HPSortResultListView list={list} />;
  }
);
