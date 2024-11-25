import { HPMember } from '@hpapp/features/app/user';

export type HPSortNewConfig = {
  numMembersToSelect: number;
};

export type HPSortNewRoundState = {
  numCompared: number;
  startTime: Date;
  endTime: Date | null;
};

export class HPSortMemberNode {
  constructor(public member: HPMember) {
    this.member = member;
  }
  public getId() {
    return this.member.id;
  }
}
