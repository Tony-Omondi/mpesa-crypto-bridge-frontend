import React from 'react';
import {Text, TextStyle} from 'react-native';

import {theme} from '@/src/constants';
import {utils} from '../utils';

type Props = {
  style?: TextStyle;
  numberOfLines?: number;
  children: React.ReactNode;
};

const H5: React.FC<Props> = ({children, style, numberOfLines}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={{
        color: theme.colors.eigengrau,
        fontSize: utils.fontSize(16),
        textTransform: 'capitalize',
        ...style,
      }}
    >
      {children}
    </Text>
  );
};

export default H5;
