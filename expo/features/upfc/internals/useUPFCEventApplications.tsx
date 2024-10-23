import { useAppConfig, useUPFCConfig } from '@hpapp/features/app/settings';
import { useReloadableAsync, ReloadableAysncResult } from '@hpapp/features/common/';
import {
  ErrUPFCNoCredential,
  UPFCDemoScraper,
  UPFCEventApplicationTickets,
  UPFCHttpFetcher,
  UPFCSite,
  UPFCSiteScraper
} from '@hpapp/features/upfc/scraper';
import { isEmpty } from '@hpapp/foundation/string';
import { useMemo } from 'react';

type UPFCFetchApplicationsParams = {
  helloproject: {
    username: string;
    password: string;
  };
  mline: {
    username: string;
    password: string;
  };
  useDemo: boolean;
};

export type UPFCEventAPplicationsResult = {
  applications: UPFCEventApplicationTickets[];
  hpAuth: boolean | undefined;
  mlAuth: boolean | undefined;
  useDemo: boolean;
};

export default function useUPFCEventApplications(): ReloadableAysncResult<
  UPFCFetchApplicationsParams,
  UPFCEventAPplicationsResult
> {
  const appConfig = useAppConfig();
  const upfcConfig = useUPFCConfig();
  const params = useMemo(() => {
    return {
      helloproject: {
        username: upfcConfig?.hpUsername ?? '',
        password: upfcConfig?.hpPassword ?? ''
      },
      mline: {
        username: upfcConfig?.mlUsername ?? '',
        password: upfcConfig?.mlPassword ?? ''
      },
      useDemo: appConfig.useUPFCDemoScraper || upfcConfig?.hpUsername === UPFCDemoScraper.Username
    };
  }, [
    upfcConfig?.hpUsername,
    upfcConfig?.hpPassword,
    upfcConfig?.mlUsername,
    upfcConfig?.mlPassword,
    appConfig.useUPFCDemoScraper
  ]);

  return useReloadableAsync(fetchApplications, params, {
    logEventName: 'features.upfc.hooks.useUPFCEventApplications'
  });
}

const demoScraper = new UPFCDemoScraper();
const siteScraper = new UPFCSiteScraper(new UPFCHttpFetcher());

async function fetchApplications({
  helloproject,
  mline,
  useDemo
}: UPFCFetchApplicationsParams): Promise<UPFCEventAPplicationsResult> {
  if (isEmpty(helloproject?.username) && isEmpty(mline?.username)) {
    throw new ErrUPFCNoCredential();
  }
  const result = await Promise.all([
    fetchApplicationsFromSite(helloproject.username, helloproject.password, 'helloproject', useDemo),
    fetchApplicationsFromSite(mline.username, mline.password, 'm-line', useDemo)
  ]);
  return {
    applications: result.flatMap((r) => r.applications),
    hpAuth: result[0].auth,
    mlAuth: result[1].auth,
    useDemo
  };
}

async function fetchApplicationsFromSite(
  username: string,
  password: string,
  site: UPFCSite,
  useDemo: boolean
): Promise<{
  auth: boolean | undefined;
  applications: UPFCEventApplicationTickets[];
}> {
  const scraper = useDemo ? demoScraper : siteScraper;
  if (isEmpty(username)) {
    return {
      auth: undefined,
      applications: []
    };
  }
  const ok = await scraper.authenticate(username, password, site);
  if (!ok) {
    return {
      auth: false,
      applications: []
    };
  }
  return {
    auth: false,
    applications: await scraper.getEventApplications(site)
  };
}
