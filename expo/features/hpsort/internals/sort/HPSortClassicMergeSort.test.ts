import HPSortClassicMergeSort from './HPSortClassicMergeSort';

describe('HPSortClassicMergeSort', () => {
  // we use number as T to test sort functionality.

  it('minimum case', () => {
    const dataset = [4, 8];
    const s = new HPSortClassicMergeSort(dataset);
    let c = s.getComparable();
    expect(c).toEqual([4, 8]);
    s.select(1);
    c = s.getComparable();
    expect(c).toBeNull();
    const values = s.getResult().map((v) => v.value);
    expect(values).toEqual([8, 4]);
  });

  it('should sort', () => {
    const dataset = [8, 4, 3, 1, 4];
    const s = new HPSortClassicMergeSort(dataset);
    // [8] [4] [3] [1] [4]
    let c = s.getComparable();
    expect(c).toEqual([8, 4]);
    s.select(0);
    // [8, 4] [3] [1] [4]
    c = s.getComparable();
    expect(c).toEqual([1, 4]);
    s.select(1);
    // [8, 4] [3] [4, 1]
    c = s.getComparable();
    expect(c).toEqual([8, 3]);
    s.select(0);
    // [8, (4,3)] [4, 1]
    c = s.getComparable();
    expect(c).toEqual([4, 3]);
    s.select(0);
    // [8, 4, 3] [4, 1]
    c = s.getComparable();
    expect(c).toEqual([8, 4]);
    s.select(0);
    // [8, (4,4), 3] [1]
    c = s.getComparable();
    expect(c).toEqual([4, 4]);
    s.tie();
    // [8, 4, 4, 3] [1]
    c = s.getComparable();
    expect(c).toEqual([3, 1]);
    s.select(0);
    // [8, 4, 4, 3, 1]
    c = s.getComparable();
    expect(c).toBeNull();
    const result = s.getResult();
    const values = result.map((r) => r.value);
    const sorted = [...dataset].sort((a, b) => b - a);
    expect(values).toEqual(sorted);
  });

  it('random', () => {
    let totalCompared = 0;
    let maxCompared = 0;
    let minCompared = 0;
    for (let i = 0; i < 100; i++) {
      const size = 70;
      const dataset = new Array(size).fill(0, 0, size).map((v) => {
        return Math.floor(Math.random() * size);
      });
      const s = new HPSortClassicMergeSort(dataset);
      let count = 0;
      while (true) {
        const c = s.getComparable();
        if (c === null) {
          break;
        }
        if (c[0] > c[1]) {
          s.select(0);
        } else if (c[0] < c[1]) {
          s.select(1);
        } else {
          s.tie();
        }
        count++;
      }
      const result = s.getResult();
      const values = result.map((r) => r.value);
      const sorted = [...dataset].sort((a, b) => b - a);
      expect(values).toEqual(sorted);
      expect(s.getNumCompared()).toEqual(count);
      totalCompared += count;
      if (maxCompared < count) {
        maxCompared = count;
      }
      if (minCompared === 0 || minCompared > count) {
        minCompared = count;
      }
    }
    // we want to see the average comparison count to see how Sort works.
    // eslint-disable-next-line no-console
    console.log('Average comparison count:', totalCompared / 100);
    // eslint-disable-next-line no-console
    console.log('Max comparison count:', maxCompared);
    // eslint-disable-next-line no-console
    console.log('Min comparison count:', minCompared);
  });
});
