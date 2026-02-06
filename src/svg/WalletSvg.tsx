import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export const WalletSvg: React.FC = () => {
  return (
    <Svg width={14} height={14} fill='none'>
      <Path
        stroke='#B4B4C6'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12 10.5v2a1 1 0 0 1-1 1H1.5a1 1 0 0 1-1-1V5a3 3 0 0 1 3-3H10v2.5m0 0h1a1 1 0 0 1 1 1v2m-2-3H3.5m9.5 3H9.5A.5.5 0 0 0 9 8v2a.5.5 0 0 0 .5.5H13a.5.5 0 0 0 .5-.5V8a.5.5 0 0 0-.5-.5Z'
      />
    </Svg>
  );
};
