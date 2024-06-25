import Text from '@hpapp/features/common/components/Text';
import { FontSize, Spacing } from '@hpapp/features/common/constants';
import { ColorScheme, useColor } from '@hpapp/features/settings/context/theme';
import { EventTicket } from '@hpapp/features/upfc/scraper';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const StatusColorScheme: Record<string, ColorScheme> = {
  申込済: 'success',
  入金待: 'error',
  入金済: 'primary',
  入金忘: 'disabled',
  落選: 'disabled',
  不明: 'warning'
};

export type UPFCApplicationStatusLabelProps = {
  ticket: EventTicket;
};

export default function UPFCApplicationStatusLabel({ ticket }: UPFCApplicationStatusLabelProps) {
  const [color, contrast] = useColor(StatusColorScheme[ticket.status]);
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Text style={[styles.text, { color: contrast }]}>{ticket.status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: Spacing.XSmall,
    paddingRight: Spacing.XSmall,
    paddingTop: Spacing.XXSmall,
    paddingBottom: Spacing.XXSmall,
    width: 50,
    alignItems: 'center'
  },
  text: {
    fontSize: FontSize.XSmall
  }
});
