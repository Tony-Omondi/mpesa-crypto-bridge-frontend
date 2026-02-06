import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

export const RightArrowSvg: React.FC = () => {
  return (
    <Svg width={6} height={11} fill='none'>
      <G clipPath='url(#a)'>
        <Path
          stroke='#B4B4C6'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1.125}
          d='m.75 1.25 4.5 4.5-4.5 4.5'
        />
      </G>
      <Defs>
        <ClipPath id='a'>
          <Path fill='#fff' d='M6 11H0V.5h6z' />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
