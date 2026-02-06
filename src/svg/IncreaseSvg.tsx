import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

export const IncreaseSvg: React.FC = () => {
  return (
    <Svg width={15} height={9} fill='none'>
      <G clipPath='url(#a)'>
        <G strokeLinecap='round' strokeLinejoin='round' clipPath='url(#b)'>
          <Path stroke='#00D487' d='M10 1h4v4' />
          <Path
            stroke='#00D487'
            d='M14 1 8.35 6.65a.5.5 0 0 1-.7 0l-2.3-2.3a.5.5 0 0 0-.7 0L1 8'
          />
          <Path stroke='#52C41A' d='M10 1h4v4' />
          <Path
            stroke='#52C41A'
            d='M14 1 8.35 6.65a.5.5 0 0 1-.7 0l-2.3-2.3a.5.5 0 0 0-.7 0L1 8'
          />
        </G>
      </G>
      <Defs>
        <ClipPath id='a'>
          <Path fill='#fff' d='M0 0h15v9H0z' />
        </ClipPath>
        <ClipPath id='b'>
          <Path fill='#fff' d='M.5-2.5h14v14H.5z' />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
