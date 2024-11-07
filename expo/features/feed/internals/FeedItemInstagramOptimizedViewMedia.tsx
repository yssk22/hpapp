import { useThemeColor } from '@hpapp/features/app/theme';
import { Media } from '@hpapp/features/common';
import { Spacing } from '@hpapp/features/common/constants';
import { useRef } from 'react';
import { Dimensions, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';

import { HPBlobType } from './__generated__/FeedItemInstagramOptimizedViewQuery.graphql';

type FeedItemInstagramOptimizedViewMediaProps = {
  media: {
    readonly height: number;
    readonly type: HPBlobType;
    readonly url: string;
    readonly width: number;
    readonly thumbnailUrl: string;
  }[];
};

const size = Math.min(Dimensions.get('window').width, Dimensions.get('window').height);

export function FeedItemInstagramOptimizedViewMedia({ media }: FeedItemInstagramOptimizedViewMediaProps) {
  const [primary] = useThemeColor('primary');
  const [secondary] = useThemeColor('secondary');
  const progress = useSharedValue(0);
  const ref = useRef<ICarouselInstance>(null);
  if (media.length === 1) {
    return <Media media={media[0]} size={size} shouldPlay />;
  }
  return (
    <View>
      <Carousel
        ref={ref}
        data={media}
        height={size}
        width={size}
        renderItem={({ item, index }) => {
          return <Media media={item} size={size} shouldPlay={index === ref.current?.getCurrentIndex()} />;
        }}
        onProgressChange={progress}
      />
      <Pagination.Basic
        progress={progress}
        data={media}
        dotStyle={{ borderRadius: 100, backgroundColor: primary }}
        activeDotStyle={{ borderRadius: 100, backgroundColor: secondary }}
        containerStyle={{ gap: Spacing.XSmall, marginBottom: Spacing.Medium, marginTop: Spacing.Medium }}
      />
    </View>
  );
}
