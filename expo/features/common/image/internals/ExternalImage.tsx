import { useURICache } from '@hpapp/features/common';
import { ComponentProps, useCallback, useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, LayoutChangeEvent } from 'react-native';

export type ExternalImageProps = Omit<ComponentProps<typeof Image>, 'source'> & {
  containerStyle?: React.ComponentProps<typeof View>['style'];
  spinnerStyle?: React.ComponentProps<typeof View>['style'];
  uri: string;
  cache?: boolean;
};

export default function ExternalImage({ containerStyle, width, height, ...rest }: ExternalImageProps) {
  const [dimentions, setDimensions] = useState({ width: 0, height: 0 });
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  }, []);
  if (width === 0 || height === 0) {
    return <></>;
  }
  return (
    <View style={[containerStyle, { flex: 1, width, height }]} onLayout={onLayout}>
      <ExternalImageInternal {...rest} width={dimentions.width} height={dimentions.height} />
    </View>
  );
}

function ExternalImageInternal({ uri, cache = false, spinnerStyle, ...rest }: ExternalImageProps) {
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
    <View style={[spinnerStyle, styles.spinner]}>
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
