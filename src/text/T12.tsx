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

export const T12: React.FC<Props> = ({
  children,
  style,
  numberOfLines,
  onPress,
}) => {
  return (
    <Text
      style={{
        color: theme.colors.textColor,
        ...theme.fonts.SourceSans3_400Regular,
        lineHeight: utils.lineHeight(12, 1.5),
        fontSize: utils.fontSize(12),
        ...style,
      }}
      onPress={onPress}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};
