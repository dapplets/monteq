import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const SvgComponentHomeActive: React.FC<SvgProps> = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <Path
      stroke="#14C58B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"
    />
    <Path
      stroke="#14C58B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.4}
      d="M15.75 12.883h.542c.574 0 1.125.246 1.532.684.406.437.634 1.03.634 1.65 0 .618-.228 1.212-.634 1.65a2.091 2.091 0 0 1-1.532.683h-.542"
    />
    <Path
      fill="#14C58B"
      stroke="#14C58B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.4}
      d="M7.083 12.883h8.667v5.25c0 .62-.228 1.213-.635 1.65a2.091 2.091 0 0 1-1.532.684H9.25a2.091 2.091 0 0 1-1.532-.684 2.428 2.428 0 0 1-.635-1.65v-5.25Z"
    />
    <Path
      stroke="#14C58B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.4}
      d="M9.25 8.8v1.75M11.417 8.8v1.75M13.583 8.8v1.75"
    />
  </Svg>
);

export default SvgComponentHomeActive;
