import React from "react";
import { View } from "react-native";
import { Button } from "@rneui/themed";
import WebView from "react-native-webview";
import useAssetContent from "@hpapp/features/common/hooks/asset";
import { t } from "@hpapp/system/i18n";
import { useColor } from "@hpapp/contexts/settings/theme";
import { Header } from "@rneui/base";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ConsentGate({
  title,
  moduleId,
  pass,
  showHeader,
  children,
  onConsent,
}: {
  title: string;
  moduleId: number;
  pass: boolean;
  showHeader?: boolean;
  children: React.ReactNode;
  onConsent: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [color, contrastColor] = useColor("primary");
  const [content, isLoading] = useAssetContent(moduleId);
  if (pass) {
    return <>{children}</>;
  }
  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      {showHeader && (
        <Header
          placement="left"
          centerComponent={{
            text: title,
            style: {
              color: contrastColor,
            },
          }}
        />
      )}
      <>
        <WebView source={{ html: content }} />
        <Button
          title={t("I agree")}
          onPress={onConsent}
          loading={isLoading}
          disabled={isLoading}
        />
      </>
    </View>
  );
}
