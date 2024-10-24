import { Loading, useAsync } from '@hpapp/features/common';
import { GetPublicCloudStorageURL, IsCloudStorageURL } from '@hpapp/system/utils';
import { Platform } from 'react-native';
import WebView from 'react-native-webview';

export type FeedItemAmebloOptimizedViewProps = {
  url: string;
};

export default function FeedItemAmebloOptimizedView({ url }: FeedItemAmebloOptimizedViewProps) {
  const state = useAsync(getAmebloOptimizedContent, url);
  if (state.loading) {
    return <Loading />;
  }
  if (Platform.OS === 'web') {
    // TODO: Use the optimized content for web
    return <div>Post content here</div>;
  }
  return (
    <>
      <WebView source={{ html: state.data! }} />
    </>
  );
}

const UserAgent =
  'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36';
const AmebloEntryIDUrlRegExp = /\/([^/]+)\/entry-(\d+)\.html/;
const AmebloInitDataRegExp = /\s*window\.INIT_DATA\s*=\s*(\{.*\});\s*window\.RESOURCE_BASE_URL/; // /(?s)window\.INIT_DATA\s*=\s*(\{.*\});\s*window\.RESOURCE_BASE_URL/;

async function getAmebloOptimizedContent(url: string): Promise<string> {
  const matched = url.match(AmebloEntryIDUrlRegExp);
  if (matched == null || matched.length < 3) {
    return '';
  }
  const id = matched[2];
  const { html } = await fetchContent(url);
  const entryText = extractEntryText(html, id);
  return `
        <!DOCTYPE html>
        <html lang="ja" class="no-js">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <style>
          html {
            line-height: 1.15;
          }
          body {
            color: #333333;
            background: #fff;
            font-family: ヒラギノ角ゴ Pro W3,Hiragino Kaku Gothic Pro,ＭＳ Ｐゴシック,Helvetica,Arial,sans-serif;
            overflow-wrap: break-word;
            word-break: break-word;
          }
          a {
            color: #666666;
            text-decoration: underline;
          }
          </style>
        </head>
        <body>
            <article style="overflow-x: hidden;">
            ${entryText}
            </article>
          </body>
        </html>
  `;
}

function extractEntryText(html: string, id: string) {
  const matched = html.match(AmebloInitDataRegExp);
  if (matched == null || matched.length < 2) {
    return null;
  }
  const data = JSON.parse(matched[1]);
  const entryText = data['entryState']['entryMap'][id]['entry_text'];
  return entryText;
}

async function fetchContent(url: string) {
  const req = new Request(url, {
    headers: {
      'user-agent': UserAgent
    },
    mode: 'navigate'
  });
  let source: 'direct' | 'storage' = 'direct';
  let resp = await fetch(req);
  if (resp.status >= 400 && !IsCloudStorageURL(url)) {
    resp = await fetch(GetPublicCloudStorageURL(url));
    source = 'storage';
  }
  const html = await resp.text();
  return {
    html,
    source
  };
}
