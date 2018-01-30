import * as React from 'react';
import '../../App.css';

class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <h1>
          &middot;&middot;I&middot;&middot;C
          &middot;&middot;D&middot;&middot;O&middot;&middot;T&middot;&middot;S&middot;&middot;
        </h1>
        <h2>
          &ndash;&nbsp;&ndash;&nbsp;and&nbsp;&ndash;&nbsp;&ndash;&nbsp;lines&nbsp;&ndash;&nbsp;&ndash;
        </h2>
        <p className={'description'}>
          This game is for 2-7 players who will take turns selecting lines to form boxes.
          Scoring is 1 point per box pinned. Line colors have no distinction other than one
          is horizontal and one is vertical, and the alternating colors felt visually appealing.
        </p>
      </div>
    );
  }
}

export default Header;