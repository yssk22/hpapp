import { useThemeColor } from '@hpapp/features/app/theme';
import { isEmpty } from '@hpapp/foundation/string';
import {
  DefaultTheme,
  NavigationContainer,
  NavigationContainerRef,
  NavigationState as NavigationStateOrig,
  useNavigation as useNavigationOrig,
  useRoute
} from '@react-navigation/native';
import {
  createNativeStackNavigator as createNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp
} from '@react-navigation/native-stack';
import React, { forwardRef, useCallback, useEffect, useMemo } from 'react';

export type ScreenParams = { [key: string]: unknown };
export type Screen<P extends ScreenParams> = {
  name: string;
  path: string;
  component: React.ElementType<P>;
  options?: NativeStackNavigationOptions;
};
export type ScreenList = Screen<any>[];

type ComponentPropType<T> = T extends React.ComponentType<infer P> | React.Component<infer P> ? P : never;

type Route<P extends ScreenParams> = {
  key: string;
  name: string;
  path: string;
  params: P;
};

function screenComponent<P extends ScreenParams>(
  screen: Screen<P>,
  rootComponent: React.ElementType<{ children: React.ReactElement }>
) {
  const RootComponent = rootComponent;
  return function Screen() {
    const route = useRoute<Route<P>>();
    const props = route.params;
    const Component = screen.component;
    return <RootComponent>{React.createElement(Component, props)}</RootComponent>;
  };
}

type StackProps<P extends ScreenParams> = {
  initialRouteName: string;
  screens: ScreenList;
  onStateChange?: (args: { params: Readonly<object | undefined>; screen: Screen<P> }) => void;
} & Omit<ComponentPropType<ReturnType<typeof createNavigator>['Navigator']>, 'children'>;

function createStackNavigator<P extends ScreenParams>(
  props: {
    rootComponent?: React.ElementType<{ children: React.ReactElement }>;
  } = {}
) {
  const stack = createNavigator();
  const rootComponent = props.rootComponent ?? React.Fragment;
  return forwardRef(function Navigator(
    props: StackProps<P>,
    ref?: React.Ref<NavigationContainerRef<ReactNavigation.RootParamList>> | undefined
  ): JSX.Element {
    const [primary, contrastPrimary] = useThemeColor('primary');
    const [secondary] = useThemeColor('secondary');
    const { screens, onStateChange, initialRouteName, ...navigatorProps } = props;
    const screenMap = screens.reduce(
      (map, s) => {
        map.set(s.path, s);
        return map;
      },
      new Map() as Map<string, Screen<P>>
    );
    const handleStateChange = useCallback(
      (state: NavigationStateOrig | undefined) => {
        if (state) {
          const currentRoute = state.routes[state.index];
          onStateChange &&
            onStateChange({
              params: currentRoute.params ?? {},
              screen: screenMap.get(currentRoute.name)!
            });
        }
      },
      [onStateChange, screenMap]
    );
    const handleReady = useCallback(() => {
      const screen = screenMap.get(initialRouteName);
      if (screen) {
        onStateChange &&
          onStateChange({
            params: {},
            screen
          });
      }
    }, [initialRouteName, screenMap, onStateChange]);
    const Screens = useMemo(() => {
      return screens.map((screen) => {
        const options = screen.options ?? {};
        return (
          <stack.Screen
            key={screen.path}
            name={screen.path}
            component={screenComponent(screen, rootComponent)}
            options={{
              headerBackTitle: '',
              headerBackTitleVisible: false,
              headerTintColor: contrastPrimary,
              headerStyle: {
                backgroundColor: primary
              },
              ...options
            }}
          />
        );
      });
    }, [screens, primary, contrastPrimary]);
    return (
      <NavigationContainer
        ref={ref}
        onStateChange={handleStateChange}
        onReady={handleReady}
        theme={{
          ...DefaultTheme,
          colors: {
            primary,
            background: contrastPrimary,
            card: contrastPrimary,
            text: primary,
            border: contrastPrimary,
            notification: secondary
          }
        }}
      >
        <stack.Navigator initialRouteName={initialRouteName} {...navigatorProps}>
          {Screens}
        </stack.Navigator>
      </NavigationContainer>
    );
  });
}

const useNavigation = () => {
  const navigation = useNavigationOrig<NativeStackNavigationProp<Record<string, object | undefined>>>();
  const { navigate, replace, push, canGoBack, ...rest } = navigation;
  return useMemo(() => {
    function _navigate<P extends ScreenParams>(screen: Screen<P>, params?: P) {
      const path = screen.path;
      if (params) {
        navigate(path, params);
      } else {
        navigate(path);
      }
    }
    function _push<P extends ScreenParams>(screen: Screen<P>, params?: P) {
      const path = screen.path;
      if (params) {
        push(path, { initial: false, ...params });
      } else {
        push(path);
      }
    }

    function _replace<P extends ScreenParams>(screen: Screen<P>, params?: P) {
      const path = screen.path;
      if (params) {
        replace(path, params);
      } else {
        replace(path);
      }
    }

    function _canGoBack() {
      return canGoBack();
    }

    return {
      navigate: _navigate,
      push: _push,
      replace: _replace,
      canGoBack: _canGoBack,
      ...rest
    };
  }, [navigate]);
};

type Navigation = ReturnType<typeof useNavigation>;

function defineScreen<P extends ScreenParams>(path: string, component: React.ElementType<P>): Screen<P> {
  const name = (component as { name?: string }).name;
  if (isEmpty(name)) {
    // eslint-disable-next-line no-console
    console.warn(`Component (path: "${path}") should have a name, use path as a fallback`);
  }
  return {
    name: name ?? path,
    path,
    component,
    options: {}
  };
}

// shortcut for useNavigationOption({title: title})
function useScreenTitle(title: string) {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title
    });
  }, [title]);
}

function useNavigationOption(options: Partial<NativeStackNavigationOptions>) {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions(options);
  }, [options]);
}

export { createStackNavigator, useNavigation, Navigation, defineScreen, useScreenTitle, useNavigationOption };
