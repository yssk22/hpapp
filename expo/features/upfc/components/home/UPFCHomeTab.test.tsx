import { DefaultAppConfig } from '@hpapp/features/appconfig/useAppConfig';
import { renderWithTestScreen } from '@hpapp/features/root';
import UPFCHomeTab from '@hpapp/features/upfc/components/home/UPFCHomeTab';

jest.useFakeTimers();

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('UPFCHomeTab', () => {
  test('render UPFCErrorBox if settings is not configured', async () => {
    const rendered = await renderWithTestScreen(<UPFCHomeTab />);
    expect(rendered.toJSON()).toMatchSnapshot();
    const errorBox = await rendered.findByTestId('UPFCErrorBox');
    expect(errorBox).toBeTruthy();
  });

  test('render list if settings is configured', async () => {
    const rendered = await renderWithTestScreen(<UPFCHomeTab />, {
      appConfig: {
        ...DefaultAppConfig,
        useUPFCDemoScraper: true
      },
      upfc: {
        username: '00000000',
        password: 'password'
      }
    });
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
