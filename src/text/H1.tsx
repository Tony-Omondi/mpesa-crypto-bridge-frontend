import React from 'react';
import {Text, TextStyle} from 'react-native';

import {theme} from '@/src/constants';
import {utils} from '@/src/utils';

type Props = {
  style?: TextStyle;
  children: React.ReactNode;
  numberOfLines?: number;
};

const H1: React.FC<Props> = ({children, style, numberOfLines}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={{
        fontSize: utils.fontSize(32),
        lineHeight: utils.lineHeight(32, 1.2),
        color: theme.colors.white,
        ...theme.fonts.SourceSans3_600SemiBold,
        ...style,
      }}
    >
      {children}
    </Text>
  );
};

export default H1;
