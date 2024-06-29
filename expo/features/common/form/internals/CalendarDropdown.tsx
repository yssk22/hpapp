import * as Calendar from 'expo-calendar';
import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import Dropdown from './Dropdown';

const NULL_CALENDER_VALUE = '__CALENDER_IS_NULL__';

export type CalendarDropdownProps = {
  renderIfPermissionDenied: React.ReactElement;
  onSelect: (calender: Calendar.Calendar | null) => void;
  includeNull?: boolean;
  nullText?: string;
} & Omit<React.ComponentProps<typeof Dropdown>, 'onValueChange' | 'items'>;

// CalenderDropdown provides a Dropdown component for calendars defined in users Operating System.
export default function CalendarDropdown({
  renderIfPermissionDenied,
  includeNull,
  nullText,
  onSelect,
  selectedValue
}: CalendarDropdownProps) {
  const [isRequestingPermission, setIsRequsetingPermission] = useState<boolean>(true);
  const [calendars, setCalendars] = useState<Calendar.Calendar[]>([]);
  useEffect(() => {
    (async () => {
      let reminderGranted = true;
      const { granted } = await Calendar.requestCalendarPermissionsAsync();
      if (Platform.OS === 'ios') {
        const { granted } = await Calendar.requestRemindersPermissionsAsync();
        reminderGranted = granted;
      }
      if (granted && reminderGranted) {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        // for Android, getEventsAsync return nothing if the calender is not visible so
        // users have to select from only visible calendars.
        if (Platform.OS === 'android') {
          setCalendars(calendars.filter((c) => c.isVisible === true && c.allowsModifications));
        } else {
          setCalendars(calendars.filter((c) => c.allowsModifications));
        }
        setIsRequsetingPermission(false);
      }
    })();
  }, []);
  const items = useMemo(() => {
    const calendarItems = calendars.map((c) => {
      return {
        key: c.id,
        label: c.title,
        value: c.id
      };
    });

    if (nullText) {
      return [
        {
          key: 'null',
          label: nullText,
          value: NULL_CALENDER_VALUE
        }
      ].concat(calendarItems);
    }
    return calendarItems;
  }, [calendars]);
  if (isRequestingPermission) {
    return null;
  }
  if (calendars.length === 0) {
    return renderIfPermissionDenied;
  }
  return (
    <Dropdown
      selectedValue={selectedValue}
      items={items}
      onValueChange={(itemValue) => {
        if (itemValue === NULL_CALENDER_VALUE) {
          onSelect(null);
        } else {
          for (let i = 0; i < calendars.length; i++) {
            if (calendars[i].id === itemValue) {
              onSelect(calendars[i]);
              return;
            }
          }
        }
      }}
    />
  );
}
