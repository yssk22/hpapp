import { useAppConfig, useUPFCConfig } from '@hpapp/features/app/settings';
import { useReloadableAsync, ReloadableAysncResult } from '@hpapp/features/common/';
import {
  ErrUPFCAuthentication,
  ErrUPFCNoCredential,
  UPFC2HttpFetcher,
  UPFC2SiteScraper,
  UPFCDemoScraper,
  UPFCEventApplicationTickets,
  UPFCHttpFetcher,
  UPFCSite,
  UPFCSiteScraper,
  UPFCCombiedSiteScraper
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
  hpError: Error | undefined;
  mlError: Error | undefined;
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
    logEventName: 'features.upfc.hooks.useUPFCEventApplications',
    cache: {
      key: 'useUPFCEventApplications',
      loadFn: async (value: string) => {
        const result = JSON.parse(value) as UPFCEventAPplicationsResult;
        return {
          applications: result.applications.map((a) => {
            return {
              name: a.name,
              site: a.site,
              applicationDueDate: dateOrUndefined(a.applicationDueDate),
              applicationStartDate: dateOrUndefined(a.applicationStartDate),
              paymentOpenDate: dateOrUndefined(a.paymentOpenDate),
              paymentDueDate: dateOrUndefined(a.paymentDueDate),
              tickets: a.tickets.map((t) => {
                return {
                  ...t,
                  startAt: dateOrUndefined(t.startAt)!,
                  openAt: dateOrUndefined(t.openAt)
                };
              })
            };
          }),
          hpError: result.hpError ? new Error(result.hpError.message) : undefined,
          mlError: result.mlError ? new Error(result.mlError.message) : undefined,
          useDemo: result.useDemo
        };
      }
    }
  });
}

const demoScraper = new UPFCDemoScraper();
const siteScraper = new UPFCSiteScraper(new UPFCHttpFetcher());
const siteScraper2 = new UPFC2SiteScraper(new UPFC2HttpFetcher());
const combinedScraper = new UPFCCombiedSiteScraper([siteScraper2, siteScraper]);

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
    hpError: result[0].error,
    mlError: result[1].error,
    useDemo
  };
}

async function fetchApplicationsFromSite(
  username: string,
  password: string,
  site: UPFCSite,
  useDemo: boolean
): Promise<{
  error: Error | undefined;
  applications: UPFCEventApplicationTickets[];
}> {
  const scraper = useDemo ? demoScraper : combinedScraper;
  if (isEmpty(username)) {
    return {
      error: new ErrUPFCNoCredential(),
      applications: []
    };
  }
  const ok = await scraper.authenticate(username, password, site);
  if (!ok) {
    return {
      error: new ErrUPFCAuthentication(),
      applications: []
    };
  }
  try {
    return {
      error: undefined,
      applications: await scraper.getEventApplications(site)
    };
  } catch (e) {
    return {
      error: e as Error,
      applications: []
    };
  }
}

function dateOrUndefined(d: Date | undefined): Date | undefined {
  if (d) {
    return new Date(d);
  }
  return undefined;
}
