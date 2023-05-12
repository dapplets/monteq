import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const SvgComponentPay: React.FC<SvgProps> = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={25}
    fill="none"
    {...props}>
    <Path
      stroke="#14C58B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M22 11.58v.92a10 10 0 1 1-5.93-9.14"
    />
    <Path
      stroke="#14C58B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M22 4.5 12 14.51l-3-3"
    />
  </Svg>
);

export default SvgComponentPay;
