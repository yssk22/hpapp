import { useAssetContent } from '@hpapp/features/common';
import { defineScreen } from '@hpapp/features/common/stack';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import WebView from 'react-native-webview';

export type ContentScreenProps = {
  title: string;
  moduleId: number;
};

export default defineScreen('/content/', function ContentScreen({ title, moduleId }: ContentScreenProps) {
  const navigation = useNavigation();
  const [content] = useAssetContent(moduleId);
  useEffect(() => {
    navigation.setOptions({ title });
  }, [title]);
  return (
    <>
      <WebView source={{ html: content }} />
    </>
  );
});
