import { useURICache } from '@hpapp/features/common';
import { ComponentProps, useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';

export type ExternalImageProps = Omit<ComponentProps<typeof Image>, 'source'> & {
  uri: string;
  cache?: boolean;
};

export default function ExternalImage({ uri, cache = false, style, ...rest }: ExternalImageProps) {
  const [fallbackFlag, setFallbackFlag] = useState<boolean>(false);
  const localUri = useURICache(uri);
  if (fallbackFlag) {
    return <View>{localUri && <Image {...rest} source={{ uri: localUri }} key={`${localUri}${new Date()}`} />}</View>;
  }
  if (localUri != null) {
    return (
      <Image
        {...rest}
        key={`${localUri!}${new Date()}`}
        source={{ uri: localUri! }}
        onError={() => {
          setFallbackFlag(true);
        }}
      />
    );
  }
  return (
    <View style={[style, styles.spinner]}>
      <ActivityIndicator color="#ff0000" />
    </View>
  );
}

const styles = StyleSheet.create({
  spinner: {
    position: 'absolute',
    alignContent: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
});
