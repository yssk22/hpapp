import { renderHook, act } from '@testing-library/react-native';
import React from 'react';

import { AnalyticsProvider, useAnalytics } from './index';

test('should provide a default analytics provider', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return <AnalyticsProvider>{children}</AnalyticsProvider>;
  };
  const { result } = renderHook(() => useAnalytics(), { wrapper });
  expect(result.current.logEvent).not.toBeNull();
});

test('should provide a custom analytics provider', () => {
  const custom = {
    logEvent: jest.fn()
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return <AnalyticsProvider analytics={custom}>{children}</AnalyticsProvider>;
  };

  const { result } = renderHook(() => useAnalytics(), { wrapper });

  act(() => {
    result.current.logEvent('foo');
  });
  expect(custom.logEvent).toBeCalledWith('foo');
});
