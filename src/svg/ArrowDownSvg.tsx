import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

export const ArrowDownSvg: React.FC = () => {
  return (
    <Svg width={24} height={24} fill='none'>
      <G
        stroke='#000'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.714}
        clipPath='url(#a)'
      >
        <Path d='M4.637 22.96a5.154 5.154 0 0 1-3.548-3.429M19.362 22.96a5.154 5.154 0 0 0 3.549-3.429M10.285 23.143h3.429m0-22.286h-3.429M.856 10.286v3.429M23.143 10.286v3.429M4.637 1.04A5.154 5.154 0 0 0 1.09 4.47M19.362 1.04a5.154 5.154 0 0 1 3.549 3.429M11.999 6.857v10.286M8.57 13.714 12 17.143l3.428-3.429' />
      </G>
      <Defs>
        <ClipPath id='a'>
          <Path fill='#fff' d='M0 0h24v24H0z' />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
