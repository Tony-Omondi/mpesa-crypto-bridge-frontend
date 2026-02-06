import React from 'react';
import {View, ViewStyle} from 'react-native';

import {text} from '@/src/text';

type Props = {
  containerStyle?: ViewStyle;
  children?: React.ReactNode;
};

export const Reminder: React.FC<Props> = ({containerStyle, children}) => {
  return (
    <View
      style={{
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#1B2028',
        ...containerStyle,
      }}
    >
      <text.T14
        style={{
          fontSize: 12,
          color: '#F7A003',
        }}
      >
        {children}
      </text.T14>
    </View>
  );
};
