import { Image } from 'expo-image';
import { ComponentProps, useState } from 'react';
import { View } from 'react-native';

const blurhash = 'L:O|w?RkxtWCRkoeayfQ~Ut6Rkoe';

export type ExternalImageProps = Omit<ComponentProps<typeof Image>, 'source'> & {
  spinnerStyle?: React.ComponentProps<typeof View>['style'];
  uri: string;
  /**
   * If true, the image will be cached on the device's file system.
   */
  cachePolicy?: 'none' | 'disk' | 'memory' | 'memory-disk' | null | undefined;
  maxRetries?: number | undefined;
  width: number;
  height: number;
};

/**
 * ExternalImage is an Image component wrapper to display images from external sources.
 * It creates a image cache file on the device's file system to avoid downloading the image multiple times.
 */
export default function ExternalImage({
  uri,
  cachePolicy = 'memory',
  maxRetries = 10,
  spinnerStyle,
  height,
  width,
  style,
  ...rest
}: ExternalImageProps) {
  const [retry, setRetry] = useState(0);
  return (
    <Image
      testID="ExternalImage.Image"
      {...rest}
      cachePolicy={cachePolicy}
      key={`${uri}$$${retry}`}
      source={uri}
      placeholder={{ blurhash }}
      style={[
        {
          width,
          height
        },
        style
      ]}
      transition={1000}
      onError={() => {
        if (retry < maxRetries) {
          setRetry(retry + 1);
        }
      }}
    />
  );
}
