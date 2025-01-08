import { useThemeColor } from '@hpapp/features/app/theme';
import { NoImage, ExternalImage, Text } from '@hpapp/features/common';
import { FontSize, Spacing } from '@hpapp/features/common/constants';
import { ListItem } from '@hpapp/features/common/list';
import { Divider } from '@rneui/base';
import { useState } from 'react';
import { Dimensions, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import ElineupMallCartMutationButton from './ElineupMallCartMutationButton';

export type ElineupMallListItemProps = {
  permalink: string;
  name: string;
  category?: string;
  imageUrl?: string;
  enableCartMutation?: boolean;
  metadata?: {
    name: string;
    value: string;
  }[];
};

export default function ElineupMallListItem({
  permalink,
  name,
  category,
  metadata,
  imageUrl,
  enableCartMutation
}: ElineupMallListItemProps) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [color, contrast] = useThemeColor('primary');
  return (
    <>
      <Divider />
      <ListItem
        containerStyle={styles.container}
        rightContent={
          <View style={styles.right}>
            {imageUrl && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(true);
                  }}
                >
                  <ExternalImage
                    uri={imageUrl}
                    style={styles.image}
                    width={tuhmbnailImageSize}
                    height={tuhmbnailImageSize}
                    cachePolicy="memory-disk"
                  />
                </TouchableOpacity>
                <Modal visible={isModalVisible} animationType="fade" transparent>
                  <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                      <View style={{ flex: 1 }} />
                    </TouchableWithoutFeedback>
                    <View style={styles.modalImageContainer}>
                      <ExternalImage
                        uri={imageUrl}
                        style={styles.modalImage}
                        width={modalImageSize}
                        height={modalImageSize}
                        cachePolicy="memory-disk"
                      />
                    </View>
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                      <View style={{ flex: 1 }} />
                    </TouchableWithoutFeedback>
                  </View>
                </Modal>
              </>
            )}
            {imageUrl === undefined && <NoImage width={tuhmbnailImageSize} height={tuhmbnailImageSize} />}
            {enableCartMutation && <ElineupMallCartMutationButton link={permalink} />}
          </View>
        }
      >
        <View style={styles.nameAndMetadata}>
          {category && (
            <View style={styles.metadataRowCategory}>
              <Text style={[styles.categoryText, { color, backgroundColor: contrast }]}>{category}</Text>
            </View>
          )}
          <Text style={styles.name}>{name}</Text>
          <View style={styles.metadata}>
            {metadata?.map((m) => (
              <View style={styles.metadataRow} key={m.name}>
                <Text style={styles.metadataLabel} numberOfLines={1} ellipsizeMode="tail">
                  {m.name}
                </Text>
                <Text style={styles.metadataValue} numberOfLines={1} ellipsizeMode="tail">
                  {m.value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ListItem>
    </>
  );
}

const modalImageSize = Dimensions.get('window').width * 0.9;
const tuhmbnailImageSize = 160;

const styles = StyleSheet.create({
  container: {
    minHeight: 180,
    padding: Spacing.Small
  },
  right: {},
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalImage: {
    width: modalImageSize,
    height: modalImageSize
  },
  image: {
    width: tuhmbnailImageSize,
    height: tuhmbnailImageSize
  },
  nameAndMetadata: {
    flexDirection: 'column',
    marginRight: Spacing.Medium,
    flexGrow: 1
  },
  name: {
    flexGrow: 1,
    fontWeight: 'bold'
  },
  metadata: {
    flexGrow: 1
  },
  metadataRow: {
    flexDirection: 'row'
  },
  metadataRowCategory: {
    alignItems: 'flex-start'
  },
  metadataLabel: {
    width: 80,
    textAlign: 'right',
    marginRight: Spacing.Small,
    fontSize: FontSize.Small
  },
  metadataValue: {},
  dateString: {},
  categoryText: {
    fontSize: FontSize.Small,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: Spacing.XSmall
  }
});
