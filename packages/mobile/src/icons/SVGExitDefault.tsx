import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath, SvgProps } from 'react-native-svg';

const SvgComponentExitDefault: React.FC<SvgProps> = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G fill="#777" clipPath="url(#a)">
      <Path d="m19.213 6.044-.445-.422a.959.959 0 0 0-1.308 0l-12.408 11.8a.85.85 0 0 0 0 1.243l.445.423a.959.959 0 0 0 1.308 0l12.408-11.8a.85.85 0 0 0 0-1.244ZM6.008 10.75a.264.264 0 0 0 .354 0l.695-.646C8.654 8.616 10.832 8 12.91 8.253l2.457-2.337c-3.532-1.17-7.627-.44-10.454 2.193l-.517.481a.444.444 0 0 0 0 .66l1.61 1.5h.001ZM3.965 16.76l1.679-1.596-3.795-3.533a.527.527 0 0 0-.709 0l-.993.916a.444.444 0 0 0 0 .66l3.817 3.554ZM22.868 11.638a.527.527 0 0 0-.709 0l-5.08 4.74a.132.132 0 0 1-.178 0l-2.35-2.198-1.63 1.55 3.758 3.498a.528.528 0 0 0 .708 0l6.467-6.021a.444.444 0 0 0 0-.66l-.986-.909Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default SvgComponentExitDefault;
