import { shuffle } from '@hpapp/foundation/object';

import HPSortBase, { HPSortProgress, HPSortResult } from './HPSortBase';

export interface HPSortTopologicalSortNode {
  getId(): string;
}

export default class HPSortTopologicalSort<T extends HPSortTopologicalSortNode> implements HPSortBase<T> {
  private list: T[];
  private map: Map<string, T>;
  private numCompared: number;
  private numCompares: number;
  private randomize: boolean;
  private comparable: T[] | null = null;

  // a graph that maintains the comparison result. If a wins b, then we add an eddge from a to b
  private graph: Map<string, Set<string>>;
  // a set of pairs of which user select "tie"
  private ties: Map<string, Set<string>>;
  // record which ids are already compared yet
  private compared: Map<string, Set<string>>;

  constructor(list: T[], numCompares = 4, randomize = false) {
    this.list = list;
    this.map = new Map(list.map((v) => [v.getId(), v]));
    this.graph = new Map(list.map((v) => [v.getId(), new Set<string>()]));
    this.ties = new Map(list.map((v) => [v.getId(), new Set<string>()]));
    this.compared = new Map(list.map((v) => [v.getId(), new Set<string>()]));
    this.numCompared = 0;
    this.randomize = randomize;
    this.numCompares = numCompares;
    this.updateComparable();
  }

  public select(...winnerIdx: number[]) {
    const comprable = this.comparable;
    if (comprable === null) {
      return;
    }
    if (winnerIdx.length === 0 || comprable.length === winnerIdx.length) {
      this.tie();
      return;
    }
    const loserIdx = comprable.map((v, idx) => idx).filter((idx) => !winnerIdx.includes(idx));
    winnerIdx.forEach((widx) => {
      loserIdx.forEach((lidx) => {
        this.addEdge(comprable[widx], comprable[lidx]);
      });
    });
    this.numCompared++;
    this.updateComparable();
  }

  private addEdge(winner: T, loser: T) {
    if (this.graph.get(winner.getId())!.has(loser.getId())) {
      // already have winner => loser edge
      return;
    }
    this.graph.get(winner.getId())!.add(loser.getId());
    this.compared.get(winner.getId())!.add(loser.getId());
    this.compared.get(loser.getId())!.add(winner.getId());

    // Transitive law
    // winner > loser, loser > loserOfLoser    : => winner > loserOfLoser
    for (const loserOfLoser of this.graph.get(loser.getId())!) {
      this.addEdge(winner, this.map.get(loserOfLoser)!);
    }
    // winner > losser, winner > winnerOfWinner: => winnerOfWinner > loser
    for (const winnerOfWinner of Array.from(this.graph.keys())) {
      if (this.graph.get(winnerOfWinner)!.has(winner.getId())) {
        this.addEdge(this.map.get(winnerOfWinner)!, loser);
      }
    }

    // winner > loser, loser = v: => winner
    for (const v of this.ties.get(loser.getId())!) {
      this.addEdge(winner, this.map.get(v)!);
    }
    // winner > loswer, winer = v : => v > loser
    for (const v of this.ties.get(winner.getId())!) {
      this.addEdge(this.map.get(v)!, loser);
    }
  }

  public tie() {
    const comparable = this.comparable;
    if (comparable === null) {
      return;
    }
    for (const v1 of comparable) {
      for (const v2 of comparable) {
        if (v1.getId() !== v2.getId()) {
          this.addTies(v1, v2);
        }
      }
    }
    this.numCompared++;
    this.updateComparable();
  }

  private addTies(v1: T, v2: T) {
    if (!this.ties.get(v1.getId())!.has(v2.getId())) {
      this.ties.get(v1.getId())!.add(v2.getId());
      this.compared.get(v1.getId())!.add(v2.getId());
      // Transitive law
      // v1 == v2, v2 == v3: => v1 == v3
      for (const v3 of this.ties.get(v2.getId())!) {
        this.addTies(v1, this.map.get(v3)!);
      }
    }
    if (!this.ties.get(v2.getId())!.has(v1.getId())) {
      this.ties.get(v2.getId())!.add(v1.getId());
      this.compared.get(v2.getId())!.add(v1.getId());
      // Transitive law
      // v1 == v2, v1 == v3: => v2 == v3
      for (const v3 of this.ties.get(v1.getId())!) {
        this.addTies(v2, this.map.get(v3)!);
      }
    }
  }

  public getComparable(): T[] | null {
    return this.comparable;
  }

  public getProgress(): HPSortProgress {
    let numerator = 0;
    let denominator = 0;
    for (const [, v] of this.compared.entries()) {
      denominator += this.list.length - 1; // total possible comparisons
      numerator += v.size; // already compared
    }
    return {
      numerator,
      denominator
    };
  }

  /**
   * getNumCompared returns the number of comparisons made so far.
   * @returns the number of comparisons made so far.
   */
  public getNumCompared(): number {
    return this.numCompared;
  }

  public getResult(): HPSortResult<T> {
    const sorted = this.topologicalSort();
    let rank = 1;
    return sorted.map((v, idx) => {
      if (idx > 0) {
        const prev = sorted[idx - 1];
        if (!this.ties.get(prev.getId())!.has(v.getId())) {
          // increment the rank to idx+1 only when the current is not tied with the previous.
          rank = idx + 1;
        }
      }
      return { value: v, rank };
    });
  }

  /**
   * topologicalSort returns the sorted list of T based on the current comparison result.
   */
  private topologicalSort(): T[] {
    // we sort ids from the graph and ties, then generate T[] based on the sorted ids.
    const inDegree = new Map<string, number>();
    const result: string[] = [];
    const queue: string[] = [];

    for (const [node] of this.graph.entries()) {
      inDegree.set(node, 0);
    }
    for (const edges of this.graph.values()) {
      for (const edge of edges) {
        inDegree.set(edge, (inDegree.get(edge) || 0) + 1);
      }
    }

    for (const [node, degree] of inDegree.entries()) {
      if (degree === 0) queue.push(node);
    }

    while (queue.length > 0) {
      const node = queue.shift()!;
      result.push(node);

      for (const neighbor of this.graph.get(node)!) {
        inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      }
    }

    const finalResult = new Set<string>(result);
    for (const [node, ties] of this.ties.entries()) {
      if (finalResult.has(node)) {
        for (const tie of ties) {
          if (!finalResult.has(tie)) result.push(tie);
        }
      }
    }

    return result.map((id) => this.map.get(id)!);
  }

  private findUncompared(): T[] {
    const added = new Set<string>();
    const uncompared: T[] = [];
    const numCompares = this.numCompares;

    const randomized = this.randomize ? shuffle(this.list) : this.list;
    for (const v1 of randomized) {
      if (added.has(v1.getId())) {
        continue;
      }
      if (this.compared.get(v1.getId())!.size < randomized.length - 1) {
        // v1 does not copmare with all other nodes
        if (uncompared.length > 0) {
          // if any of uncompared node has a comparison with v1, then we should not add v1 to the list.
          let shouldAdd = true;
          for (const v2 of uncompared) {
            if (this.compared.get(v1.getId())!.has(v2.getId()) || this.compared.get(v2.getId())!.has(v1.getId())) {
              shouldAdd = false;
            }
          }
          if (!shouldAdd) {
            continue;
          }
        }
        uncompared.push(v1);
        added.add(v1.getId());
        if (!added.has(v1.getId())) {
          if (uncompared.length >= numCompares) {
            return uncompared;
          }
        }

        for (const v2 of randomized) {
          if (v1.getId() === v2.getId()) {
            continue;
          }
          if (this.compared.get(v1.getId())!.has(v2.getId()) || this.compared.get(v2.getId())!.has(v1.getId())) {
            continue;
          }
          if (added.has(v2.getId())) {
            continue;
          }
          // v2 does not compare with v1, so add it.
          uncompared.push(v2);
          added.add(v2.getId());

          if (uncompared.length >= numCompares) {
            return uncompared;
          }
        }
      }
    }
    return uncompared;
  }

  private updateComparable() {
    const uncompared = this.findUncompared();
    if (uncompared.length <= 1) {
      this.comparable = null;
      return;
    }
    this.comparable = uncompared;
    return this.comparable;
  }
}
