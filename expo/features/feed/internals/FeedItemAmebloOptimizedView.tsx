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
  if (state.data?.optimizedHtml) {
    return (
      <>
        <WebView source={{ html: state.data?.optimizedHtml }} />
      </>
    );
  }
  // fallback
  return (
    <>
      <WebView source={{ uri: url }} />
    </>
  );
}

const UserAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1';
const AmebloEntryIDUrlRegExp = /\/([^/]+)\/entry-(\d+)\.html/;
const AmebloInitDataRegExp = /\s*window\.INIT_DATA\s*=\s*(\{.*\});\s*window\.RESOURCE_BASE_URL/; // /(?s)window\.INIT_DATA\s*=\s*(\{.*\});\s*window\.RESOURCE_BASE_URL/;

type AmebloContent = {
  originalHtml: string;
  optimizedHtml?: string;
};

async function getAmebloOptimizedContent(url: string): Promise<AmebloContent> {
  const matched = url.match(AmebloEntryIDUrlRegExp);
  if (matched == null || matched.length < 3) {
    throw new Error('invalid URL');
  }
  const id = matched[2];
  const { html } = await fetchContent(url);
  try {
    const entryText = extractEntryText(html, id);
    return {
      originalHtml: html,
      optimizedHtml: `<!DOCTYPE html>
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
            <script>
              const elems = document.getElementsByClassName("PhotoSwipeImage");
              for (let i = 0; i < elems.length; i++) {
                const elem = elems[i];
                const src = elem.getAttribute("data-src");
                if (src) {
                  elem.setAttribute("src", src);
                }
              }
            </script>
          </body>
        </html>
    `
    };
  } catch {
    return {
      originalHtml: html
    };
  }
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
