import React from 'react';
import {View, ActivityIndicator} from 'react-native';

type Props = {
  color?: 'black' | 'white';
  size?: 'small' | 'large';
};

export const Loader: React.FC<Props> = ({color = 'white', size = 'small'}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator
        size={size}
        color={color}
      />
    </View>
  );
};
