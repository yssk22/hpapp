import { IconSize } from '@hpapp/features/common/constants';
import * as Svg from 'react-native-svg';

/**
 * AmebloIcon is an SVG icon component for the Ameblo.
 */
export default function AmebloIcon({ size = IconSize.Small }: { size: number }) {
  return (
    <Svg.Svg style={{ width: size, height: size }} x="0px" y="0px" viewBox="0 0 34.7 34.7">
      <Svg.G>
        <Svg.Path
          fill="green"
          d="M28.7,24.5c-2-1-1.9-3.5-1.7-5.9c0.3-2.4,0.3-3.7-0.3-5.8C26.1,11,25.1,10,25.1,8c0-1.5,0-3.5,0-4.7c0-1.8-0.8-2.4-1.6-2.4
    c-2.3,0-3.1,4-6.2,4h0c-3.1,0-3.9-4-6.2-4c-0.7,0-1.6,0.6-1.6,2.4c0,1.3,0,3.3,0,4.7c0,2-1,3-1.6,4.8c-0.6,2.1-0.6,3.4-0.4,5.8
    C7.9,21.1,8,23.5,6,24.5c-1.6,0.8-2.6,2.1-1.8,3.2c0.9,1.4,2.6-0.2,3.4,0c0.9,0.2-0.1,1.5,1.3,1.5c0.7,0,0.9-2.2,1.6-2
    c0.5,0.1,0.6,1.5,0.1,2.5c-0.2,0.5-2,1.6-1.8,2.8c0.2,1.2,1.2,1.4,2.6,1.4c1,0,2.7,0,3.7,0c0.9,0,1.8-0.9,1.8-1.5
    c0-0.6-0.8-1.9,0.5-1.9h0c1.3,0,0.5,1.3,0.5,1.9c0,0.6,0.9,1.5,1.8,1.5c0.9,0,2.6,0,3.7,0c1.4,0,2.4-0.2,2.6-1.4
    c0.2-1.2-1.6-2.3-1.8-2.8c-0.5-1.1-0.3-2.4,0.1-2.5c0.7-0.2,0.9,2,1.6,2c1.4,0,0.4-1.3,1.3-1.5c0.8-0.2,2.5,1.4,3.4,0
    C31.3,26.6,30.3,25.3,28.7,24.5z"
        />
      </Svg.G>
      <Svg.Circle fill="white" cx="22.4" cy="11.5" r="0.9" />
      <Svg.Circle fill="white" cx="12.3" cy="11.5" r="0.9" />
      <Svg.Circle fill="white" cx="17.4" cy="25.1" r="4.2" />
      <Svg.Path
        fill="white"
        d="M17.4,12.2c-2.6,0-6.2,1.6-6.2,4.1c0,2,1.3,2.7,2.9,2.7s2.1-1.8,3.4-1.8c1.3,0,1.8,1.8,3.4,1.8
    c1.6,0,2.9-0.7,2.9-2.7C23.6,13.8,20,12.2,17.4,12.2z M17.4,15.9c-1.1,0-2.1-0.7-2.1-1.5c0-0.9,0.9-1.5,2.1-1.5
    c1.1,0,2.1,0.7,2.1,1.5C19.4,15.2,18.5,15.9,17.4,15.9z"
      />
    </Svg.Svg>
  );
}
