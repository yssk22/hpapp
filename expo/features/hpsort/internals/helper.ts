import { HPSortResult } from './types';

export function buildHPSortResult(current: string[], previous?: string[]): HPSortResult {
  const previousMap = previous?.reduce((a, v, i) => {
    a.set(v, i);
    return a;
  }, new Map<string, number>());

  return current.map((memberId, i) => {
    return {
      memberId,
      previousRank: previousMap?.get(memberId)
    };
  });
}
