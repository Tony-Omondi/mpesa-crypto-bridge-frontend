import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

export const LinkSvg: React.FC = () => {
  return (
    <Svg width={12} height={12} fill='none'>
      <G clipPath='url(#a)'>
        <Path
          stroke='#B4B4C6'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={0.857}
          d='m5.143 2.571 1.255-1.255a3.03 3.03 0 0 1 4.286 4.286L9.429 6.857M6.857 9.43l-1.255 1.255a3.03 3.03 0 0 1-4.286-4.286l1.255-1.255m5.143-.857L4.286 7.714'
        />
      </G>
      <Defs>
        <ClipPath id='a'>
          <Path fill='#fff' d='M0 0h12v12H0z' />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
