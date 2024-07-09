import { Spacing } from '@hpapp/features/common/constants';
import { View, StyleSheet } from 'react-native';

type StyleProps = React.ComponentProps<typeof View>['style'];

export type CardBodyProps = {
  style?: StyleProps;
  children: React.ReactNode;
};

export default function CardBody({ style, children }: CardBodyProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.Small
  }
});
