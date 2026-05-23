// Brand colors and theme constants
// Based on TUT! magazine ad campaign design system

export const PALETTES = {
  magPink: {
    name: 'Mag Pink',
    bg: '#FAE6D9',
    ink: '#1A1A1A',
    accent: '#C71F37',
    hot: '#FF2D7A',
  },
  peachPunch: {
    name: 'Peach Punch',
    bg: '#FFD7C2',
    ink: '#2B1810',
    accent: '#E63946',
    hot: '#FF6B35',
  },
  creamMagenta: {
    name: 'Cream Magenta',
    bg: '#FFE9F2',
    ink: '#1A1A1A',
    accent: '#FF1F8F',
    hot: '#C71585',
  },
  sunnySide: {
    name: 'Sunny Side',
    bg: '#FFF1E6',
    ink: '#1A1A1A',
    accent: '#FF6B9D',
    hot: '#E63946',
  },
};

// Default palette for app (messaging)
export const theme = PALETTES.magPink;

// Chat-specific colors
export const chatColors = {
  traceyBubble: '#ececec',
  traceyText: '#000000',
  userBubble: theme.hot,
  userText: '#ffffff',
  messageDots: '#999999',
  background: '#ffffff',
  statusBar: '#000000',
  timestamp: 'rgba(0,0,0,0.45)',
  separator: 'rgba(0,0,0,0.08)',
};

export const typography = {
  headerName: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#000000',
  },
  headerStatus: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.45)',
  },
  messageText: {
    fontSize: 13.5,
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 11,
    color: chatColors.timestamp,
  },
};
