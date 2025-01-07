import { useThemeColor } from '@hpapp/features/app/theme';
import { IconSize } from '@hpapp/features/common/constants';
import { Icon } from '@rneui/themed';
import { ActivityIndicator } from 'react-native';

import { useElineupMall } from './ElineupMallProvider';

export default function ElineupMallStatusIcon() {
  const elineupmall = useElineupMall();
  const [successColor] = useThemeColor('success');
  const [errorColor] = useThemeColor('error');
  const [disabledColor] = useThemeColor('disabled');
  switch (elineupmall.status) {
    case 'ready':
      return <Icon color={successColor} name="check-circle" type="fontawesome" size={IconSize.Small} />;
    case 'error_not_opted_in':
      return <Icon color={disabledColor} name="settings" type="ionicons" size={IconSize.Small} />;
    case 'error_upfc_is_empty':
      return <Icon color={disabledColor} name="settings" type="ionicons" size={IconSize.Small} />;
    case 'error_unknown':
      return <Icon color={errorColor} name="error" type="material-icons" size={IconSize.Small} />;
    case 'error_authenticate':
      return <Icon color={errorColor} name="error" type="material-icons" size={IconSize.Small} />;
    default:
      return <ActivityIndicator color={successColor} size="small" />;
  }
}
