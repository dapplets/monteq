import * as React from 'react';
import Svg, { Rect } from 'react-native-svg';
const SvgComponentCameraBorder = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={240} height={240} fill="none" {...props}>
    <Rect
      width={238}
      height={238}
      x={1}
      y={1}
      stroke="#fff"
      strokeDasharray="200 200"
      strokeWidth={2}
      rx={9}
    />
  </Svg>
);
export default SvgComponentCameraBorder;
