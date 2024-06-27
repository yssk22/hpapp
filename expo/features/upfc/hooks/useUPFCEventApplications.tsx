import useReloadableAsync, { ReloadableAysncResult } from '@hpapp/features/common/hooks/useReloadableAsync';
import UPFCDemoScraper from '@hpapp/features/upfc/internals/scraper/UPFCDemoScraper';
import UPFCHttpFetcher from '@hpapp/features/upfc/internals/scraper/UPFCHttpFetcher';
import UPFCSiteScraper from '@hpapp/features/upfc/internals/scraper/UPFCSiteScraper';
import { ErrUPFCAuthentication, ErrUPFCNoCredential } from '@hpapp/features/upfc/internals/scraper/errors';
import { UPFCEventApplicationTickets, UPFCScraperParams } from '@hpapp/features/upfc/internals/scraper/types';
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
