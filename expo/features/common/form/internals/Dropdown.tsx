import { IconSize } from '@hpapp/features/common/constants';
import { Picker } from '@react-native-picker/picker';
import { Icon, Input } from '@rneui/themed';
import React, { useCallback } from 'react';
import { View, StyleSheet, ActionSheetIOS, Platform } from 'react-native';

type DropdownItem = {
  key?: string;
  label: string;
  value: string;
};

type DropdownProps = {
  selectedValue: string | undefined;
  onValueChange: (value: string) => void;
  items: DropdownItem[];
};

function DropdownAndroid({ selectedValue, onValueChange, items }: DropdownProps) {
  return (
    <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
      {items.map((c) => {
        return (
          <Picker.Item
            key={c.key ?? c.label}
            label={c.label}
            value={c.value}
            style={{
              marginTop: 3,
              marginBottom: 3,
              borderRadius: 0
            }}
          />
        );
      })}
    </Picker>
  );
}

const iOSStyles = StyleSheet.create({
  icon: {
    position: 'absolute',
    top: 28,
    right: 10
  }
});

function DropdownIOS({ selectedValue, onValueChange, items }: DropdownProps) {
  const onPress = useCallback(() => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: items.map((i) => i.label)
      },
      (buttonIndex) => {
        onValueChange(items[buttonIndex].value);
      }
    );
  }, [onValueChange, items]);

  const selected = items.filter((i) => i.value === selectedValue);
  const valueText = selected.length > 0 ? selected[0].label : items[0].label;
  return (
    <>
      <View style={iOSStyles.icon}>
        <Icon size={IconSize.Small} name="triangle-down" type="entypo" />
      </View>
      <Input disabled value={valueText} onPressIn={onPress} />
    </>
  );
}

const Dropdown = Platform.OS === 'ios' ? DropdownIOS : DropdownAndroid;

export default Dropdown;
