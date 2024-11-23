import HPSortTopologicalSort, { HPSortTopologicalSortNode } from './HPSortTopologicalSort';

class NumberNode implements HPSortTopologicalSortNode {
  constructor(
    public value: number,
    private id: number
  ) {}
  getId() {
    return this.id.toString();
  }
  toString() {
    return this.value.toString();
  }
  static fromNumber(value: number, id: number) {
    return new NumberNode(value, id);
  }
}

describe('HPSortTopologicalSort', () => {
  // we use number as T to test sort functionality.

  it('minimum case', () => {
    const dataset = [4, 8].map(NumberNode.fromNumber);
    const s = new HPSortTopologicalSort(dataset);
    const c = s.getComparable()!;
    expect(c[0].toString()).toEqual('4');
    expect(c[1].toString()).toEqual('8');
    s.select(1);
    const next = s.getComparable();
    expect(next).toBeNull();
    const values = s.getResult().map((v) => v.value.value);
    expect(values).toEqual([8, 4]);
  });

  it('sample', () => {
    // [8,4,3,1,4] => [8,4,4,3,1]
    const dataset = [8, 4, 3, 1, 4].map(NumberNode.fromNumber);
    const s = new HPSortTopologicalSort(dataset);
    let c = s.getComparable()!;
    expect(c.map((v) => v.toString())).toEqual(['8', '4', '3', '1']);
    s.select(0); // choose 8 at the first
    c = s.getComparable()!;
    expect(c.map((v) => v.toString())).toEqual(['8', '4']);
    s.select(0); // choose 8 at the first
    c = s.getComparable()!;
    expect(c.map((v) => v.toString())).toEqual(['4', '3', '1', '4']);
    s.select(0, 3); // choose 4 at the first and 4 at the last
    c = s.getComparable()!;
    expect(c.map((v) => v.toString())).toEqual(['4', '4']);
    s.tie();
    c = s.getComparable()!;
    expect(c.map((v) => v.toString())).toEqual(['3', '1']);
    s.select(0); // choose 3 at the first
    c = s.getComparable()!;
    expect(c).toBeNull();

    // // then graph is built so we can get the sort result.
    const values = s.getResult().map((v) => v.value.value);
    expect(values).toEqual([8, 4, 4, 3, 1]);

    const ids = s.getResult().map((v) => v.value.getId());
    expect(ids).toEqual(['0', '1', '4', '2', '3']);
  });

  it('random', () => {
    // try to sort 70 random numbers for 100 times
    let totalCompared = 0;
    let maxCompared = 0;
    let minCompared = 0;
    for (let i = 0; i < 100; i++) {
      const size = 70;
      const dataset = new Array(size).fill(0, 0, size).map((v, idx) => {
        return Math.floor(Math.random() * size);
      });
      const s = new HPSortTopologicalSort(dataset.map(NumberNode.fromNumber), 4);
      let count = 0;
      while (true) {
        const comparison = s.getComparable();
        if (comparison === null) {
          break;
        }
        let max = comparison[0].value;
        let winners = [0];
        for (let i = 1; i < comparison.length; i++) {
          if (comparison[i].value > max) {
            max = comparison[i].value;
            winners = [i];
          } else if (comparison[i].value === max) {
            winners.push(i);
          }
        }

        if (winners.length === comparison.length) {
          s.tie();
        } else {
          s.select(...winners);
        }
        count++;
      }
      const values = s.getResult().map((v) => v.value.value);
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
