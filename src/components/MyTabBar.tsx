import {View} from 'react-native';
import {useLinkBuilder} from '@react-navigation/native';
import {PlatformPressable} from '@react-navigation/elements';

import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';

function TabBar({state, descriptors, navigation}: BottomTabBarProps) {
  const {buildHref} = useLinkBuilder();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#080F16',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      }}
    >
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        options.headerShown = false;

        const isFocused = state.index === index;
        const icon = options.tabBarIcon
          ? options.tabBarIcon({
              focused: isFocused,
              color: isFocused ? '#ff9800' : '#aaa',
              size: 24,
            })
          : null;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={route.key}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{flex: 1, alignItems: 'center'}}
          >
            <View style={{paddingBottom: 10, paddingTop: 14}}>{icon}</View>
          </PlatformPressable>
        );
      })}
    </View>
  );
}

export default TabBar;
