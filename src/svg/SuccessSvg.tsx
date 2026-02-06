import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

export const SuccessSvg: React.FC = () => {
  return (
    <Svg width={100} height={100} fill='none'>
      <Circle cx={50} cy={50} r={50} fill='#3EB290' />
      <Path
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={4}
        d='M70 35 42.5 62.5 30 50'
      />
    </Svg>
  );
};
