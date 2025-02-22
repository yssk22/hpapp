import { useNavigation } from '@hpapp/features/common/stack';
import ElineupMallWebViewScreen from '@hpapp/features/elineupmall/ElineupMallWebViewScreen';
import * as date from '@hpapp/foundation/date';
import { isEmpty } from '@hpapp/foundation/string';
import { t } from '@hpapp/system/i18n';
import { Button } from '@rneui/themed';

import { useElineupMall } from './ElineupMallProvider';

export type ElineupMallCartMutationButtonProps = {
  link: string;
};

export default function ElineupMallCartMutationButton({ link }: ElineupMallCartMutationButtonProps) {
  const elineupmall = useElineupMall();
  const navigation = useNavigation();
  let text = '';
  let disabled = true;
  let loading = true;
  let onPress = () => {};
  switch (elineupmall.status) {
    // if status is 'error_*', we show the button but open the webview.
    case 'error_not_opted_in':
    case 'error_upfc_is_empty':
    case 'error_unknown':
    case 'error_authenticate':
      loading = false;
      disabled = false;
      text = t('Buy on Elnieup Mall');
      onPress = () => {
        navigation.push(ElineupMallWebViewScreen, {
          uri: link
        });
      };
      break;
    // Show 'Add To Cart' or 'Remove From Cart' only when status is 'ready' to avoid concurrent mutations.
    case 'ready': {
      loading = false;
      const purchased = elineupmall.purchaseHistory?.get(link);
      if (purchased) {
        text = t('Purchased on %{date}', { date: date.toDateString(purchased.order.orderedAt) });
      } else {
        const inCart = elineupmall.cart?.get(link);
        if (inCart && !isEmpty(inCart.deleteLink)) {
          text = t('Remove From Cart');
          disabled = false;
          onPress = () => {
            elineupmall.removeFromCart(inCart);
          };
        } else {
          text = t('Add To Cart');
          disabled = false;
          onPress = () => {
            elineupmall.addToCart(link);
          };
        }
      }
      break;
    }
  }
  return (
    <Button disabled={disabled} loading={loading} onPress={onPress}>
      {text}
    </Button>
  );
}
