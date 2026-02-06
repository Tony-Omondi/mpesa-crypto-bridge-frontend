import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

export const FailedSvg: React.FC = () => {
  return (
    <Svg width={100} height={100} fill='none'>
      <Circle cx={50} cy={50} r={50} fill='#FF5887' />
      <Path
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={4}
        d='M65 35 35 65M35 35l30 30'
      />
    </Svg>
  );
};
