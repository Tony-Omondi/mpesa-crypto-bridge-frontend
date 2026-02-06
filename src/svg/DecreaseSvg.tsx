import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

export const DecreaseSvg: React.FC = () => {
  return (
    <Svg width={15} height={9} fill='none'>
      <G
        stroke='#FF4D4F'
        strokeLinecap='round'
        strokeLinejoin='round'
        clipPath='url(#a)'
      >
        <Path d='M10 8h4V4' />
        <Path d='M14 8 8.35 2.35a.5.5 0 0 0-.7 0l-2.3 2.3a.5.5 0 0 1-.7 0L1 1' />
      </G>
      <Defs>
        <ClipPath id='a'>
          <Path fill='#fff' d='M0 0h15v9H0z' />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
