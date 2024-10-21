import WebView from 'react-native-webview';

import FeedItemAmebloOptimizedView from './FeedItemAmebloOptimizedView';

export type FeedItemAmebloProps = {
  url: string;
  optimize: boolean;
};

export default function FeedItemAmeblo({ url, optimize }: FeedItemAmebloProps) {
  if (optimize) {
    return <FeedItemAmebloOptimizedView url={url} />;
  }
  return <WebView source={{ uri: url }} />;
}
