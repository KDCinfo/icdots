import * as React from 'react';
import '../../App.css';

import { GameTipIP } from '../../icdots/interfaces';

class GameTip extends React.Component<GameTipIP, {}> {
  gameTipOpen = () => {
    // console.log('gameTipOpen clicked');
    this.props.updateGameTipSmallBig('gametip-big');
  }
  gameTipClose = () => {
    this.props.updateGameTipSmallBig('gametip-small');
  }
  render() {
    const gameTipSmallBig = 'gametip ' + this.props.gameTipSmallBig;
    return (
      <div className={gameTipSmallBig}>
        <span className={'gametip-open ' + this.props.highLightTip} onClick={this.gameTipOpen}>?</span>
        <span className="gametip-close" onClick={this.gameTipClose}>X</span>
        <span className="gametip-content">
          number of players should not exceed the board's size.
          board size can be between 2 and 7, inclusive.
        </span>
      </div>
    );
  }
}

export default GameTip;