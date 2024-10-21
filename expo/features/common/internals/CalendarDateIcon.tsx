import { isInvalidDate } from '@hpapp/foundation/date';
import { View, StyleSheet } from 'react-native';

import Text from './Text';

/**
 * CalendarDateIcon is an icon that displays the date of the calendar.
 */
export default function CalendarDateIcon({ date }: { date: Date | null | undefined }) {
  return (
    <View style={styles.column}>
      {!isInvalidDate(date) ? (
        <>
          <Text style={styles.textMonth}>{date!.getMonth() + 1}月</Text>
          <Text style={styles.textDate}>{date!.getDate()}</Text>
        </>
      ) : (
        <Text style={styles.textDateUndefined}>-</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    width: 40,
    height: 40,
    flexDirection: 'column',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#cacaca',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textDateUndefined: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    width: '100%'
  },
  textMonth: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%'
  },
  textDate: {
    marginTop: -4,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    width: '100%'
  }
});
