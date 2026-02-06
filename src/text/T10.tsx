import React from 'react';
import {Text, TextStyle} from 'react-native';

type Props = {
  style?: TextStyle;
  onPress?: () => void;
  children: React.ReactNode;
  numberOfLines?: number;
};

import {theme} from '@/src/constants';
import {utils} from '../utils';

export const T10: React.FC<Props> = ({
  children,
  style,
  numberOfLines,
  onPress,
}) => {
  return (
    <Text
      style={{
        color: theme.colors.textColor,
        lineHeight: utils.lineHeight(10, 1.5),
        fontSize: utils.fontSize(10),
        ...theme.fonts.SourceSans3_400Regular,
        ...style,
      }}
      onPress={onPress}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};
