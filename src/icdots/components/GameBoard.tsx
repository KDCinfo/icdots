import * as React from 'react';
import '../../App.css';

import { GameBoardIP, GameBoardIS } from '../../icdots/interfaces';

import { mySVGHClicked64Uri, mySVGVClicked64Uri, mySVGHOpen64Uri, mySVGVOpen64Uri } from './SvgUri';

class GameBoard extends React.Component<GameBoardIP, GameBoardIS> {
  constructor(props: GameBoardIP) {
    super(props);

    this.state = {
      mainBoardBackgroundColor: 'rgba(50,205,205,.5)',
      mainBoardWidth: '315px',
      gotABoxArr: [], // Per turn; Sets if/which boxes are pinned.
      localCurLine: 0,
      svgAllNodes: [],
      SVGLib: {
        mySVGHClicked64: mySVGHClicked64Uri,
        mySVGVClicked64: mySVGVClicked64Uri,
        mySVGHOpen64: mySVGHOpen64Uri,
        mySVGVOpen64: mySVGVOpen64Uri
      }
    };
  }

  componentWillMount() {
    // const ourBoard = document.querySelector('.game-board'),
    //       mainBoard = ourBoard.querySelector('.main-board');

    this.runTheGrid();
  }

  componentWillReceiveProps(prevProps: GameBoardIP, prevState: GameBoardIS) {
    // Types of lines:
       // Light dashed - Clickable
       // Solid        - Clicked

    if (prevProps.liveGame.svgAllNodes !== this.props.liveGame.svgAllNodes ||
        prevProps.liveGame.playerNameSpanTags !== this.props.liveGame.playerNameSpanTags ||
        prevProps.liveGame.playerList !== this.props.liveGame.playerList) {

      let newWidth = (45 * ((this.props.liveGame.boardSize * 2) + 1)).toString() + 'px';
      this.setState({ mainBoardWidth: newWidth }); // Nothing depends on this setState.

      this.runTheGrid();
      this.applyPlayerNames();
    }
  }

  componentDidUpdate(prevProps: GameBoardIP, prevState: GameBoardIS) {
    if (prevProps.liveGame.curLine !== this.state.localCurLine) {
      this.setState({localCurLine: prevProps.liveGame.curLine});
    }
  }

  // Initialization of the entire Grid -- Will populate this.props.liveGame.svgAllNodes

  runTheGrid = () => {
    // let runTheGrid = () => {

    var createDiv = (idx: number, cssClass: string, clickLine?: number) => {

      // This function is called from (right below) within a loop of "allBoxNodes".
      // `clickLine` is only counted and passed with horizontal and vertical clickable lines.
      let newElementOut = <div />, // React.createElement('div'), // <div />
          newElementIn = <div />; // React.createElement('div'); // <div />

      let newElementInFn = (classNm: string, styleNm: string) => {
        return <div className={classNm} style={{backgroundImage: styleNm}} />;
      };

      let newElementOutFn = (
        classNm: string,
        elContent: JSX.Element,
        elClick?: (evt: React.SyntheticEvent<HTMLDivElement>) => void
      ) => {
        return <div className={classNm} onClick={elClick}>{elContent}</div>;
      };

      // UPDATE LINES

      if (cssClass.indexOf('lh') > 0) {

        newElementIn = newElementInFn(
          'div-svgH node-' + clickLine,
          this.state.SVGLib.mySVGHOpen64
        ); // React.createElement('div'); // <div />
        newElementOut = newElementOutFn(
          cssClass + ' node-' + clickLine,
          newElementIn,
          this.play
        );

      } else if (cssClass.indexOf('lv') > 0) {

        newElementIn = newElementInFn(
          'div-svgV node-' + clickLine,
          this.state.SVGLib.mySVGVOpen64
        ); // React.createElement('div'); // <div />
        newElementOut = newElementOutFn(
          cssClass + ' node-' + clickLine,
          newElementIn,
          this.play
        );
      } else {

        newElementOut = newElementOutFn(
          cssClass,
          newElementIn,
        );
      }
      return newElementOut;
    };

    let gridRow = 0,
        gridCol = 0,
        curClickNode = 1,
        mainBoard: JSX.Element[] = [];

    for (let i = 0; i < this.props.liveGame.allBoxNodes; i++) {

      if (gridRow % 2 === 0 && gridCol % 2 === 0) {
        mainBoard.push(createDiv(i, 'mb-node mb-dot'));
      } else if (gridRow % 2 === 0 && gridCol % 2 !== 0) {
        mainBoard.push(createDiv(i, 'mb-node mb-lh open', curClickNode)); // .play() is 1-based
        curClickNode++;
      } else if (gridRow % 2 !== 0 && gridCol % 2 === 0) {
        mainBoard.push(createDiv(i, 'mb-node mb-lv open', curClickNode));
        curClickNode++;
      } else if (gridRow % 2 !== 0 && gridCol % 2 !== 0) {
        mainBoard.push(createDiv(i, 'mb-node mb-space'));
      // } else if (false) {
      //   mainBoard.push(createDiv(i, 'mb-node mb-play'));
      }
      gridCol = ((i > 0) && ((i + 1) % ((this.props.liveGame.boardSize * 2) + 1) === 0)) ? 0 : gridCol + 1;
      gridRow = (gridCol === 0) ? gridRow + 1 : gridRow;
    }

    this.props.updateSvgAllNodes(mainBoard);

    // [end of] runTheGrid();
  }

  applyPlayerNames = () => {
    // PUT PLAYER NAMES ON BOARD

    let displayPlayerNames: JSX.Element[] = [];

    this.props.liveGame.playerList.forEach( (n, i) => {
      let activeOrNo = (this.props.liveGame.curPlayer === (i + 1)) ? ' active' : '',
          nameClass = 'pname-' + i + activeOrNo;

      let newP = <div className={'playernum'}>{(i + 1)}</div>,
          newB = <b>{n}</b>,
          newS = <div className={'score'}>[ {this.props.liveGame.players[i]} ]</div>,
          newC = (
                    <span
                      className={nameClass}
                    >{newP}{newB}{newS}
                    </span>
                  );
      displayPlayerNames.push(newC);
    });

    this.props.setPlayerNames(displayPlayerNames); // this.state.liveGame.playerNameSpanTags
  }

  // SOMEONE CLICKED... LET'S PLAY!!!

  play = (evt: React.SyntheticEvent<HTMLDivElement>) => {
    // See if play is good or not
    // If good, run check for sides === 4 (successful pins)
    // All 4-sided boxes that do not exist in [boxesPinned]
    // If found, allow to play again.
    const classListArr = Array.from(evt.currentTarget.classList),
          classListArrC = Array.from(evt.currentTarget.children[0].classList),
          classListNode = classListArr.filter(e => e.indexOf('node-') === 0),
          lineNum = classListNode[0].split('-')[1],
          linePlay = parseInt(lineNum, 10);
    const classListDir = classListArrC.filter(e => e.indexOf('div-svg') === 0);
    const nodeDir = classListDir[0].split('svg')[1];
    // classListArr:   ["div-svgH", "node-9"]  // classListNode:   ["node-9"]
    // lineNum typeof: "9" "string"            // linePlay typeof: 9 "number"
    // classListDir:   ["div-svgH"]            // nodeDir:         "H"
    // this.boardSize: 3                       // this.curPlayer:  1

    // this.gotABoxArr = []; // If non-empty: a player pinned a box: player goes again.
    this.setState({ gotABoxArr: [] }, () => {

      // Check the play
      if (linePlay >= 1 &&
          linePlay <= this.props.liveGame.numOfLines &&
          this.props.liveGame.linesPlayed.indexOf(linePlay) === -1
        ) {
          // GOOD PLAY: Good check directly after Number check and before others; Good checks come before bad.
          this.updateLinePlay(linePlay, nodeDir); // Line in Play: Set the play line so other methods can access it.
                                                  // Line in Play's pointing direction: "H" | "V"
          this.tryPlay();

      } else if (this.props.liveGame.linesPlayed.indexOf(linePlay) >= 0) {
        throw new Error('Oops. UI should\'ve disabled that option.');  // already played (a.k.a., "How'd you do that?")

      } else if (linePlay < 0 || linePlay > this.props.liveGame.numOfLines) {
        throw new Error('How\'d you go out-of-bounds?');   // play out of bounds (again with the, "How'd you do that?")

      } else {
        throw new Error('Wait... what happened? What\'d you do?');  // No play (a.k.a., What else is there?)
      }

      // Change players or end game
      if (this.props.liveGame.linesPlayed.length === this.props.liveGame.numOfLines) {
        alert('Good game!'); // Disable board // Enable 'Play Again' button

      } else  if (this.state.gotABoxArr.length === 0) { // If no boxes were filled; move to next player.
        this.changePlayer();
      }
    });
  }
  /*
    "About to..."     this.updateLinePlay()
    "updateLinePlay:" 8 H
    "About to..."     this.tryPlay()
    "notFound:"       4 | [8] bottom | 8 [8]
    "notFound:"       1 | [8] right | 1 [8]
    "playing:"        ^div-svg.*node-8$ 8 H [{…}]
    "About to..."     this.changePlayer()
    "componentDidUpdate" prevProps.liveGame:  {numOfBoxes: 9, numOfLines: 24, ...}
    "componentDidUpdate" this.state:
  */
  updateLinePlay = (linePlay: number, linePlayDir: string) => {
    const expected = Number;
    if (linePlay.constructor === expected) {
      // this.linesPlayed.push(linePlay);
      // console.log('updateLinePlay: ', linePlay, linePlayDir);
      this.props.makeAPlay(linePlay, linePlayDir);
    } else {
      console.log('Error: Expected: ' + expected + ', Got: ', linePlay.constructor);
    }
  }

  tryPlay = () => {
    const borderBoxes = this.getAdjacentBoxes();  // Array of boxes adjacent to selected line.
    let newABoxArr: number[] = [];
    borderBoxes.forEach( boxNum => {
      if (this.checkIfBoxed(boxNum)) {    // Run 'boxed in' (pinned) check.
                                          // If you're in here, you scored! Good job!!
        // this.gotABoxArr.push(boxNum);  // Will capture if 1 or 2 boxes were pinned.
        newABoxArr = this.state.gotABoxArr;
        newABoxArr.push(boxNum);
        this.setState({ gotABoxArr: newABoxArr });

        let thisLiveGame = this.props.liveGame;
        thisLiveGame.players[this.props.liveGame.curPlayer - 1]++; // Scores (boxes pinned per player)
        thisLiveGame.boxesPinned.push({'box': boxNum, 'p': this.props.liveGame.curPlayer });
        // ^ Array of objects: [{'box': 1, 'p': 2 }]

        // console.log('About to... tryPlay -> makeAScore(thisLiveGame): ', thisLiveGame);
        this.props.makeAScore(thisLiveGame);
        // this.curPlayer: 1  // this.gotABoxArr: [1]  // this.boxesPinned: [{box: 1, p: 1}]  // this.players: [1, 0]
      }
    });
    this.updateCurLine(newABoxArr);   // SET DASHED LINE TO SOLID
    // this.updateScores(); // UPDATE PLAYER SCORES
    this.applyPlayerNames();
  }

  updateCurLine = (newABoxArr: number[]) => {
    /** SET DASHED LINE TO SOLID
     *    and remove listener
     *    and remove cursor/outline styling (.open)
     */

    let cssClass = '',
        clickedLineIdx = 0,
        regStr = '^div-svg.*node-' + this.props.liveGame.curLine + '$',
        newReg = new RegExp(regStr),
        newSvgAllNodes = this.props.liveGame.svgAllNodes.slice();

    newSvgAllNodes.forEach( (e, i) => {
      if (e.props.children && e.props.children.props.className && newReg.test(e.props.children.props.className)) {
        clickedLineIdx = i; // this.props.liveGame.svgAllNodes
      }
    });

    if (newABoxArr.length > 0) {

      let boxRowSize = (this.props.liveGame.boardSize * 2) + 1, // =(5*2)+1 // Line count for each row; 5-board = [11]
          boxRowNum = 0;

      newABoxArr.forEach( (boxNum, i) => {

        boxRowNum = Math.ceil(boxNum / this.props.liveGame.boardSize) - 1;

        let colNum = boxNum - (boxRowNum * this.props.liveGame.boardSize),
                //      5   - ((   1   *   3  )  *  3)
            nodeIndex = boxRowSize + ((boxRowSize * 2) * boxRowNum ) + (colNum * 2) - 1;

        let newElementOut = <div />,
            newElementIn = <div />;

        cssClass = 'mb-node mb-space';

        let newElementInFn = (playerNum: number) => {
          return <div>{this.props.liveGame.curPlayer}</div>;
        };
        let newElementOutFn = (classNm: string, elContent: JSX.Element) => {
          return <div className={classNm}>{elContent}</div>;
        };

        newElementIn = newElementInFn(boxNum);
        newElementOut = newElementOutFn(
          cssClass,
          newElementIn
        );
        newSvgAllNodes[nodeIndex] = newElementOut; // 0-48; numOfBoxes
      });
    }

    if (this.props.liveGame.curLineDir.toUpperCase() === 'H') {         // HORIZONTAL LINES

      let newElementOut = <div />, // React.createElement('div'),
          newElementIn = <div />;  // React.createElement('div');

      cssClass = 'mb-node mb-lh';

      let newElementInFn = (classNm: string, styleNm: string) => {
        return <div className={classNm} style={{backgroundImage: styleNm}} />;
      };
      let newElementOutFn = (classNm: string, elContent: JSX.Element) => {
        return <div className={classNm}>{elContent}</div>;
      };

      newElementIn = newElementInFn(
        'div-svgH node-' + clickedLineIdx,
        this.state.SVGLib.mySVGHClicked64
      );
      newElementOut = newElementOutFn(
        cssClass + ' node-' + clickedLineIdx,
        newElementIn
      );
      newSvgAllNodes[clickedLineIdx] = newElementOut;

    } else if (this.props.liveGame.curLineDir.toUpperCase() === 'V') {  // VERTICAL LINES

      let newElementOut = <div />, // React.createElement('div'),
          newElementIn = <div />;  // React.createElement('div');

      cssClass = 'mb-node mb-lv';

      let newElementInFn = (classNm: string, styleNm: string) => {
        return <div className={classNm} style={{backgroundImage: styleNm}} />;
      };
      let newElementOutFn = (classNm: string, elContent: JSX.Element) => {
        return <div className={classNm}>{elContent}</div>;
      };

      newElementIn = newElementInFn(
        'div-svgV node-' + clickedLineIdx,
        this.state.SVGLib.mySVGVClicked64
      ); // React.createElement('div'); // <div />
      newElementOut = newElementOutFn(
        cssClass + ' node-' + clickedLineIdx,
        newElementIn
      );
      newSvgAllNodes[clickedLineIdx] = newElementOut;
    }
    // this.setState({ svgAllNodes: newSvgAllNodes });
    this.props.updateSvgAllNodes(newSvgAllNodes);
  }

  changePlayer = () => {
    // this.updatePlayerSpans();
    this.props.changePlayer();
  }

  getAdjacentBoxes = () => {
    /**
     *  Get the box number to each side of the selected line.
     *
     *  In the case of the first and last rows, there is always only 1 box below or above it.
     */
    let boxedArray = [],
        lastRowFirstLine = this.props.liveGame.numOfLines - this.props.liveGame.boardSize + 1,
        lastRowFirstBox = (this.props.liveGame.curLine >= lastRowFirstLine) ? (
          (this.props.liveGame.boardSize * this.props.liveGame.boardSize) -
          (this.props.liveGame.numOfLines - this.props.liveGame.curLine)
        ) : 0;

    if (this.props.liveGame.curLine <= this.props.liveGame.boardSize) { // First Row
      boxedArray.push(this.props.liveGame.curLine);
      return boxedArray;
    }

    if (lastRowFirstBox > 0) {            // Last Row
      boxedArray.push(lastRowFirstBox);
      return boxedArray;
    }

    const boxRowBase = (this.props.liveGame.boardSize * 2) +
            this.props.liveGame.boardSize + 1, // =(5+(5*2)+1) // Base box row size; 5-board = [16]
          boxRowSize = (this.props.liveGame.boardSize * 2) + 1, // =(5*2)+1 // Line count for each row; 5-board = [11]
          boxRowNum = (this.props.liveGame.curLine <= boxRowBase) ?
            0 :
            Math.ceil((this.props.liveGame.curLine - this.props.liveGame.boardSize) / boxRowSize) - 1,
                         // CEILING(C4/((5*2)+1);1) // 0, 1, ..., boardSize (each row)
          boxBaseLineNum = boxRowBase - (( (boxRowSize * (boxRowNum + 1)) +
            this.props.liveGame.boardSize) -
            this.props.liveGame.curLine),
                         // Individual number 1-(16) [16]
                         // =( 5 + (5 * 2) + 1) - (( (11 * 1) + 5) - C4)
                         // =(5+(5*2)+1)-(((11*1)+5)-C4) // Each row, when being calc'd as a base, has 1-(16)
          // boxNumBase = (this.props.liveGame.boardSize * boxRowNum) + boxBaseLineNum,
                         // =IF ( ( T4 >= 5 + 1 ) AND ( T4 <= 5 + 5 ); ( 5 * R5 ) + T4 ; "False")
          // boxBelowTrue = (boxBaseLineNum >= 1) && (boxBaseLineNum <= this.props.liveGame.boardSize),
                         // V4 = boxBaseLineNum // =(V4 >= 1) AND (V4 <= 5) // Nice stat, but not currently used.

          boxLeftNum =  (boxBaseLineNum >= (this.props.liveGame.boardSize + 2) &&
                         boxBaseLineNum <= (this.props.liveGame.boardSize + this.props.liveGame.boardSize + 1)) ?
                                            (this.props.liveGame.boardSize * boxRowNum) +
                                            (boxBaseLineNum - this.props.liveGame.boardSize - 1) : 0,
                         // =IF ( V4 >= 5 + 2 ) AND ( V4 <= 5 + 5 + 2 )
                         // ( 5 * R11 ) + ( T10 - 5 )

          boxRightNum = (boxBaseLineNum >= (this.props.liveGame.boardSize + 1) &&
                         boxBaseLineNum <= (this.props.liveGame.boardSize + this.props.liveGame.boardSize)) ?
                                            (this.props.liveGame.boardSize * boxRowNum) +
                                            (boxBaseLineNum - this.props.liveGame.boardSize) : 0,
                         // =IF ( V4 >= 5 + 1 ) AND ( V4 <= 5 + 5 )

          boxAboveNum = (boxBaseLineNum >= ((this.props.liveGame.boardSize * 2) + 2) &&
                         boxBaseLineNum <= ((this.props.liveGame.boardSize * 3) + 1)) ?
                                            (this.props.liveGame.boardSize * boxRowNum) +
                                            (boxBaseLineNum - boxRowSize) : 0;
                         // =IF ( V4 >= ((5 * 2) + 1) + 1) AND ( V4 <= ((5 * 3) + 1))
    // End of constant assignments . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .^

    let boxBelowNum = 0;

    if (boxBaseLineNum >= 1 && boxBaseLineNum <= this.props.liveGame.boardSize) {
      boxBelowNum = (this.props.liveGame.boardSize * boxRowNum) + boxBaseLineNum;
    } else if (boxBaseLineNum > boxRowSize && (boxRowNum + 1) < this.props.liveGame.boardSize) {
      boxBelowNum = (this.props.liveGame.boardSize * boxRowNum) +
      (boxBaseLineNum - boxRowSize + this.props.liveGame.boardSize);
    }                    // =IF ( (V4 >= 1) AND (V4 <= 5); V4 * R5; "False") // Box number or 0 (for none)

    // console.log('above: ', boxBaseLineNum, boxRowNum, boxRowSize);

    if (boxBelowNum > 0) { boxedArray.push(boxBelowNum); }
    if (boxLeftNum > 0) { boxedArray.push(boxLeftNum); }
    if (boxRightNum > 0) { boxedArray.push(boxRightNum); }
    if (boxAboveNum > 0) { boxedArray.push(boxAboveNum); }

    //   [boxRowBase] 16  |  [boxRowSize] 11  |  [boxRowNum] 3  |  [boxBaseLineNum] 16  |  [boxNumBase] 31

    //   [boxAboveNum] 20  |  [boxBelowNum] 25  |  [boxLeftNum] 0  |  [boxRightNum] 0  |  [boxedArray] [25, 20]

    return boxedArray;
  }

  checkIfBoxed = (boxNum: number) => {
    let thisBox = [],
        notFound = '0',
        borderLines = this.get4BoxLines(boxNum);
    // console.log('checkIfBoxed: ', borderLines, boxNum, this.props.liveGame.linesPlayed);

    // TOP
    if (this.props.liveGame.linesPlayed.indexOf(borderLines.top) >= 0) {
      thisBox.push(borderLines.top);
    } else { notFound = 'top'; }

    // LEFT
    if (this.props.liveGame.linesPlayed.indexOf(borderLines.left) >= 0) {
      thisBox.push(borderLines.left);
    } else { notFound = 'left'; }

    // RIGHT
    if (this.props.liveGame.linesPlayed.indexOf(borderLines.right) >= 0) {
      thisBox.push(borderLines.right);
    } else { notFound = 'right'; }

    // BOTTOM BOX
    if (this.props.liveGame.linesPlayed.indexOf(borderLines.bottom) >= 0) {
      thisBox.push(borderLines.bottom);
    } else { notFound = 'bottom'; }

    if (notFound !== '0') {
      // console.log('notFound: ', boxNum, '|', thisBox, notFound);
      // console.log('notFound: ', borderLines.top, this.props.liveGame.linesPlayed);
    }
    return (thisBox.length === 4) ? true : false;
  }

  get4BoxLines = (boxNum: number) => {
    let boardR = Math.ceil(boxNum / this.props.liveGame.boardSize) - 1,
        // colNum = boxNum - (boardR * this.props.liveGame.boardSize), // This should equal boardC...?
        boardC = boxNum % this.props.liveGame.boardSize === 0 ?
          this.props.liveGame.boardSize :
          boxNum % this.props.liveGame.boardSize,
        base = (((this.props.liveGame.boardSize * 3)
               + 1
               - this.props.liveGame.boardSize) * boardR),
        top    = base + boardC,
        left   = base + this.props.liveGame.boardSize + boardC,
        right  = base + this.props.liveGame.boardSize + boardC + 1,
        bottom = base + ((this.props.liveGame.boardSize * 2) + 1) + boardC;
    return {
      'top': top,
      'left': left,
      'right': right,
      'bottom': bottom
    };
  }

  changeMainBoardBackground = (evt: React.SyntheticEvent<HTMLSelectElement>) => {
    this.setState({mainBoardBackgroundColor: evt.currentTarget.value});
  }

  render() {
    return (
      <div>
        <div className={'game-board-mask ' + this.props.maskEmptyOrHidden} />
        <div className={'game-board ' + this.props.maskEmptyOrHidden}>{/* ourBoard */}

          <div className="welcome">Pick a line (gap)... Any line (gap)!</div>

          <div
            className="main-board"
            style={{
              backgroundColor: this.state.mainBoardBackgroundColor,
              width: this.state.mainBoardWidth
            }}
          >
            {/* {console.log('in Render: ', this.props.liveGame.svgAllNodes)} */}
            {this.props.liveGame.svgAllNodes.map( (box, idx) => (
              <React.Fragment key={idx}>{box}</React.Fragment>
            ))}
          </div>

          <div className="main-board-stats">
            {this.props.liveGame.playerNameSpanTags.map( (spanTag, idx) => (
              <React.Fragment key={idx}>{spanTag}</React.Fragment>
            ))}
          </div>

          <div className="main-board-footer">
            <div className="footer-left">
              <label>Board Background:
                <select
                  className={'main-board-background'}
                  onChange={this.changeMainBoardBackground}
                  value={this.state.mainBoardBackgroundColor}
                >
                  <option value="rgba(50,205,205,.5)">default</option>
                  <option value="aqua">aqua</option>
                  <option value="aquamarine">aquamarine</option>
                  <option value="black">black</option>
                  <option value="chartreuse">chartreuse</option>
                  <option value="darkblue">dark blue</option>
                  <option value="darkgreen">dark green</option>
                  <option value="darkred">dark red</option>
                  <option value="lightskyblue">light sky blue</option>
                  <option value="lightgreen">light green</option>
                  <option value="lime">lime</option>
                  <option value="limegreen">lime green</option>
                  <option value="midnightblue">midnight blue</option>
                  <option value="mistyrose">misty rose</option>
                  <option value="palegreen">pale green</option>
                  <option value="purple">purple</option>
                  <option value="skyblue">sky blue</option>
                  <option value="tan">tan</option>
                  <option value="turquoise">turquoise</option>
                  <option value="wheat">wheat</option>
                </select>
              </label>
            </div>
            <div className="footer-right">
              <button
                onClick={this.props.hideBoard}
                className="main-board-close"
                type="button"
                title="Exit Game"
              >Exit Game
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GameBoard;