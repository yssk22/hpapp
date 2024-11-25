import { useThemeColor } from '@hpapp/features/app/theme';
import { FontSize, Spacing } from '@hpapp/features/common/constants';
import { t } from '@hpapp/system/i18n';
import { StyleSheet, View, Text } from 'react-native';

export type HPSortNewRoundHeaderProps = {
  round: number;
  current: number;
  total: number;
};
export default function HPSortNewRoundHeader({ round, current, total }: HPSortNewRoundHeaderProps) {
  const progress = (current * 100.0) / total;
  const [primary, primaryContrast] = useThemeColor('primary');
  const [secondary] = useThemeColor('secondary');
  return (
    <View style={styles.container}>
      <Text style={[styles.round, { color: secondary }]}>
        {t('Round %{round}', {
          round
        })}
      </Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: primary }]} />
        <View style={styles.textbox}>
          <Text style={[styles.text, { color: primaryContrast }]}>{progress.toFixed(2)}%</Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    marginLeft: Spacing.Medium,
    marginTop: Spacing.Small,
    marginBottom: Spacing.Small,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30
  },
  round: {
    fontSize: FontSize.XLarge,
    textAlign: 'center'
  },
  progressBarContainer: {
    flex: 1,
    marginLeft: Spacing.Medium,
    marginRight: Spacing.Medium
  },
  progressBar: {
    height: 30
  },
  textbox: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    textAlign: 'center',
    fontSize: FontSize.Small
  }
});
