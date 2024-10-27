import Feather from '@expo/vector-icons/Feather';
import { useThemeColor } from '@hpapp/features/app/theme';
import { IconSize } from '@hpapp/features/common/constants';
import { t } from '@hpapp/system/i18n';
import { useLocalMediaManager } from '@hpapp/system/media';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import FeedItemCTA from './FeedItemCTA';

export type FeedItemCTADownloadProps = {
  albumName: string;
  urls: string[];
};

export function FeedItemCTADownload({ albumName, urls }: FeedItemCTADownloadProps) {
  const [state, setState] = useState<'idle' | 'downloading' | 'downloaded'>('idle');
  const [color] = useThemeColor('secondary');
  const lmm = useLocalMediaManager();
  const [missingUrls, setMissingUrls] = useState<string[]>(urls);
  useEffect(() => {
    (async () => {
      const assets = await Promise.all(urls.map((url) => lmm.getAssetFromURI(url)));
      setMissingUrls(urls.filter((_, i) => assets[i] === null));
    })();
  }, [urls]);
  const onPress = useCallback(async () => {
    setState('downloading');
    try {
      await Promise.all(missingUrls.map((url) => lmm.saveToAsset(url, albumName)));
      setState('downloaded');
    } catch (e) {
      if (
        e instanceof Error &&
        (e.message === 'permission deined' ||
          e.message === 'MEDIA_LIBRARY permission is required to do this operation.')
      ) {
        // TODO: make it user friendly
        alert('Permission denied');
        setState('idle');
        return;
      }
      setState('idle');
    }
  }, [lmm, missingUrls]);
  if (!lmm.isAvailable) {
    return null;
  }
  if (missingUrls.length === 0) {
    return <FeedItemCTA label="Downloaded" icon={<Feather name="check" color={color} size={IconSize.Medium} />} />;
  }
  switch (state) {
    case 'idle':
      return (
        <FeedItemCTA
          label={t('Download')}
          icon={<Feather name="download" color={color} size={IconSize.Medium} />}
          onPress={onPress}
        />
      );
    case 'downloading':
      return <FeedItemCTA label={t('Download')} icon={<ActivityIndicator />} />;
    case 'downloaded':
      return <FeedItemCTA label={t('Download')} icon={<Feather name="check" color={color} size={IconSize.Medium} />} />;
  }
}
