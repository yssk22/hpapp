import { WithSafeArea } from '@hpapp/features/common';
import { defineScreen, useScreenTitle } from '@hpapp/features/common/stack';
import { t } from '@hpapp/system/i18n';

import HPSortNewRoundContainer from './internals/new/HPSortNewRoundContainer';

export type HPSortNewSceenProps = object;

export default defineScreen('/hpsort/new/', function HPSortNewSceen() {
  useScreenTitle(t('New Sort'));

  return (
    <WithSafeArea>
      <HPSortNewRoundContainer
        config={{
          numMembersToSelect: 2
        }}
      />
    </WithSafeArea>
  );
});
