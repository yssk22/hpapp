import { Spacing } from '@hpapp/features/common/constants';
import { Icon } from '@rneui/themed';
import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';

import Text from './Text';

export type RadioButtonGroupProps = {
  containerStyle?: ViewStyle;
  values: string[];
  labels?: React.ReactElement[];
  selectedOption?: string;
  onSelect?: (option: string) => void;
};

export default function RadioButtonGroup({
  containerStyle,
  labels,
  values,
  selectedOption,
  onSelect
}: RadioButtonGroupProps) {
  const [selected, setSelected] = useState(selectedOption);

  return (
    <View style={[styles.container, containerStyle]}>
      {values.map((value, idx) => (
        <TouchableOpacity
          onPress={() => {
            setSelected(value);
            onSelect && onSelect(value);
          }}
          key={value}
          style={styles.row}
        >
          <Icon
            style={styles.icon}
            name={selected === value ? 'radio-button-checked' : 'radio-button-unchecked'}
            type="material-icons"
          />
          {labels ? labels[idx] : <Text>{value}</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  row: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center'
  },
  icon: {
    marginRight: Spacing.Small
  }
});
