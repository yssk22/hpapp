import { Spacing } from '@hpapp/features/common/constants';
import { Icon } from '@rneui/themed';
import { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';

import Text from './Text';

export type RadioButtonGroupProps = {
  containerStyle?: ViewStyle;
  options: string[];
  selectedOption?: string;
  onSelect?: (option: string) => void;
};

export default function RadioButtonGroup({ containerStyle, options, selectedOption, onSelect }: RadioButtonGroupProps) {
  const [selected, setSelected] = useState(selectedOption);

  return (
    <View style={[styles.container, containerStyle]}>
      {options.map((option) => (
        <TouchableOpacity
          onPress={() => {
            setSelected(option);
            onSelect && onSelect(option);
          }}
          key={option}
          style={styles.row}
        >
          <Icon
            style={styles.icon}
            name={selected === option ? 'radio-button-checked' : 'radio-button-unchecked'}
            type="material-icons"
          />
          <Text>{option}</Text>
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
