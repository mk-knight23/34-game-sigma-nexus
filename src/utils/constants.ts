export const STORAGE_KEYS = {
  SETTINGS: 'rangesync-settings',
  STATS: 'rangesync-stats',
} as const

export const KEYBOARD_SHORTCUTS = [
  { key: 'Ctrl + R', action: 'Reset' },
  { key: 'Escape', action: 'Close' },
  { key: 'H', action: 'Toggle Help' },
  { key: '?', action: 'Show Shortcuts' },
] as const
