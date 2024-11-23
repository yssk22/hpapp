export type HPSortProgress = {
  numerator: number;
  denominator: number;
};

export type HPSortResult<T> = {
  value: T;
  rank: number;
}[];

export default interface HPSortBase<T> {
  /**
   * select implements the select logic
   * @param winnerIdx selected winner indexes of values returned by getComparable()
   */
  select(...winnerIdx: number[]): void;

  /**
   * tie implements the tie logic
   */
  tie(): void;

  /**
   * getComparable returns the current comparable set
   */
  getComparable(): T[] | null;

  /**
   * getNumCompared returns the number of comparisons made so far.
   */
  getNumCompared(): number;

  /**
   * getResult returns the sorted result
   */
  getResult(): HPSortResult<T>;

  /**
   * getStats returns the stats of the sorting process
   */
  getProgress(): HPSortProgress;
}
