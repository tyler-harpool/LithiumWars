export const factionStyles = {
  mechanist: {
    gradient: 'from-neutral-800 via-blue-900/10 to-neutral-900',
    accent: 'blue',
    border: 'border-blue-900/50',
    glow: 'shadow-blue-500/20',
    accentLight: 'rgb(59, 130, 246)',
    accentDark: 'rgb(30, 58, 138)'
  },
  luminari: {
    gradient: 'from-neutral-800 via-purple-900/10 to-neutral-900',
    accent: 'purple',
    border: 'border-purple-900/50',
    glow: 'shadow-purple-500/20',
    accentLight: 'rgb(168, 85, 247)',
    accentDark: 'rgb(88, 28, 135)'
  },
  swarmborn: {
    gradient: 'from-neutral-800 via-red-900/10 to-neutral-900',
    accent: 'red',
    border: 'border-red-900/50',
    glow: 'shadow-red-500/20',
    accentLight: 'rgb(239, 68, 68)',
    accentDark: 'rgb(127, 29, 29)'
  }
} as const;
