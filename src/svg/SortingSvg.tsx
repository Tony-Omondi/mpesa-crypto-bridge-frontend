import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

export const SortingSvg: React.FC = () => {
  return (
    <Svg width={15} height={14} fill='none'>
      <G
        stroke='#B4B4C6'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={0.923}
        clipPath='url(#a)'
      >
        <Path d='M8.787 1H1.93M8.787 3.571H4.072M8.786 6.143H6.215M13.93 10.692 11.622 13l-2.308-2.308M11.622 1v12' />
      </G>
      <Defs>
        <ClipPath id='a'>
          <Path fill='#fff' d='M.93 0h14v14h-14z' />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
