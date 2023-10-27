import * as logging from '@hpapp/system/logging';
import { useCallback, useEffect, useState } from 'react';

import DemoScraper from './DemoScraper';
import UPFCScraper from './UPFCScraper';
import URLFetcher from './URLFetcher';
import { ErrAuthentication, ErrNoCredential, EventApplicationTickets, Scraper } from './types';

const scraper = new UPFCScraper(new URLFetcher());
const demoScraper = new DemoScraper();

const useScraper = (useDemo: boolean): Scraper => {
  if (useDemo) {
    return demoScraper;
  }
  return scraper;
};

type ScraperParams = {
  username: string;
  password: string;
  useDemo: boolean;
};

function useUPFCAuthentication(params: ScraperParams) {
  const [data, setData] = useState<null | boolean>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const auth = useCallback(async () => {
    setIsAuthenticating(true);
    try {
      if (params.useDemo) {
        setData(true);
      } else {
        const ok = await scraper.authenticate(params.username, params.password);
        setData(ok);
      }
    } finally {
      setIsAuthenticating(false);
    }
  }, [params.username, params.password, params.useDemo, setData, setIsAuthenticating]);
  useEffect(() => {
    auth();
  }, [params.username, params.password, params.useDemo, setData, setIsAuthenticating]);
  return [data, isAuthenticating, auth];
}

function useUPFCEventApplications(
  params: ScraperParams
): [null | EventApplicationTickets[], boolean, () => Promise<void>] {
  let mounted = true;
  const [data, setData] = useState<null | EventApplicationTickets[]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const reload = useCallback(async () => {
    mounted && setIsLoading(true);
    try {
      const applications = await fetchApplications(params);
      logging.Info(
        'features.upfc.scraper.useUPFCEventApplications',
        `fetched ${applications.length} applications from up-fc.jp`,
        applications
      );
      mounted && setData(applications);
    } catch (e: any) {
      logging.Error(
        'features.upfc.scraper.useUPFCEventApplications',
        `failed to fetch applications from up-fc.jp: ${e.toString()}`
      );
      throw e;
    } finally {
      mounted && setIsLoading(false);
    }
  }, [params.username, params.password, params.useDemo, setData, setIsLoading]);
  useEffect(() => {
    reload();
    return () => {
      mounted = false;
    };
  }, [params.username, params.password, params.useDemo, setData, setIsLoading]);
  return [data, isLoading, reload];
}

async function fetchApplications({ username, password, useDemo }: ScraperParams): Promise<EventApplicationTickets[]> {
  if (useDemo) {
    return demoScraper.getEventApplications();
  }
  if (username === '' || password === '') {
    throw ErrNoCredential;
  }
  const ok = await scraper.authenticate(username, password);
  if (!ok) {
    throw ErrAuthentication;
  }
  return await scraper.getEventApplications();
}

export { useScraper, useUPFCAuthentication, useUPFCEventApplications, ScraperParams };
