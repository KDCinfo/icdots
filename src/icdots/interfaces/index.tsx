export interface IcdotsIS {
  boardSize: number;
  playerList: string[];
  numOfBoxes: number;
  numOfLines: number;
  allBoxNodes: number;
  highLightTip: string;
  regCheck: RegExp;
  maskEmptyOrHidden: string;
  games: NewGameIS[];
  liveGame: NewGameIS;
  SVGLib: MySVGIS;
}

export interface GameFormIP {
  boardSize: number;
  playerList: string[];
  highLightTip: string;
  regCheck: RegExp;
  updateBoardSize: (newBoardSize: number) => void;
  clickUpDown: (evt: React.SyntheticEvent<HTMLInputElement>) => void;
  adjustPlayerNames: (pkey: number, pname: string) => void;
  showHighLight: () => void;
  clearHighLight: () => void;
  beginGame: () => void;
}

export interface GameTipIP {
  gameTipSmallBig: string;
  highLightTip: string;
  updateGameTipSmallBig: (tipClass: string) => void;
}

export interface NewGameIS {
  gameNumber: number;
  boardSize: number;
  playerList: string[];
  numOfBoxes: number;
  numOfLines: number;
  allBoxNodes: number;
  linesPlayed: number[];
  players: number[];
  playerNameSpanTags: JSX.Element[];
  svgAllNodes: JSX.Element[];
  boxesPinned: BoxesPinnedIS[];
  curPlayer: number;
  curLine: number;
  curLineDir: string;
}

export interface BoxesPinnedIS {
  box: number;
  p: number;
}

export interface GameBoardIP {
  maskEmptyOrHidden: string;
  playerNameSpanTags: JSX.Element[];
  liveGame: NewGameIS;
  updateSvgAllNodes: (newSvgAllNodes: JSX.Element[]) => void;
  setPlayerNames: (displayPlayerNames: JSX.Element[]) => void;
  makeAPlay: (linePlay: number, linePlayDir: string) => void;
  makeAScore: (curLiveGame: NewGameIS) => void;
  changePlayer: () => void;
  hideBoard: () => void;
}

export interface GameBoardIS {
  mainBoardBackgroundColor: string;
  mainBoardWidth: string;
  gotABoxArr: number[];
  localCurLine: number;
  SVGLib: MySVGIS;
  svgAllNodes: JSX.Element[];
}

export interface MySVGIS {
  mySVGHClicked64: string;
  mySVGVClicked64: string;
  mySVGHOpen64: string;
  mySVGVOpen64: string;
}

export interface MySVGClicked64Props {
  width: number;
  height: number;
  cx1: number;
  cy1: number;
  cx2: number;
  cy2: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  lc1: string;
}
export interface MySVGOpen64Props {
  width: number;
  height: number;
  cx1: number;
  cy1: number;
  cx2: number;
  cy2: number;
  x11: number;
  y11: number;
  x21: number;
  y21: number;
  x12: number;
  y12: number;
  x22: number;
  y22: number;
  lc1: string;
}
