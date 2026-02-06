import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

type Props = {goBackcolor?: string};

export const GoBackSvg: React.FC<Props> = ({goBackcolor = '#B4B4C6'}) => {
  return (
    <Svg width={9} height={14} fill='none'>
      <G>
        <Path
          stroke={goBackcolor}
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1.5}
          d='m7.93 13-6-6 6-6'
        />
      </G>
      <Defs>
        <ClipPath id='a'>
          <Path fill='#fff' d='M.93 0h8v14h-8z' />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
