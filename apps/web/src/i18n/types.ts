export type Language = "fr" | "en";

export interface Translations {
  // Navigation & Common
  appTitle: string;
  tagline: string;
  generationsTag: string;
  back: string;
  home: string;
  pokedex: string;
  stats: string;
  solo: string;
  multiplayer: string;
  loading: string;
  error: string;
  close: string;
  cancel: string;
  copy: string;
  copied: string;
  pts: string;
  sec: string;

  // Home
  nicknameLabel: string;
  nicknamePlaceholder: string;
  readyToPlay: string;
  classicTitle: string;
  classicDesc: string;
  classicBadge: string;
  dailyChallenge: string;
  blitzTitle: string;
  blitzDesc: string;
  blitzBadge: string;
  joinRoom: string;

  // Solo Setup & Game
  soloSetupTitle: string;
  generationsLabel: string;
  roundTimerLabel: string;
  startGame: string;
  roundIndicator: (current: number, total: number) => string;
  targetAriaLabel: (num: number) => string;
  targetHelper: string;
  inputPlaceholder: string;
  skipRound: string;

  // Round Result & Game Over
  roundResultTitle: string;
  targetWas: (num: number, name: string) => string;
  youAnswered: (name: string, num: number) => string;
  distancePoints: (diff: number, pts: number) => string;
  exactBonus: string;
  speedBonus: (pts: number) => string;
  noAnswer: string;
  nextRound: string;
  gameOverTitle: string;
  finalScore: string;
  bestScore: string;
  newBestScore: string;
  playAgain: string;
  sameSeries: string;
  newSeries: string;

  // Daily
  dailyTitle: string;
  dailyAlreadyDone: string;
  dailyYourScore: string;
  dailyStreak: (days: number) => string;
  shareScore: string;
  shareScoreCopied: string;

  // Blitz
  blitzSetupTitle: string;
  blitzDurationLabel: string;
  blitzStart: string;
  blitzTimeRemaining: string;
  blitzFoundCount: (count: number, total: number) => string;
  blitzTypePlaceholder: string;
  blitzGameOver: string;
  blitzFoundTitle: string;
  blitzMissedTitle: string;

  // Multiplayer Room & Join
  joinTitle: string;
  roomCodeLabel: string;
  enterRoomCodePlaceholder: string;
  joinAction: string;
  roomTitle: (code: string) => string;
  playersTitle: (count: number) => string;
  hostBadge: string;
  waitingForHost: string;
  needMorePlayers: string;
  startParty: string;
  gameModeLabel: string;
  inviteFriends: string;
  copyRoomLink: string;
  scanQrCode: string;
  leaveRoom: string;
  reconnectingBanner: string;
  finalRankings: string;
  rank: (pos: number) => string;

  // Pokedex
  pokedexTitle: string;
  pokedexSearchPlaceholder: string;
  allGenerations: string;
  generationN: (n: number) => string;
  noPokemonFound: string;
  pokedexPageOf: (current: number, total: number) => string;
  prevPage: string;
  nextPage: string;
  typesLabel: string;
  heightLabel: string;
  weightLabel: string;
  generationLabel: string;

  // Stats
  statsTitle: string;
  classicStats: string;
  blitzStats: string;
  dailyStats: string;
  gamesPlayed: string;
  averageScore: string;
  successRate: string;
  historyTitle: string;
  clearHistory: string;
  noHistoryYet: string;

  // Error boundary & fallback
  errorBoundaryTitle: string;
  errorBoundaryDesc: string;
  errorBoundaryReturn: string;
}
