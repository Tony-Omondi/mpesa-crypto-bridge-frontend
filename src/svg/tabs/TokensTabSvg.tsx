import * as React from 'react';
import Svg, {ClipPath, Defs, G, Path} from 'react-native-svg';

type Props = {color?: string};

export const TokensTabSvg: React.FC<Props> = ({color = '#3B4146'}) => {
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
        clipPath='url(#a)'
      >
        <Path d='M7.447 10.786a3.34 3.34 0 1 0 0-6.679 3.34 3.34 0 0 0 0 6.679ZM16.554 10.786a3.34 3.34 0 1 0 0-6.679 3.34 3.34 0 0 0 0 6.679ZM7.447 19.892a3.34 3.34 0 1 0 0-6.678 3.34 3.34 0 0 0 0 6.678ZM16.554 19.892a3.34 3.34 0 1 0 0-6.678 3.34 3.34 0 0 0 0 6.678Z' />
      </G>
      <Defs>
        <ClipPath id='a'>
          <Path
            fill='#fff'
            d='M3.5 3.5h17v17h-17z'
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
