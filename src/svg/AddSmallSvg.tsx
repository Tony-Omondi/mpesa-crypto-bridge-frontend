import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export const AddSmallSvg: React.FC = () => {
  return (
    <Svg width={13} height={13} fill='none'>
      <Path
        stroke='#B4B4C6'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={0.736}
        d='M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11ZM6.5 3.962v5.076M3.962 6.5h5.076'
      />
    </Svg>
  );
};
