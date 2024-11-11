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
  UPFCCombiedSiteScraper,
  UPFCEventTicket
} from '@hpapp/features/upfc/scraper';
import * as date from '@hpapp/foundation/date';
import { isEmpty } from '@hpapp/foundation/string';
import * as logging from '@hpapp/system/logging';
import * as Calendar from 'expo-calendar';
import { useMemo } from 'react';
import { Platform } from 'react-native';

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
  calendarId: string | undefined;
  eventPrefix: string | undefined;
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
      useDemo: appConfig.useUPFCDemoScraper || upfcConfig?.hpUsername === UPFCDemoScraper.Username,
      calendarId: upfcConfig?.calendarId ?? undefined,
      eventPrefix: upfcConfig?.eventPrefix ?? undefined
    };
  }, [
    upfcConfig?.calendarId,
    upfcConfig?.eventPrefix,
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
  useDemo,
  calendarId,
  eventPrefix
}: UPFCFetchApplicationsParams): Promise<UPFCEventAPplicationsResult> {
  if (isEmpty(helloproject?.username) && isEmpty(mline?.username)) {
    throw new ErrUPFCNoCredential();
  }
  const result = await Promise.all([
    fetchApplicationsFromSite(helloproject.username, helloproject.password, 'helloproject', useDemo),
    fetchApplicationsFromSite(mline.username, mline.password, 'm-line', useDemo)
  ]);
  // optionally sync calendar and server in background.
  const applications = result.flatMap((r) => r.applications);
  syncUPFC(calendarId, eventPrefix, applications);

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

async function syncUPFC(
  calenderId: string | undefined,
  eventPrefix: string | undefined,
  applications: UPFCEventApplicationTickets[]
): Promise<void> {
  if (!isEmpty(calenderId)) {
    await syncToCalender(calenderId!, eventPrefix ?? '', applications);
  }
}

type SyncParam = [UPFCEventTicket, string];

async function syncToCalender(
  calendarId: string,
  eventPrefix: string,
  applications: UPFCEventApplicationTickets[]
): Promise<void> {
  // sync to calendar
  // check if the calendarId satisfy the condition.
  const cal = (await Calendar.getCalendarsAsync()).filter((c) => c.id === calendarId);
  if (cal.length === 0) {
    logging.Error('features.upfc.internals.useUPFCEventApplications.syncToCalender', 'cannot find calender id', {
      calendarId
    });
    return;
  }
  if (!cal[0].allowsModifications) {
    logging.Error('features.upfc.internals.useUPFCEventApplications.syncToCalender', 'not allowed', {
      calendarId
    });
    return;
  }
  // for Android, getEventsAsync return nothing if the calender is not visible so
  // users have to select from only visible calendars.
  if (Platform.OS === 'android' && !cal[0].isVisible) {
    logging.Error('features.upfc.internals.useUPFCEventApplications.syncToCalender', 'not visible', {
      calendarId
    });
  }

  const dateToEvents: { [key: number]: SyncParam[] } = {};
  applications.forEach((a) => {
    a.tickets.forEach((t) => {
      const d = date.getDate(t.startAt).getTime();
      if (!dateToEvents[d]) {
        dateToEvents[d] = [];
      }
      dateToEvents[d].push([t, a.name]);
    });
  });
  await Promise.all(
    Object.values(dateToEvents).map(async (params) => {
      return await syncToCalendarEvent(params, calendarId, eventPrefix);
    })
  );
}

async function syncToCalendarEvent(params: SyncParam[], calendarId: string, prefix: string) {
  const start = date.getDate(params[0][0].startAt);
  const end = date.addDate(start.getTime(), 2, 'day');
  const events = await Calendar.getEventsAsync([calendarId], start, end);
  const keyToEvent = events.reduce(
    (h, e) => {
      const key = `${e.title}.${date.parseDate(e.startDate).getTime()}.${e.location}`;
      h[key] = e;
      return h;
    },
    {} as { [key: string]: Calendar.Event }
  );
  return Promise.all(
    params.map(async (p) => {
      const ticket = p[0];
      const title = prefix === '' ? p[1] : `${prefix} ${p[1]}`;
      const location = ticket.venue;
      const startDate = ticket.openAt ? ticket.openAt : ticket.startAt;
      const key = `${title}.${date.parseDate(startDate).getTime()}.${location}`;
      // old app uses event title with '■ ' prefix from the ticket page so we have to take care of.
      const oldTitle = prefix === '' ? p[1] : `${prefix} ■ ${p[1]}`;
      const oldKey = `${oldTitle}.${date.parseDate(startDate).getTime()}.${location}`;
      const calendarEvent = keyToEvent[key] || keyToEvent[oldKey];
      // TODO: i18n
      const notes = `${ticket.status} 開演: ${date.toTimeString(
        ticket.startAt
      )} (ハロー！ファンにより自動的に追加されました)`;
      if (calendarEvent) {
        // 2 possible actions for events which already exist::
        //   - delete if status gets '落選' or '入金忘'
        //   - update if title or notes including status are different.
        if (ticket.status === '落選' || ticket.status === '入金忘') {
          try {
            await Calendar.deleteEventAsync(calendarEvent.id);
            logging.Info('features.upfc.internals.useUPFCEventApplications.syncToCalendarEvent', 'delete', {
              calendarId
            });
          } catch (e) {
            logging.Error('features.upfc.internals.useUPFCEventApplications.syncToCalendarEvent', 'cannot delete', {
              calendarId,
              error: (e as any).toString()
            });
          }
        } else if (notes !== calendarEvent.notes || title !== calendarEvent.title) {
          try {
            await Calendar.updateEventAsync(calendarEvent.id, {
              title,
              notes
            });
            logging.Info('features.upfc.internals.useUPFCEventApplications.syncToCalendarEvent', 'update', {
              calendarId
            });
          } catch (e) {
            logging.Error('features.upfc.internals.useUPFCEventApplications.syncToCalendarEvent', 'cannot update', {
              calendarId,
              error: (e as any).toString()
            });
          }
        }
      } else {
        if (ticket.status === '落選' || ticket.status === '入金忘') {
          return;
        }
        const endDate = ticket.openAt
          ? date.addDate(ticket.openAt.getTime(), 3, 'hour')
          : date.addDate(ticket.startAt.getTime(), 3, 'hour');
        try {
          await Calendar.createEventAsync(calendarId, {
            title,
            location,
            notes,
            startDate,
            endDate
          });
          logging.Info('features.upfc.internals.useUPFCEventApplications.syncToCalendarEvent', 'create', {
            calendarId
          });
        } catch (e) {
          logging.Error('features.upfc.internals.useUPFCEventApplications.syncToCalendarEvent', 'cannot create', {
            calendarId,
            error: (e as any).toString()
          });
        }
      }
    })
  );
}
