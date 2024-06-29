import { useReloadableAsync, ReloadableAysncResult } from '@hpapp/features/common/';
import {
  ErrUPFCAuthentication,
  ErrUPFCNoCredential,
  UPFCDemoScraper,
  UPFCEventApplicationTickets,
  UPFCHttpFetcher,
  UPFCSiteScraper,
  UPFCScraperParams
} from '@hpapp/features/upfc/scraper';
import { isEmpty } from '@hpapp/foundation/string';

export default function useUPFCEventApplications(
  params: UPFCScraperParams
): ReloadableAysncResult<UPFCScraperParams, UPFCEventApplicationTickets[]> {
  return useReloadableAsync(fetchApplications, params, {
    logEventName: 'features.upfc.hooks.useUPFCEventApplications'
  });
}

const demoScraper = new UPFCDemoScraper();
const siteScraper = new UPFCSiteScraper(new UPFCHttpFetcher());

async function fetchApplications({
  username,
  password,
  useDemo
}: UPFCScraperParams): Promise<UPFCEventApplicationTickets[]> {
  const scraper = useDemo ? demoScraper : siteScraper;
  if (isEmpty(username)) {
    throw new ErrUPFCNoCredential();
  }
  const ok = await scraper.authenticate(username, password);
  if (!ok) {
    throw new ErrUPFCAuthentication();
  }
  return await scraper.getEventApplications();
}
