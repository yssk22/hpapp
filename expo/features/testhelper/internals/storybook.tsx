import { defineScreen } from '@hpapp/features/common/stack';
import type { Meta } from '@storybook/react';
import { View } from 'react-native';

import { UserRoot } from '../../app/user';

type ExtractD<T> = T extends (infer U)[] ? U : T;

type Decorator = NonNullable<ExtractD<Meta['decorators']>>;
type StoryType = Parameters<Decorator>[0];

export function ScreenDecorator(Story: StoryType) {
  const screen = defineScreen('/', function TestComponent() {
    return <Story />;
  });
  return (
    <>
      <View style={{ marginTop: 40 }} />
      <UserRoot screens={[screen]} />
    </>
  );
}
