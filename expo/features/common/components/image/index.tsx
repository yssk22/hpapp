import { useCachedURI } from '@hpapp/features/common/hooks/uricache';
import React, { ComponentProps, useState } from 'react';
import { View, Image } from 'react-native';

import Loading from './Loading';

type ImageProps = Omit<ComponentProps<typeof Image>, 'source'>;
const ExternalImage: React.FC<
  ImageProps & {
    uri: string;
    cache?: boolean;
  }
> = ({ uri, cache = false, ...rest }) => {
  // const [assets] = useAssets([require("assets/noimage.png")]);
  const [fallbackFlag, setFallbackFlag] = useState<boolean>(false);
  const localUri = useCachedURI(uri);
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
  return <Loading {...rest} />;
};

export default ExternalImage;
