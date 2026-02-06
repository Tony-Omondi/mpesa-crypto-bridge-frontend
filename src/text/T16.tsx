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

const T16: React.FC<Props> = ({children, style, numberOfLines, onPress}) => {
  return (
    <Text
      style={{
        color: theme.colors.textColor,
        ...theme.fonts.SourceSans3_400Regular,
        lineHeight: utils.lineHeight(16, 1.7),
        fontSize: utils.fontSize(16),
        ...style,
      }}
      onPress={onPress}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

export default T16;
