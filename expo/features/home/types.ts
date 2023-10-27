interface HomeTabSection<T> {
  renderSectionHeader(): JSX.Element;
  // DO NOT use renderItem as it's reservered by SectionList.
  // we have to use renderItem={(o) => { o.section.renderListItem(o)}} to use the bound members.
  renderListItem(v: { item: T; index: number }): JSX.Element;
  data: T[];
}

export { HomeTabSection };
