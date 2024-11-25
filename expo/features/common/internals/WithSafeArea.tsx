import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type WithSafeAreaProps = {
  children: React.ReactNode;
};
export default function WithSafeArea({ children }: WithSafeAreaProps) {
  const insets = useSafeAreaInsets();
  return <View style={{ flex: 1, marginBottom: insets.bottom }}>{children}</View>;
}
