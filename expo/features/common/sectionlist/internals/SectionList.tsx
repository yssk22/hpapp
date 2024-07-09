import { ComponentProps } from 'react';
import { DefaultSectionT, RefreshControl, SectionList as SectionListOrig } from 'react-native';

import SectionListRenderer from './SectionListRenderer';

export type SectionListProps<T> = Omit<
  ComponentProps<typeof SectionListOrig<T, DefaultSectionT>>,
  'sections' | 'renderSectionHeader' | 'renderItem' | 'keyExtractor' | 'refreshCOntrol'
> & {
  sections: SectionListRenderer<T>[];
  isLoading?: boolean;
  reload?: () => void;
};

export default function SectionList<T>({ sections, isLoading, reload, ...props }: SectionListProps<T>) {
  const refreshControl = reload ? (
    <RefreshControl
      refreshing={isLoading ?? false}
      onRefresh={() => {
        reload();
      }}
    />
  ) : (
    <></>
  );
  return (
    <SectionListOrig
      {...props}
      sections={sections}
      keyExtractor={(item, index) => `hometabsectionlist-${index}`}
      renderSectionHeader={({ section }) => {
        return section.renderSectionHeader();
      }}
      renderItem={(o) => {
        return o.section.renderListItem(o);
      }}
      refreshControl={refreshControl}
    />
  );
}
