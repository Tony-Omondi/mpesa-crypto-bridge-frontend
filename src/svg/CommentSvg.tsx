import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

export const CommentSvg: React.FC = () => {
  return (
    <Svg width={14} height={14} fill='none'>
      <G
        stroke='#B4B4C6'
        strokeLinecap='round'
        strokeLinejoin='round'
        clipPath='url(#a)'
      >
        <Path d='m4.5 12.5-4 1 1-3v-9a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-8ZM4.5 5h6M4.5 8h4' />
      </G>
      <Defs>
        <ClipPath id='a'>
          <Path fill='#fff' d='M0 0h14v14H0z' />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
