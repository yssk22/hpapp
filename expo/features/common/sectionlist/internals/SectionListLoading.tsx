import React from 'react';

import SectionListHeader from './SectionListHeader';
import SectionListRenderer from './SectionListRenderer';

export type SectionListLoadingProps = {
  headerText: string;
  body: React.ReactElement;
};

/**
 * SectionListLoading is a special SectionListRenderer that shows a loading indicator with the header.
 */
export default class SectionListLoading implements SectionListRenderer<any> {
  public readonly props: SectionListLoadingProps;
  public readonly data: any[];

  constructor(props: SectionListLoadingProps) {
    this.props = props;
    this.data = [null];
  }

  renderSectionHeader() {
    return <SectionListHeader>{this.props.headerText}</SectionListHeader>;
  }

  renderListItem({ item, index }: { item: any; index: number }) {
    return this.props.body;
  }
}
