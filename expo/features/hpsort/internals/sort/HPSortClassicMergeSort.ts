import HPSortBase, { HPSortProgress, HPSortResult } from './HPSortBase';

/**
 * HPSortMergeClassic is a class to emulate the sorting process in a classic manner (Simple two comparison merge sort)
 */
export default class HPSortClassicMergeSort<T> implements HPSortBase<T> {
  private targetSet: T[];

  private lstMember: number[][];
  private parent: number[];
  private rec: number[];
  private recIdx: number;
  private equal: (number | null)[];

  private idxLeft: number;
  private headLeft: number;
  private idxRight: number;
  private headRight: number;
  private numProgress: number;
  private numTotal: number;

  private numCompared: Readonly<number>;
  private isFinished: Readonly<boolean>;

  constructor(targetSet: T[]) {
    const lstMember: number[][] = [];
    const parent: number[] = [];
    let numTotal = 0;
    let n = 0;
    lstMember[n] = targetSet.map((_, i: number) => i);
    parent[n] = -1;
    n++;
    for (let i = 0; i < lstMember.length; i++) {
      if (lstMember[i].length >= 2) {
        const pivot = Math.ceil(lstMember[i].length / 2);
        lstMember[n] = lstMember[i].slice(0, pivot);
        numTotal += lstMember[n].length;
        parent[n] = i;
        n++;
        lstMember[n] = lstMember[i].slice(pivot, lstMember[i].length);
        numTotal += lstMember[n].length;
        parent[n] = i;
        n++;
      }
    }

    this.targetSet = targetSet;
    this.lstMember = lstMember;
    this.parent = parent;
    this.rec = targetSet.map((v) => 0);
    this.recIdx = 0;
    this.equal = targetSet.map((v) => null);

    this.idxLeft = lstMember.length - 2;
    this.idxRight = lstMember.length - 1;
    this.headLeft = 0;
    this.headRight = 0;
    this.numCompared = 0;
    this.numProgress = 0;
    this.numTotal = numTotal;
    this.isFinished = false;
  }

  public getComparable(): T[] | null {
    if (this.isFinished) {
      return null;
    }
    return [this.targetSet[this.getLeft()], this.targetSet[this.getRight()]];
  }

  private getLeft() {
    return this.lstMember[this.idxLeft][this.headLeft];
  }

  private getRight() {
    return this.lstMember[this.idxRight][this.headRight];
  }

  public get progress() {
    if (this.isFinished) {
      return 100;
    }
    return Math.floor((this.numProgress * 100) / this.numTotal);
  }

  select(...winnerIdx: number[]): void {
    if (winnerIdx.length === 2) {
      this.selectInternal('draw');
      return;
    } else if (winnerIdx.length === 1) {
      if (winnerIdx[0] === 0) {
        this.selectInternal('left');
        return;
      } else if (winnerIdx[0] === 1) {
        this.selectInternal('right');
        return;
      }
    } else if (winnerIdx.length === 0) {
      this.tie();
      return;
    }
    throw new Error('Invalid winnerIdx');
  }

  tie(): void {
    this.selectInternal('draw');
  }

  getNumCompared(): number {
    return this.numCompared;
  }
  getProgress(): HPSortProgress {
    return {
      numerator: this.numProgress,
      denominator: this.numTotal
    };
  }

  private selectInternal(flag: 'left' | 'right' | 'draw') {
    switch (flag) {
      case 'left':
        this.rec[this.recIdx] = this.getLeft();
        this.headLeft++;
        this.recIdx++;
        this.numProgress++;
        while (this.equal[this.rec[this.recIdx - 1]] !== null) {
          this.rec[this.recIdx] = this.getLeft();
          this.headLeft++;
          this.recIdx++;
          this.numProgress++;
        }
        break;
      case 'right':
        this.rec[this.recIdx] = this.getRight();
        this.headRight++;
        this.recIdx++;
        this.numProgress++;
        while (this.equal[this.rec[this.recIdx - 1]] !== null) {
          this.rec[this.recIdx] = this.getRight();
          this.headRight++;
          this.recIdx++;
          this.numProgress++;
        }
        break;
      case 'draw':
        this.rec[this.recIdx] = this.getLeft();
        this.headLeft++;
        this.recIdx++;
        this.numProgress++;
        while (this.equal[this.rec[this.recIdx - 1]] !== null) {
          this.rec[this.recIdx] = this.getLeft();
          this.headLeft++;
          this.recIdx++;
          this.numProgress++;
        }
        this.equal[this.rec[this.recIdx - 1]] = this.getRight();
        this.rec[this.recIdx] = this.getRight();
        this.headRight++;
        this.recIdx++;
        this.numProgress++;
        while (this.equal[this.rec[this.recIdx - 1]] !== null) {
          this.rec[this.recIdx] = this.getRight();
          this.headRight++;
          this.recIdx++;
          this.numProgress++;
        }
        break;
    }

    if (
      this.headLeft < this.lstMember[this.idxLeft].length &&
      this.headRight === this.lstMember[this.idxRight].length
    ) {
      // no more on right
      while (this.headLeft < this.lstMember[this.idxLeft].length) {
        this.rec[this.recIdx] = this.lstMember[this.idxLeft][this.headLeft];
        this.headLeft++;
        this.recIdx++;
        this.numProgress++;
      }
    } else if (
      this.headLeft === this.lstMember[this.idxLeft].length &&
      this.headRight < this.lstMember[this.idxRight].length
    ) {
      // no more on left
      while (this.headRight < this.lstMember[this.idxRight].length) {
        this.rec[this.recIdx] = this.lstMember[this.idxRight][this.headRight];
        this.headRight++;
        this.recIdx++;
        this.numProgress++;
      }
    }

    // if no more on both
    if (
      this.headLeft === this.lstMember[this.idxLeft].length &&
      this.headRight === this.lstMember[this.idxRight].length
    ) {
      for (let i = 0; i < this.lstMember[this.idxLeft].length + this.lstMember[this.idxRight].length; i++) {
        this.lstMember[this.parent[this.idxLeft]][i] = this.rec[i];
      }
      this.lstMember.pop();
      this.lstMember.pop();
      this.idxLeft = this.idxLeft - 2;
      this.idxRight = this.idxRight - 2;
      this.headLeft = 0;
      this.headRight = 0;

      this.rec = this.targetSet.map((v) => 0);
      this.recIdx = 0;
    }

    if (this.idxLeft < 0) {
      this.isFinished = true;
    }
    this.numCompared++;
  }

  public getResult(): HPSortResult<T> {
    const resultSet = this.targetSet.map((v, i) => {
      return {
        value: v,
        idx: i,
        rank: i + 1,
        score: (i + 1) * 3
      };
    });
    // if (!this.isFinished) {
    //   // for debugging purpose
    //   return resultSet;
    // }
    let numEquals = 0;
    let score = (resultSet.length - 1) * 3;
    for (let i = 0; i < resultSet.length; i++) {
      numEquals = 0;
      if (i < resultSet.length - 1) {
        for (let j = i; this.equal[this.lstMember[0][j]] === this.lstMember[0][j + 1]; j++) {
          numEquals++;
        }
      }
      resultSet[this.lstMember[0][i]].score = score - numEquals * 2;
      if (i < resultSet.length - 1) {
        for (let j = i; this.equal[this.lstMember[0][j]] === this.lstMember[0][j + 1]; j++) {
          i++;
          resultSet[this.lstMember[0][i]].score = score - numEquals * 2;
        }
      }
      score -= 3 * (numEquals + 1);
    }

    resultSet.sort((a, b) => {
      const diff = b.score - a.score;
      if (diff !== 0) {
        return diff;
      }
      return a.idx - b.idx;
    });

    for (let i = 0; i < resultSet.length; i++) {
      const ranking = i + 1;
      resultSet[i].rank = ranking;
      while (i < resultSet.length - 1 && resultSet[i].score === resultSet[i + 1].score) {
        i++;
        resultSet[i].rank = ranking;
      }
    }
    return resultSet;
  }
}
