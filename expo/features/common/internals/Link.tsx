import { openURL } from 'expo-linking';
import { useCallback } from 'react';

import Text from './Text';

type TextProps = React.ComponentProps<typeof Text>;

const Link: React.FC<
  TextProps & {
    href: string;
  }
> = ({ href, children, ...props }) => {
  const onPress = useCallback(() => {
    openURL(href);
  }, [href]);
  return (
    <Text onPress={onPress} {...props}>
      {children}
    </Text>
  );
};

export default Link;
