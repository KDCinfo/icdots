import * as React from 'react';
import './App.css';

/**
 * My React-with-TypeScript version of a game inspired by a Codewars kata.
 *
 * Wikipedia: https://en.wikipedia.org/wiki/Dots_and_Boxes
 *
 * My JavaScript (Prototypal Inheritance) version is at: https://codepen.io/KeithDC/pen/rpKrgK
 */

import { IcdotsIS,
         NewGameIS,
         BoxesPinnedIS,
       } from './icdots/interfaces';

import Header from './icdots/components/Header';
// import Message from './icdots/components/Message';
import GameForm from './icdots/components/GameForm';
import Aside from './icdots/components/Aside';
import GameBoard from './icdots/components/GameBoard';
import History from './icdots/components/History';

import { mySVGHClicked64Uri, mySVGVClicked64Uri, mySVGHOpen64Uri, mySVGVOpen64Uri } from './icdots/components/SvgUri';

// import { renderToStaticMarkup } from 'react-dom/server';
// let { renderToStaticMarkup } = ReactDOMServer;

// console.clear();

class ICDots extends React.Component<{}, IcdotsIS> {
  constructor(props: default) {
    super(props); // We currently have no props at the root level.

    // Initialize a Game Object; for both new and live games.
    const initialGameObj = {
      gameNumber: 0,
      boardSize: 3,
      playerList: ['', '', ''],
      playerNameSpanTags: [],
      svgAllNodes: [],
      numOfBoxes: 9,
      numOfLines: 24,
      allBoxNodes: 49,
      linesPlayed: [],
      players: [0, 0, 0],
      boxesPinned: [],
      curPlayer: 1,
      curLine: 0,
      curLineDir: '',
    };

    this.state = {
      boardSize: 3,
      playerList: ['', '', ''],
      numOfBoxes: 9,
      numOfLines: 24, // (4 + ((3-1)*3)) + ((3-1) * (3 + ((3-1)*2)))
      allBoxNodes: 49, // ((this.state.boardSize * 2) + 1) * ((this.state.boardSize * 2) + 1)
      games: [],
      liveGame: initialGameObj,
      highLightTip: '',
      maskEmptyOrHidden: 'hidden',
      regCheck: /^[a-z0-9\s_\-']+$/i,
      SVGLib: {
        mySVGHClicked64: mySVGHClicked64Uri,
        mySVGVClicked64: mySVGVClicked64Uri,
        mySVGHOpen64: mySVGHOpen64Uri,
        mySVGVOpen64: mySVGVOpen64Uri
      },
    };
  }
  updateBoardSize = (newBoardSize: number) => {
    let liveGame = this.state.liveGame,
        numOfBoxes = Math.pow(2, newBoardSize), // A.k.a., 1 << newBoardSize (TS error: forbidden bitwise operation)
        numOfLines = (4 + ((newBoardSize - 1) * 3)) + ((newBoardSize - 1) * (3 + ((newBoardSize - 1) * 2))),
        allBoxNodes = ((newBoardSize * 2) + 1) * ((newBoardSize * 2) + 1);
    liveGame.boardSize = newBoardSize;
    liveGame.numOfBoxes = numOfBoxes;
    liveGame.numOfLines = numOfLines;
    liveGame.allBoxNodes = allBoxNodes;
    this.setState(
      {
        liveGame,
        boardSize: newBoardSize,
        numOfBoxes: numOfBoxes,
        numOfLines: numOfLines,
        allBoxNodes: allBoxNodes
      },
      () => this.adjustPlayerBoxes('max')
    );
  }
  showHighLight = () => {
    this.setState({ highLightTip: 'highlight' });
  }
  clearHighLight = () => {
    this.setState({ highLightTip: '' });
  }
  clickUpDown = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    const dir = evt.currentTarget.value;
    if (dir === '+') {
      if (this.state.playerList.length < this.state.boardSize) { // Below maximum (boardSize); Take it up a notch.
        this.adjustPlayerBoxes('up');
      } else {
        this.showHighLight();
      }
    } else if (dir === '-') {
      if (this.state.playerList.length > 2) {                    // Above minimum (2); Take it down a notch.
        this.adjustPlayerBoxes('down');
      } else {
        this.showHighLight();
      }
    }
  }
  adjustPlayerNames = (pkey: number, pname: string) => {
    this.clearHighLight();
    let playerList = this.state.playerList;
    playerList[pkey] = pname;
    this.setState({ playerList });
  }
  adjustPlayerBoxes = (dir: string) => {
    if (dir === 'up') {
      if (this.state.playerList.length < this.state.boardSize) {
        // add one
        this.clearHighLight();
        let newPlayerList = this.state.playerList;
        newPlayerList.push('');
        this.setState({ playerList: newPlayerList }); // Create new <input type='text' className='player-names' />
      } else {
        if (this.state.highLightTip.length === 0) {
          this.showHighLight(); // Maxed out. Highlight Gametip for hint.
        }
      }
    } else if (dir === 'down') {
      if (this.state.playerList.length > 2) {
        // remove one
        this.clearHighLight();
        let newPlayerList = this.state.playerList;
        newPlayerList.pop();
        this.setState({ playerList: newPlayerList }); // Remove one <input type='text' className='player-names' />
      } else {
        if (this.state.highLightTip.length === 0) {
          this.showHighLight(); // Min'd out. Highlight Gametip for hint.
        }
      }
    } else if (dir === 'max') {
      this.clearHighLight();
      let newPlayerList = this.state.playerList;
      while (newPlayerList.length > this.state.boardSize) {
        newPlayerList.pop();
      }
      this.setState({ playerList: newPlayerList }); // Remove up to max <input type='text' className='player-names' />
    }
  }
  beginGame = () => {
    this.clearHighLight();
    this.runPreChecks();
  }
  runPreChecks = () => {
    let // iBoard = this.state.boardSize,
        playerNamesArr = this.state.playerList,
        curNames = [],
        nameErrors = [];
    // Names can only contain A-Z 0-9 \W _ - '

    for (let ii = 0; ii < playerNamesArr.length; ii++) {
      if (playerNamesArr[ii].length !== 0) {
        // A name was entered for this field #
        if (this.state.regCheck.test(playerNamesArr[ii])) {
          // Passed our RegExp check
          curNames[ii] = playerNamesArr[ii];
        } else {
          // An invalid character? Log it, and assign something else.
          curNames[ii] = this.getName(curNames);
          nameErrors.push({
            playerNum: ii,
            nameOld: playerNamesArr[ii],
            nameNew: curNames[ii]
          });
        }
      } else {
        curNames[ii] = this.getName(curNames);
      }
    }
    this.setState({ playerList: curNames }, () => this.createGame());
    // this.createGame(); // iBoard, curNames, nameErrors
    // And now we're really good! Silver-like!
  }

  createGame = () => {

    const bPinned: BoxesPinnedIS[] = []; // {'box': boxNum, 'p': this.curPlayer };

    let mainBoard: JSX.Element[] = [],
        playerSpans: JSX.Element[] = [];

    const newGameObj: NewGameIS = {
      gameNumber: this.state.games.length === 0 ? 1 : this.state.games[this.state.games.length - 1].gameNumber + 1,
      boardSize: this.state.boardSize,
      playerList: this.state.playerList.slice(),
      numOfBoxes: this.state.numOfBoxes,
      numOfLines: this.state.numOfLines,
      allBoxNodes: this.state.allBoxNodes,
      linesPlayed: [],
      players: Array.from(Array(this.state.playerList.length), () => 0),
      playerNameSpanTags: playerSpans,
      svgAllNodes: mainBoard,
      boxesPinned: bPinned,
      curPlayer: 1,
      curLine: 0,
      curLineDir: '',
    };

    let gamesWithNewGame: NewGameIS[] = this.state.games; // Add this new game to current list of active games.
    gamesWithNewGame = gamesWithNewGame.concat(newGameObj);

    this.setState({ games: gamesWithNewGame, liveGame: newGameObj }, () => {
      // console.log('Game was successfully created.', newGameObj); // Game is set; Wait for player turn.
      this.applyPlayerNames();
      this.showBoard();
    });
  }

  applyPlayerNames = () => {
    // PUT PLAYER NAMES ON BOARD

    let displayPlayerNames: JSX.Element[] = [];

    this.state.liveGame.playerList.forEach( (n, i) => {
      let activeOrNo = (this.state.liveGame.curPlayer === (i + 1)) ? ' active' : '',
          nameClass = 'pname-' + i + activeOrNo;

      let // newP = `<playernum>${(i + 1)}</playernum><b>${n}</b> [ <score>0</score> ]`,
          // newP: JSX.Element = React.createElement('playernum', (i + 1)),
          // newB: JSX.Element = React.createElement('b', {}, n),
          // newS: JSX.Element = React.createElement('score', {}, 0),
          newP = <div className={'playernum'}>{(i + 1)}</div>,
          newB = <b>{n}</b>,
          newS = <div className={'score'}>[ {this.state.liveGame.players[i]} ]</div>,
          newC = (
                    <span
                      className={nameClass}
                    >{newP}{newB}{newS}
                    </span>
                  );
      displayPlayerNames.push(newC);
    });

    this.setPlayerNames(displayPlayerNames); // this.state.liveGame.playerNameSpanTags
  }

  showBoard = () => {
    this.setState({ maskEmptyOrHidden: '' });
  }
  hideBoard = () => {
    this.setState({ maskEmptyOrHidden: 'hidden' });
  }

  getName = (curNames: string[]) => {
    const rNames = ['Paper', 'Steckle', 'Lunarcey', 'Hydraple', 'D-31', 'Superr Duperr',
                    'Fortwone', 'Atlassed', 'Everwood', 'Oak', 'Abovert', 'Lethion',
                    'Elmentts', 'Qemple', 'Curry Ahn', 'Parry Over', 'Peezee',
                    'Central', 'Sentral', 'Cyglue', 'Get-a-Grip', 'Down Up',
                    'Xissors', 'Yoo Doo', 'Marsent', 'Tuthedoreon Ish'],
          getPick = () => Math.floor(Math.random() * rNames.length);

    let keepCnt = 0;
    let tmpPick = '';
    const getNameTry = () => {
      if (keepCnt > 7) {
        return;
      } else {
        keepCnt++;
      }

      tmpPick = rNames[getPick()];
      // if (curNames.includes(tmpPick)) { // TypeScript production build compiler doesn't support ES2016
      if (this.arrayContains(curNames, tmpPick)) {
        getNameTry();
      }
    };
    getNameTry();
    return tmpPick;
  }

  arrayContains = (locArr: string[], lookFor: string) => {
    var i = locArr.length;
    while (i--) {
      if (locArr[i] === lookFor) {
          return true;
      }
    }
    return false;
  }

  /*
    this.state = {
      boardSize:    3,
      playerList:   ['', '', ''],
      numOfBoxes:   9,
      numOfLines:   24, // (4 + ((3-1)*3)) + ((3-1) * (3 + ((3-1)*2)))
      allBoxNodes:  49, // ((this.state.boardSize * 2) + 1) * ((this.state.boardSize * 2) + 1)
      highLightTip: '',
      regCheck:     /^[a-z0-9\s_\-']+$/i,
      games:        [],
      maskEmptyOrHidden: 'hidden',
      liveGame:     initialGameObj,
  */

  setPlayerNames = (displayPlayerNames: JSX.Element[]) => {
    let thisLiveGame = this.state.liveGame;

    thisLiveGame.playerNameSpanTags = displayPlayerNames;

    // @TODO: Also update this active game in this.state.`games` array.
    this.setState({ liveGame: thisLiveGame  });
  }

  makeAPlay = (linePlay: number, linePlayDir: string) => {
    let thisLiveGame = this.state.liveGame;

    thisLiveGame.linesPlayed.push(linePlay);
    thisLiveGame.curLine = linePlay;
    thisLiveGame.curLineDir = linePlayDir;

    // @TODO: Also update this active game in this.state.`games` array.
    this.setState({ liveGame: thisLiveGame  }); // Update the live game with the play just made.
  }
  makeAScore = (curLiveGame: NewGameIS) => {
    // let thisLiveGame = this.state.liveGame;

    // Update the live game with the play just made.
    // @TODO: Also update this active game in this.state.`games` array.
    // this.setState({ liveGame: {...this.state.liveGame, ...curLiveGame } });
    this.setState({ liveGame: {...this.state.liveGame, curLiveGame}});
  }
  changePlayer = () => {
    let thisLiveGame = this.state.liveGame;

    thisLiveGame.curPlayer = (
      this.state.liveGame.curPlayer === this.state.liveGame.playerList.length
    ) ? 1 : this.state.liveGame.curPlayer + 1;

    // @TODO: Also update this active game in this.state.`games` array.
    // Update the live game with the play just made.
    this.setState({ liveGame: thisLiveGame  }, () => this.applyPlayerNames() );
  }
  updateSvgAllNodes = (newSvgAllNodes: JSX.Element[]) => {

    let thisLiveGame = this.state.liveGame;

    thisLiveGame.svgAllNodes = newSvgAllNodes;

    // @TODO: Also update this active game in this.state.`games` array.
    this.setState({ liveGame: thisLiveGame  });
    // this.setState({ svgAllNodes: updateSvgAllNodes(newSvgAllNodes) })
  }
  render() {
    return (
      <main>
        <div className="container">
          <Header />
          <GameForm
            {...this.state}
            updateBoardSize={this.updateBoardSize}
            clickUpDown={this.clickUpDown}
            adjustPlayerNames={this.adjustPlayerNames}
            showHighLight={this.showHighLight}
            clearHighLight={this.clearHighLight}
            beginGame={this.beginGame}
          />
          {/* <Message /> */}
          <Aside />
          <GameBoard
            maskEmptyOrHidden={this.state.maskEmptyOrHidden}
            setPlayerNames={this.setPlayerNames}
            playerNameSpanTags={this.state.liveGame.playerNameSpanTags}
            liveGame={this.state.liveGame}
            hideBoard={this.hideBoard}
            makeAPlay={this.makeAPlay}
            makeAScore={this.makeAScore}
            changePlayer={this.changePlayer}
            updateSvgAllNodes={this.updateSvgAllNodes}
          />
          <History />
        </div>
      </main>
    );
  }
}

export default ICDots;
