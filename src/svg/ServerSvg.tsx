import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

export const ServerSvg: React.FC = () => {
  return (
    <Svg width={14} height={14} fill='none'>
      <G clipPath='url(#a)'>
        <Path
          stroke='#B4B4C6'
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M1.5 5.5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1m-11 0h11m-11 0a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1M7.5 3H11M7.5 8H11m-4 2.5v3m-5 0h10M3.25 8.25a.25.25 0 1 1 0-.5.25.25 0 0 1 0 .5Zm0-5a.25.25 0 1 1 0-.5.25.25 0 0 1 0 .5Z'
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
