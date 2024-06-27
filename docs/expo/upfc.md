# UPFC

UPFC is a feature to manage fan club data at `up-fc.jp`. It is built on top of clien-side scraping and GraphQL API.

## How it works

We use the normal [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) API to make a HTTP call and [`jsdom-jscore-rn`](https://github.com/iamcco/jsdom-jscore-rn)
to parse the returned HTML contents to extract the data we need.

This describes how `useUPFC()` hook works.

### Authentication

1. Issue `GET https://www.up-fc.jp/helloproject/fanclub_Login.php` so that up-fc.jp issues a session cookie.
2. Issue `POST https://www.up-fc.jp/helloproject/fanclub_Login.php` with the following form data.
   - `User_No` - fan club user number
   - `User_LoginPassword` - fan club password
   - `pp` - this has to be 'OK';
   - `@Control_Name@` - this has to be '認証';
3. If the response HTML contains `http-equiv` in their meta tag, which navigate users to redirect to `index.php`, it means the authentication is successful. If not, authentication fails.

### Parse event applications and their Tickets

There are 3 paegs that has to be scraped to get

- https://www.up-fc.jp/helloproject/event_Event_SetList.php returns all available event applications for nomal memberships.
- https://www.up-fc.jp/helloproject/fanticket_DM_List.php returns all available event applications for executive memberships.
- https://www.up-fc.jp/helloproject/mypage02.php returns applications with their statuses user has already applied.

So at first we fetch 3 html pages in parallel, then scrape each to build `UPFCEventApplicationTickets[]`

### Once event applications are built

- We send the list to GraphQL API to store these records. records at `up-fc.jp` will expire after the event is over but we want users to track these applications and make better decision on where/when to go. As a return of sending the list to our service, we'll provide the anonymous stats about applications.
- The applicatio records are also converted into Calender events and reminders.

## Security Considerations

- A credential at `up-fc.jp` is not very strong and there is no way for users to update the credentials on the web. So we **must not send these credentials to our service**. To avoid duplication of application records on the server side, the client sends the **SHA256 hash of username** so that we can identify the user without knowing the actual username.
- For usability reasons, a credential is stored in SecureStorage on the devices.

## Development and Test

We cannot create a test account for up-fc.jp so we use someones' account to fetch the necessary HTML contents, store them in test fixtures and reuse it for testing. @hpapp/features/upfc/internals/scraper/testdata is a data captured by the developer in 2020 and 2021 where executive membership was active.

We also have dummy data in DemoScraper implementation to test look&feel.
