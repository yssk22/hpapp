import WebView from 'react-native-webview';

import FeedItemInstagramOptimizedView from './FeedItemInstagramOptimizedView';

export type FeedItemInstagramProps = {
  url: string;
  sourceId: number;
  optimize: boolean;
};

export default function FeedItemInstagram({ url, sourceId, optimize }: FeedItemInstagramProps) {
  if (optimize) {
    return <FeedItemInstagramOptimizedView id={sourceId} />;
  }
  return <WebView source={{ uri: url }} />;
}
