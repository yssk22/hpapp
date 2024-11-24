import { RadioButtonGroup, Text } from '@hpapp/features/common';
import { FontSize, Spacing } from '@hpapp/features/common/constants';
import { t } from '@hpapp/system/i18n';
import { Button } from '@rneui/themed';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { HPSortNewConfig } from './types';

export type HPSortNewConfigFormProps = {
  onSelect: (config: HPSortNewConfig) => void;
};

export default function HPSortNewConfigForm({ onSelect }: HPSortNewConfigFormProps) {
  const [numMembersToSelect, setNumMembersToSelect] = useState<string | null>(null);
  return (
    <View style={styles.container}>
      <Text style={styles.explanation}>
        {[
          t('Choose the number of members one round shows.'),
          t('You can complete sorting faster when it shows more members.')
        ].join(' ')}
      </Text>
      <RadioButtonGroup
        containerStyle={styles.radioButtonGroup}
        options={['2', '4'].map((num) => t('%{num} members', { num }))}
        selectedOption={numMembersToSelect?.toString()}
        onSelect={(option) => setNumMembersToSelect(option)}
      />
      <View style={styles.buttonGroup}>
        <Button
          disabled={numMembersToSelect === null}
          title={t('Start')}
          onPress={() => {
            onSelect({ numMembersToSelect: parseInt(numMembersToSelect!, 10) });
          }}
        />
      </View>
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
  buttonGroup: {
    flexDirection: 'row'
  }
});
