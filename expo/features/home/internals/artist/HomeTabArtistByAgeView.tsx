import { HPMember, useMemberList } from '@hpapp/features/app/user';
import { getSchoolGrade } from '@hpapp/foundation/date';
import { useMemo } from 'react';
import { FlatList } from 'react-native';

import HomeTabArtistByAgeViewListItem from './HomeTabArtistByAgeViewListItem';

export default function HomeTabArtistByAgeView() {
  const members = useMemberList(false);
  const sorted = useMemo(() => {
    return [...members].sort((m1, m2) => {
      const d1 = new Date(m1.dateOfBirth).getTime();
      const d2 = new Date(m2.dateOfBirth).getTime();
      if (d1 === d2) {
        return 0;
      } else if (d1 > d2) {
        return 1;
      }
      return -1;
    });
  }, [members]);
  const grouped = useMemo(() => {
    return sorted.reduce(
      (
        v: {
          academicYear: string;
          members: HPMember[];
        }[],
        c: HPMember
      ) => {
        const academicYear = getSchoolGrade(c.dateOfBirth);
        if (v.length === 0 || v[v.length - 1].academicYear !== academicYear) {
          v.push({
            academicYear,
            members: [c]
          });
          return v;
        }
        v[v.length - 1].members.push(c);
        return v;
      },
      []
    );
  }, [sorted]);
  return (
    <FlatList
      testID="HomeTabArtistByAgeView.FlatList"
      data={grouped}
      keyExtractor={(g) => g.academicYear}
      renderItem={(item) => {
        return (
          <HomeTabArtistByAgeViewListItem
            key={item.item.academicYear}
            label={item.item.academicYear}
            members={item.item.members}
          />
        );
      }}
      maxToRenderPerBatch={1}
    />
  );
}
