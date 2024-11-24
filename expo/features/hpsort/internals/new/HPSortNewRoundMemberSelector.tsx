import { useThemeColor } from '@hpapp/features/app/theme';
import { ExternalImage, Text } from '@hpapp/features/common';
import { Spacing } from '@hpapp/features/common/constants';
import { t } from '@hpapp/system/i18n';
import { Button, Icon } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, View } from 'react-native';

export type HPSortNewRoundMemberSelectorProps = {
  images: string[];
  onSelect: (selections: number[]) => void;
};

const size = Dimensions.get('window').width / 3;

export default function HPSortNewRoundMemberSelector({ images, onSelect }: HPSortNewRoundMemberSelectorProps) {
  const [color, contrast] = useThemeColor('secondary');
  const [selections, setSelections] = useState<number[]>([]);
  const description =
    images?.length === 2
      ? t('Tap and select the member you like better.')
      : [
          t('Tap and select one or more members you like and tap next.'),
          t('If you can select all or nothign if you cannot select some.')
        ].join(' ');
  const buttonText = selections.length === 0 || selections.length === images.length ? t('Draw') : t('Next');

  return (
    <View style={styles.container}>
      <View style={styles.description}>
        <Text>{description}</Text>
      </View>
      <View style={styles.imageContainer}>
        {images.map((url, idx) => {
          return (
            <TouchableOpacity
              style={styles.imageTouchable}
              key={url}
              onPress={() => {
                if (images.length === 2) {
                  setSelections([]);
                  onSelect([idx]);
                } else {
                  if (selections.includes(idx)) {
                    setSelections(selections.filter((i) => i !== idx));
                  } else {
                    setSelections([...selections, idx]);
                  }
                }
              }}
            >
              <ExternalImage
                uri={url}
                style={{ width: size, height: size }}
                width={size}
                height={size}
                cachePolicy="disk"
              />
              {selections.includes(idx) && (
                <View style={styles.iconImageSelected}>
                  <Icon name="check-circle" type="font-awesome" color={color} style={{ backgroundColor: contrast }} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      <Button
        style={styles.button}
        title={buttonText}
        type="solid"
        color="secondary"
        onPress={() => {
          setSelections([]);
          onSelect(selections);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  description: {
    margin: Spacing.Small
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  imageTouchable: {
    margin: Spacing.Medium
  },
  iconImageSelected: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    alignItems: 'flex-end'
  },
  button: {
    width: size,
    justifyContent: 'center',
    marginTop: Spacing.XLarge
  }
});
