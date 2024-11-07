import { Image } from '@rneui/themed';
import { ResizeMode, Video } from 'expo-av';

type MediaProps = {
  media: {
    readonly url: string;
    readonly thumbnailUrl: string;
    readonly type: 'image' | 'text' | 'unknown' | 'video' | '%future added value';
    readonly height: number;
    readonly width: number;
  };
  size: number;
  shouldPlay?: boolean;
};

export default function Media({ media, size, shouldPlay = false }: MediaProps) {
  switch (media.type) {
    case 'video':
      return (
        <Video
          useNativeControls
          shouldPlay={shouldPlay}
          shouldCorrectPitch
          source={{ uri: media.url }}
          posterSource={{ uri: media.thumbnailUrl }}
          resizeMode={ResizeMode.CONTAIN}
          style={{ width: size, height: size }}
        />
      );
    case 'image':
      return <Image source={{ uri: media.url }} style={{ width: size, height: size }} />;
    default:
      // TODO: unknown media type rendering
      return <></>;
  }
}
