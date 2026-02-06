import {Text, TextStyle} from 'react-native';
import React from 'react';

import {theme} from '@/src/constants';
import {utils} from '../utils';

type Props = {
  children: React.ReactNode;
  style?: TextStyle;
  numberOfLines?: number;
};

const H4: React.FC<Props> = ({children, numberOfLines, style}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={{
        fontSize: utils.fontSize(18),
        color: theme.colors.eigengrau,
        ...style,
      }}
    >
      {children}
    </Text>
  );
};

export default H4;
