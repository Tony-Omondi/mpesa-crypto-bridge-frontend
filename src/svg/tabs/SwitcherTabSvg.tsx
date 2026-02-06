import * as React from 'react';
import Svg, {ClipPath, Defs, G, Path} from 'react-native-svg';

type Props = {color?: string};

export const SwitcherTabSvg: React.FC<Props> = ({color = '#3B4146'}) => {
  return (
    <Svg
      width={24}
      height={24}
      fill='none'
    >
      <G
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
      >
        <Path d='M3.43 6.286a.714.714 0 1 0 0-1.429.714.714 0 0 0 0 1.429ZM8.43 5.572h12.857M3.43 12.714a.714.714 0 1 0 0-1.429.714.714 0 0 0 0 1.429ZM8.43 12h12.857M3.43 19.143a.714.714 0 1 0 0-1.428.714.714 0 0 0 0 1.428ZM8.43 18.428h12.857' />
      </G>
      <Defs>
        <ClipPath id='a'>
          <Path
            fill='#fff'
            d='M2 2h20v20H2z'
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
