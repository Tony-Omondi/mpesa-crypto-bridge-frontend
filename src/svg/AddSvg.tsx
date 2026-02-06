import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export const AddSvg: React.FC = () => {
  return (
    <Svg width={15} height={15} fill='none'>
      <Path
        stroke='#B4B4C6'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M7.93 14a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM7.93 4.5v6M4.93 7.5h6'
      />
    </Svg>
  );
};
