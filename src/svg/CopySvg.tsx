import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

export const CopySvg: React.FC = () => {
  return (
    <Svg width={14} height={14} fill='none'>
      <G
        stroke='#B4B4C6'
        strokeLinecap='round'
        strokeLinejoin='round'
        clipPath='url(#a)'
      >
        <Path d='M10 .5H1.5a1 1 0 0 0-1 1V10a1 1 0 0 0 1 1H10a1 1 0 0 0 1-1V1.5a1 1 0 0 0-1-1Z' />
        <Path d='M13.5 3.5v9a1 1 0 0 1-1 1h-9' />
      </G>
      <Defs>
        <ClipPath id='a'>
          <Path fill='#fff' d='M0 0h14v14H0z' />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
