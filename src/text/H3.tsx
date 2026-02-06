import React from 'react';
import {Text, TextStyle} from 'react-native';

import {utils} from '../utils';
import {theme} from '@/src/constants';

type Props = {
  children: React.ReactNode;
  style?: TextStyle;
  numberOfLines?: number;
};

const H3: React.FC<Props> = ({children, style, numberOfLines}) => {
  return (
    <Text
      style={{
        color: theme.colors.eigengrau,
        lineHeight: utils.lineHeight(20, 1.7),
        fontSize: utils.fontSize(20),
        ...style,
      }}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

export default H3;
