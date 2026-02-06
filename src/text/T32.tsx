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

export const T32: React.FC<Props> = ({
  children,
  style,
  numberOfLines,
  onPress,
}) => {
  return (
    <Text
      style={{
        color: theme.colors.white,
        ...theme.fonts.SourceSans3_600SemiBold,
        lineHeight: utils.lineHeight(32, 1.7),
        fontSize: utils.fontSize(32),
        ...style,
      }}
      onPress={onPress}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};
