export type HPSortResultMemberRank = {
  memberId: string;
  rank: number;
  previousRank?: number;
};

/**
 * compare two member rank arrayn and return the result with previous rank
 * @param current current member rank array
 * @param previous previous member rank array
 * @returns current member rank array with previous rank
 */
export function compareMemberRankDiff(
  current: HPSortResultMemberRank[],
  previous?: HPSortResultMemberRank[]
): HPSortResultMemberRank[] {
  const previousMap = previous?.reduce((a, v, i) => {
    a.set(v.memberId, v.rank);
    return a;
  }, new Map<string, number>());

  return current.map((v, i) => {
    return {
      ...v,
      previousRank: previousMap?.get(v.memberId)
    };
  });
}

type SortHistoryRecords = readonly {
  readonly artistId: number;
  readonly memberId: number;
  readonly memberKey: string;
  readonly point: number | null | undefined;
  readonly rank: number | null | undefined;
}[];

/**
 * convert graphql sort history records to member rank array
 * @param records graphql sort history records
 * @returns member rank array
 */
export function sortRecordsToMemberRank(records: SortHistoryRecords): HPSortResultMemberRank[] {
  let rank = 1;
  return records
    .filter((r) => r !== null)
    .map((r, idx) => {
      if (r.rank) {
        return {
          memberId: r.memberId.toString(),
          rank: r.rank
        };
      }
      if (idx >= 1) {
        if (records[idx - 1].point !== r.point) {
          rank = idx;
        }
      }
      return {
        memberId: r.memberId.toString(),
        rank
      };
    });
}
