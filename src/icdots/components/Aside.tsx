import * as React from 'react';
import '../../App.css';
import { Fragment } from 'react';

interface AsideIS {
  fontWeight: string;
}

class Aside extends React.Component<{}, AsideIS> {
  render() {
    const h4 = { fontWeight: 'bold' as 'bold' };
    return (
      <Fragment>
        <div className={'description'} style={{ maxWidth: 400 }}>
          The Game:
          <ol>
            <li>Board is between 2 and 7 (represented as 1 row of boxes).</li>
            <li>Number of players is between 2 and [Board] size.</li>
            <li>Players take turns.</li>
            <li>If a player pins a box, they go again.</li>
          </ol>
        </div>
        <aside>
          <p>My React-version of a game inspired by a Codewars kata.</p>
          <ul>
            <li>
              My JavaScript Prototypal Inheritance Version:&nbsp;
              <a href="https://codepen.io/KeithDC/pen/rpKrgK">https://codepen.io/KeithDC/pen/rpKrgK</a>
            </li>
            <li>
              Wikipedia (Game: Dots and Boxes):&nbsp;
              <a href="https://en.wikipedia.org/wiki/Dots_and_Boxes">https://en.wikipedia.org/wiki/Dots_and_Boxes</a>
            </li>
          </ul>
          <h4 style={h4}>@DONE: (for 2018-01)</h4>
          <ul>
            <li>
              Forked Pen (<a href="https://codepen.io/KeithDC/pen/rpKrgK">JavaScript version</a>)
              and converted to React with TypeScript.
            </li>
          </ul>
          <h4 style={h4}>@TODO:</h4>
          <ul>
            <li>Add to GitHub.</li>
          </ul>
          <h4 style={h4}>Development Time</h4>
          <p>
            Conversion from 'kata style' to 'interactive style'.<br/>
            [2018-01-13 - Saturday] --> [2018-01-21 - Sunday]
          </p>
          <p>
            Conversion from 'JavaScript' Prototypal Inheritance to 'React' with TypeScript.<br/>
            [2018-01-22 - Monday] --> [2018-01-29 - Monday]
          </p>
        </aside>
      </Fragment>
    );
  }
}

export default Aside;