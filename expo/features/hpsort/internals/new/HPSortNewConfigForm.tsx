import { BetaIcon, RadioButtonGroup, Text } from '@hpapp/features/common';
import { FontSize, IconSize, Spacing } from '@hpapp/features/common/constants';
import { t } from '@hpapp/system/i18n';
import { Button } from '@rneui/themed';
import { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import { HPSortNewConfig } from './types';

export type HPSortNewConfigFormProps = {
  onSelect: (config: HPSortNewConfig) => void;
};

export default function HPSortNewConfigForm({ onSelect }: HPSortNewConfigFormProps) {
  const [numMembersToSelect, setNumMembersToSelect] = useState<string | null>(null);
  return (
    <View style={styles.container}>
      <Text style={styles.explanation}>{[t('Choose the number of members one round shows.')].join(' ')}</Text>
      <RadioButtonGroup
        containerStyle={styles.radioButtonGroup}
        values={['2', '4']}
        labels={[
          <Text>2</Text>,
          <>
            <Text>4</Text>
            <BetaIcon size={IconSize.Medium} />
          </>
        ]}
        selectedOption={numMembersToSelect?.toString()}
        onSelect={(value) => setNumMembersToSelect(value)}
      />
      <View style={styles.betaExplanation}>
        <BetaIcon size={IconSize.Medium} />
        <Text>
          {t(
            "With choosing 4, it's an experiemntal sort feature, where you can complete faster but you may not sort all members."
          )}
        </Text>
      </View>
      <Button
        style={styles.button}
        disabled={numMembersToSelect === null}
        title={t('Start')}
        onPress={() => {
          onSelect({ numMembersToSelect: parseInt(numMembersToSelect!, 10) });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  radioButtonGroup: {
    padding: Spacing.Large
  },
  explanation: {
    paddingLeft: Spacing.Large,
    paddingRight: Spacing.Large,
    fontSize: FontSize.Large
  },
  betaExplanation: {
    flexDirection: 'row',
    marginBottom: Spacing.XLarge,
    paddingLeft: Spacing.XLarge,
    paddingRight: Spacing.XLarge,
    fontSize: FontSize.Large
  },
  button: {
    width: Dimensions.get('window').width * 0.3,
    justifyContent: 'center',
    marginTop: Spacing.XLarge
  }
});
