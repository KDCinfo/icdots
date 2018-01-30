import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { MySVGClicked64, MySVGOpen64 } from '../components/MySVG';

const mySVGHClicked64 = {
        width: 98, height: 40, cx1: 4, cy1: 20, cx2: 94, cy2: 20, x1: 8, y1: 20, x2: 90, y2: 20, lc1: 'rgb(255,0,0)'
      },
      mySVGVClicked64 = {
        width: 40, height: 90, cx1: 20, cy1: 4, cx2: 20, cy2: 94, x1: 20, y1: 8, x2: 20, y2: 80, lc1: 'rgb(0,0,255)'
      },
      MySVGHOpen64 = {
        width: 98,
        height: 40,
        cx1: 4,
        cy1: 20,
        cx2: 94,
        cy2: 20,
        x11: 8,
        y11: 20,
        x21: 28,
        y21: 20,
        lc1: 'rgb(255,100,100)',
        x12: 70,
        y12: 20,
        x22: 90,
        y22: 20
      },
      MySVGVOpen64 = {
        width: 40,
        height: 90,
        cx1: 20,
        cy1: 4,
        cx2: 20,
        cy2: 94,
        x11: 20,
        y11: 8,
        x21: 20,
        y21: 28,
        lc1: 'rgb(100,100,255)',
        x12: 20,
        y12: 60,
        x22: 20,
        y22: 80
      };

const encodeProperly = (markup: string) => {

  // Many thanks and appreciation for a 'selective encode' goes to:
  // [Convert SVG to Data URI for css background-image](https://codepen.io/elliz/pen/ygvgay/?editors=0010)

  function escapeRegExp(str: string) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
  }
  function replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  }
  var encoded = markup.replace(/\s+/g, ' ');
  encoded = replaceAll(encoded, '%', '%25');
  encoded = replaceAll(encoded, '> <', '><'); // normalise spaces elements
  encoded = replaceAll(encoded, '; }', ';}'); // normalise spaces css
  encoded = replaceAll(encoded, '<', '%3c');
  encoded = replaceAll(encoded, '>', '%3e');
  encoded = replaceAll(encoded, '"', '\'');
  encoded = replaceAll(encoded, '#', '%23'); // needed for ie and firefox
  encoded = replaceAll(encoded, '{', '%7b');
  encoded = replaceAll(encoded, '}', '%7d');
  encoded = replaceAll(encoded, '|', '%7c');
  encoded = replaceAll(encoded, '^', '%5e');
  encoded = replaceAll(encoded, '`', '%60');
  encoded = replaceAll(encoded, '@', '%40');

  return 'url("data:image/svg+xml;charset=UTF-8,' + encoded + '")'; // Switched over from base64 and btoa()
};

export const mySVGHClicked64Uri = encodeProperly(renderToStaticMarkup(<MySVGClicked64 {...mySVGHClicked64} />)),
             mySVGVClicked64Uri = encodeProperly(renderToStaticMarkup(<MySVGClicked64 {...mySVGVClicked64} />)),
             mySVGHOpen64Uri = encodeProperly(renderToStaticMarkup(<MySVGOpen64 {...MySVGHOpen64} />)),
             mySVGVOpen64Uri = encodeProperly(renderToStaticMarkup(<MySVGOpen64 {...MySVGVOpen64} />));
// `url("data:image/svg+xml;base64,${btoa(svgString)}")
