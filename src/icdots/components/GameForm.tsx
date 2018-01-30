import * as React from 'react';
import '../../App.css';

import { GameFormIP } from '../../icdots/interfaces';

import GameTip from './GameTip';

class GameForm extends React.Component<GameFormIP, {}> {
  state = {
    gameTipSmallBig: 'gametip-small',
  };
  updateGameTipSmallBig = (tipClass: string) => {
    this.props.clearHighLight();
    this.setState({ gameTipSmallBig: tipClass });
  }
  boardSizeChange = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    const tmpSize = parseInt(evt.currentTarget.value, 10);
    if (!isNaN(tmpSize)) {
      if (tmpSize >= 2 && tmpSize <= 7) {
        this.props.updateBoardSize(tmpSize);
      } else {
        this.props.showHighLight();
      }
    }
  }
  changePlayerNames = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    if (this.props.regCheck.test(evt.currentTarget.value)) {
      let tkey = evt.currentTarget.className.substr(evt.currentTarget.className.indexOf('player-name-') + 12, 1);
      this.props.adjustPlayerNames(parseInt(tkey, 10), evt.currentTarget.value); // pkey, pname
    }
  }
  render() {
    return (
      <form name="icdots">
        <div className="row">
          <label><span className="label-text">board size:</span>
            <input
              onChange={this.boardSizeChange}
              value={this.props.boardSize}
              type="number"
              min="2"
              max="7"
              className="input-size board-size"
              title="board size can be between 2 and 7, inclusive."
            />
          </label><br/>
        </div>

        <div className="row">
          <label><span className="label-text">players<br/><small>(names optional)</small>:</span></label>
          <div className="buttons-up-down">
            <input
              type="button"
              onClick={this.props.clickUpDown}
              className="players-count players-count-down"
              value="-"
            />
            <input
              type="button"
              onClick={this.props.clickUpDown}
              className="players-count players-count-up"
              value="+"
            />
          </div>
          <div className="gametip-container">
            <GameTip
              gameTipSmallBig={this.state.gameTipSmallBig}
              updateGameTipSmallBig={this.updateGameTipSmallBig}
              highLightTip={this.props.highLightTip}
            />
          </div>
        </div>

        <div className="row">
          <div className="player-names-list">
            {this.props.playerList.map( (field, idx) => (
              <input
                type="text"
                className={'player-names player-name-' + idx}
                key={idx}
                onChange={this.changePlayerNames}
                value={field}
              />
             ))}
          </div>
        </div>
        <div className="row">
            <div className="start-it-container">
            <button
              type="button"
              onClick={this.props.beginGame}
              className="start-it-button"
              title="Click to Begin Game"
            >Begin Game
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default GameForm;