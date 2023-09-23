import { useMemo } from "react";
import { FlatList, StyleSheet } from "react-native";
import { HPMember, useHelloProject } from "@hpapp/contexts/serviceroot";
import GroupedViewListItem from "@hpapp/features/artist/GroupedViewListItem";
import { getAcademicYear } from "@hpapp/foundation/date";

export default function ByAgeView() {
  const hp = useHelloProject();
  const members = hp.useMembers(false);
  const sorted = useMemo(() => {
    return [...members].sort((m1, m2) => {
      const d1 = new Date(m1.dateOfBirth).getTime();
      const d2 = new Date(m2.dateOfBirth).getTime();
      if (d1 == d2) {
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
        v: Array<{
          academicYear: string;
          members: Array<HPMember>;
        }>,
        c: HPMember
      ) => {
        const academicYear = getAcademicYear(c.dateOfBirth);
        if (v.length === 0 || v[v.length - 1].academicYear !== academicYear) {
          v.push({
            academicYear,
            members: [c],
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
      data={grouped}
      keyExtractor={(g) => g.academicYear}
      renderItem={(item) => {
        return (
          <GroupedViewListItem
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
