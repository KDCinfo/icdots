import * as React from 'react';
import '../../App.css';

import { MySVGClicked64Props,
         MySVGOpen64Props,
       } from '../interfaces';

// SVG React injection thanks to: https://medium.com/@ians/rendering-svgs-as-images-directly-in-react-a26615c45770

export class MySVGClicked64 extends React.Component<MySVGClicked64Props, {}> {
  render() {
    const { width, height, cx1, cy1, cx2, cy2, x1, y1, x2, y2, lc1 } = this.props;
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
        <circle cx={cx1} cy={cy1} r={4} stroke={'green'} strokeWidth={0} fill={'yellow'} />
        <circle cx={cx2} cy={cy2} r={4} stroke={'green'} strokeWidth={0} fill={'yellow'} />
        <line x1={x1} y1={y1} x2={x2} y2={y2} style={{stroke: lc1, strokeWidth: 1}} />
      </svg>
      // SVGLib.mySVGHClicked64 = window.btoa(mySVGHClicked);
    );
  }
}

export class MySVGOpen64 extends React.Component<MySVGOpen64Props, {}> {
  render() {
    const { width, height, cx1, cy1, cx2, cy2, x11, y11, x21, y21, x12, y12, x22, y22, lc1 } = this.props;
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
        <circle cx={cx1} cy={cy1} r={4} stroke={'green'} strokeWidth={0} fill={'yellow'} />
        <circle cx={cx2} cy={cy2} r={4} stroke={'green'} strokeWidth={0} fill={'yellow'} />
        <line
          x1={x11}
          y1={y11}
          x2={x21}
          y2={y21}
          style={{stroke: lc1, strokeWidth: 1, strokeDasharray: '3,3'}}
        />
        <line
          x1={x12}
          y1={y12}
          x2={x22}
          y2={y22}
          style={{stroke: lc1, strokeWidth: 1, strokeDasharray: '3,3'}}
        />
      </svg>
      // SVGLib.mySVGHOpen64 = window.btoa(mySVGHOpen);
    );
  }
}
