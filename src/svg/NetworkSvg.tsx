import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

export const NetworkSvg: React.FC = () => {
  return (
    <Svg width={14} height={14} fill='none'>
      <G
        stroke='#B4B4C6'
        strokeLinecap='round'
        strokeLinejoin='round'
        clipPath='url(#a)'
      >
        <Path d='M2 10V8a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2M7 4v6M5.5 2v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1ZM5.5 11v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1ZM.5 11v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1ZM10.5 11v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1Z' />
      </G>
      <Defs>
        <ClipPath id='a'>
          <Path fill='#fff' d='M0 0h14v14H0z' />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
