import Text from '@hpapp/features/common/components/Text';
import { openURL } from 'expo-linking';
import { useCallback } from 'react';

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
