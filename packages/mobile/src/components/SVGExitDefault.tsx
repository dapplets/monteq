import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SvgComponentExitDefault = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Path
      stroke="#777"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
    />
  </Svg>
);
export default SvgComponentExitDefault;
