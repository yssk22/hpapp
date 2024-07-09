import { ComponentProps } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';

import useURICache from './useURICache';

export type ExternalImageProps = Omit<ComponentProps<typeof Image>, 'source'> & {
  spinnerStyle?: React.ComponentProps<typeof View>['style'];
  uri: string;
  /**
   * If true, the image will be cached on the device's file system.
   */
  cache?: boolean;
  width: number;
  height: number;
};

/**
 * ExternalImage is an Image component wrapper to display images from external sources.
 * It creates a image cache file on the device's file system to avoid downloading the image multiple times.
 */
export default function ExternalImage({
  uri,
  cache = false,
  spinnerStyle,
  height,
  width,
  style,
  ...rest
}: ExternalImageProps) {
  const cachedURI = useURICache(uri);
  if (cachedURI.data !== undefined) {
    return (
      <Image
        testID="ExternalImage.Image"
        {...rest}
        key={`${cachedURI.data!}${new Date()}`}
        source={{ uri: cachedURI.data }}
        style={[
          {
            width,
            height
          },
          style
        ]}
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
