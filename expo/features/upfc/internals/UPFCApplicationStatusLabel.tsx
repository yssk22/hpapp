import { useThemeColor } from '@hpapp/features/app/theme';
import { Text } from '@hpapp/features/common';
import { FontSize, Spacing } from '@hpapp/features/common/constants';
import { UPFCEventTicket } from '@hpapp/features/upfc/scraper';
import { ThemeColorScheme } from '@hpapp/system/theme';
import { View, StyleSheet } from 'react-native';

const StatusColorScheme: Record<string, ThemeColorScheme> = {
  申込済: 'success',
  入金待: 'error',
  入金済: 'primary',
  入金忘: 'disabled',
  落選: 'disabled',
  不明: 'warning'
};

export type UPFCApplicationStatusLabelProps = {
  ticket: UPFCEventTicket;
};

export default function UPFCApplicationStatusLabel({ ticket }: UPFCApplicationStatusLabelProps) {
  const [color, contrast] = useThemeColor(StatusColorScheme[ticket.status]);
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
