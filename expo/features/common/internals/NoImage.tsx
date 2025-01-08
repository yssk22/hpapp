import { Icon } from '@rneui/themed';
import { View } from 'react-native';

export type NoImageProps = {
  style?: React.ComponentProps<typeof View>['style'];
  width: number;
  height: number;
};

export default function NoImage({ style, width, height }: NoImageProps) {
  return (
    <View
      style={[
        style,
        {
          justifyContent: 'center',
          alignItems: 'center',
          width,
          height
        }
      ]}
    >
      <Icon type="material-community" name="image-off-outline" size={width / 2} />
    </View>
  );
}
