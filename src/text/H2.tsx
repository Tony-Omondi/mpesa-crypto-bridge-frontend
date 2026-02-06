import React from 'react';
import {Text, TextStyle} from 'react-native';

import {utils} from '../utils';
import {theme} from '@/src/constants';

type Props = {
  style?: TextStyle;
  numberOfLines?: number;
  children: React.ReactNode;
};

const H2: React.FC<Props> = ({children, style, numberOfLines}) => {
  return (
    <Text
      style={{
        color: theme.colors.eigengrau,
        fontSize: utils.fontSize(24),
        lineHeight: utils.lineHeight(24, 1.2),
        textTransform: 'capitalize',
        ...style,
      }}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

export default H2;
