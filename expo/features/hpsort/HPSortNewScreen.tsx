import { WithSafeArea } from '@hpapp/features/common';
import { defineScreen, useScreenTitle } from '@hpapp/features/common/stack';
import { t } from '@hpapp/system/i18n';
import { useState } from 'react';

import HPSortNewConfigForm from './internals/new/HPSortNewConfigForm';
import HPSortNewRoundContainer from './internals/new/HPSortNewRoundContainer';
import { HPSortNewConfig } from './internals/new/types';

export type HPSortNewSceenProps = object;

export default defineScreen('/hpsort/new/', function HPSortNewSceen() {
  useScreenTitle(t('New Sort'));
  const [config, setConfig] = useState<HPSortNewConfig | null>(null);

  return (
    <WithSafeArea>
      {config === null ? (
        <HPSortNewConfigForm onSelect={(config) => setConfig(config)} />
      ) : (
        <HPSortNewRoundContainer config={config} />
      )}
    </WithSafeArea>
  );
});
