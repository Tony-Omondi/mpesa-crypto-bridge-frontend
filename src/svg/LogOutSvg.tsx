import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

export const LogOutSvg: React.FC = () => {
  return (
    <Svg width={14} height={14} fill='none'>
      <G clipPath='url(#a)'>
        <Path
          stroke='#B4B4C6'
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M9.5 10.5v2a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v2M6.5 7h7m0 0-2-2m2 2-2 2'
        />
      </G>
      <Defs>
        <ClipPath id='a'>
          <Path fill='#fff' d='M0 0h14v14H0z' />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
