import { useThemeColor } from '@hpapp/features/app/theme';
import { Text } from '@hpapp/features/common';
import { FontSize, Spacing } from '@hpapp/features/common/constants';
import { t } from '@hpapp/system/i18n';
import { Button } from '@rneui/themed';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context/src/SafeAreaContext';

export type OnboardingStepProps = {
  title: string;
  description: string;
  backText?: string;
  nextText?: string;
  onBackPress?: () => void;
  onNextPress?: () => void;
  element: React.ReactNode;
};

export default function OnboardingStep({
  title,
  description,
  backText = t('Back'),
  nextText = t('Next'),
  onBackPress,
  onNextPress,
  element
}: OnboardingStepProps) {
  const [secondary] = useThemeColor('secondary');
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container]}>
      <View style={styles.content}>
        <View style={styles.title}>
          <Text style={{ color: secondary, fontSize: FontSize.Large, fontWeight: 'bold' }}>{title}</Text>
        </View>
        <ScrollView style={styles.element}>
          <View style={styles.description}>
            <Text>{description}</Text>
          </View>
          {element}
          <View style={[styles.buttonGroup, { paddingBottom: insets.bottom }]}>
            {onBackPress && (
              <Button containerStyle={styles.button} color={secondary} onPress={onBackPress}>
                {backText}
              </Button>
            )}

            <Button containerStyle={styles.button} color={secondary} onPress={onNextPress}>
              {nextText}
            </Button>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    padding: Spacing.Small
  },
  description: {
    padding: Spacing.Small
  },
  content: {
    flexGrow: 1
  },
  element: {
    flex: 1
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: Spacing.Large
  },
  button: {
    flexGrow: 1,
    margin: Spacing.XXSmall
  }
});
