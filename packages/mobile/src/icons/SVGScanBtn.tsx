import * as React from 'react';
import Svg, { G, Rect, Path, Defs, LinearGradient, Stop, SvgProps } from 'react-native-svg';

/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SvgComponentScan: React.FC<SvgProps> = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={82} height={82} fill="none" {...props}>
    <G filter="url(#a)">
      <Rect width={60} height={60} x={11} y={2} fill="#fff" rx={30} />
      <Rect width={60} height={60} x={11} y={2} fill="url(#b)" rx={30} />
      <Path
        fill="#fff"
        d="M37.875 25.125v3.75h-3.75v-3.75h3.75Zm1.875-1.875h-7.5v7.5h7.5v-7.5Zm-1.875 11.875v3.75h-3.75v-3.75h3.75Zm1.875-1.875h-7.5v7.5h7.5v-7.5Zm8.125-8.125v3.75h-3.75v-3.75h3.75Zm1.875-1.875h-7.5v7.5h7.5v-7.5Zm-7.5 10h1.875v1.875H42.25V33.25Zm1.875 1.875H46V37h-1.875v-1.875ZM46 33.25h1.875v1.875H46V33.25ZM42.25 37h1.875v1.875H42.25V37Zm1.875 1.875H46v1.875h-1.875v-1.875ZM46 37h1.875v1.875H46V37Zm1.875-1.875h1.875V37h-1.875v-1.875Zm0 3.75h1.875v1.875h-1.875v-1.875ZM52.25 25.75c-.688 0-1.25-.563-1.25-1.25V22h-2.5c-.688 0-1.25-.563-1.25-1.25 0-.688.563-1.25 1.25-1.25h3.75c.688 0 1.25.563 1.25 1.25v3.75c0 .688-.563 1.25-1.25 1.25Zm1.25 17.5V39.5c0-.688-.563-1.25-1.25-1.25-.688 0-1.25.563-1.25 1.25V42h-2.5c-.688 0-1.25.563-1.25 1.25 0 .688.563 1.25 1.25 1.25h3.75c.688 0 1.25-.563 1.25-1.25ZM29.75 44.5h3.75c.688 0 1.25-.563 1.25-1.25 0-.688-.563-1.25-1.25-1.25H31v-2.5c0-.688-.563-1.25-1.25-1.25-.688 0-1.25.563-1.25 1.25v3.75c0 .688.563 1.25 1.25 1.25ZM28.5 20.75v3.75c0 .688.563 1.25 1.25 1.25.688 0 1.25-.563 1.25-1.25V22h2.5c.688 0 1.25-.563 1.25-1.25 0-.688-.563-1.25-1.25-1.25h-3.75c-.688 0-1.25.563-1.25 1.25Z"
      />
    </G>
    <Defs>
      <LinearGradient
        id="b"
        x1={41}
        x2={96.408}
        y1={-18.5}
        y2={40.187}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#0DD977" />
        <Stop offset={0.443} stopColor="#1DA4AC" />
        <Stop offset={1} stopColor="#0DD977" />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default SvgComponentScan;
