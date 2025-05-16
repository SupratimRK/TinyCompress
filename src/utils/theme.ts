// Theme system for the application
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  light: string;
  dark: string;
  background: string;
}

// Define multiple themes
const themes: Record<string, ThemeColors> = {
  indigo: {
    primary: '#4f46e5',
    secondary: '#818cf8',
    accent: '#c7d2fe',
    light: '#f3f4f6',
    dark: '#1f2937',
    background: 'bg-gradient-to-br from-indigo-50 to-blue-50',
  },
  emerald: {
    primary: '#10b981',
    secondary: '#34d399',
    accent: '#a7f3d0',
    light: '#f3f8f6',
    dark: '#064e3b',
    background: 'bg-gradient-to-br from-emerald-50 to-teal-50',
  },
  rose: {
    primary: '#e11d48',
    secondary: '#fb7185',
    accent: '#fecdd3',
    light: '#fff1f2',
    dark: '#881337',
    background: 'bg-gradient-to-br from-rose-50 to-pink-50',
  },
  amber: {
    primary: '#d97706',
    secondary: '#fbbf24',
    accent: '#fef3c7',
    light: '#fffbeb',
    dark: '#78350f',
    background: 'bg-gradient-to-br from-amber-50 to-yellow-50',
  },
  violet: {
    primary: '#7c3aed',
    secondary: '#a78bfa',
    accent: '#ddd6fe',
    light: '#f5f3ff',
    dark: '#4c1d95',
    background: 'bg-gradient-to-br from-purple-50 to-violet-50',
  },
  cyan: {
    primary: '#0891b2',
    secondary: '#22d3ee',
    accent: '#a5f3fc',
    light: '#ecfeff',
    dark: '#155e75',
    background: 'bg-gradient-to-br from-cyan-50 to-sky-50',
  }
};

// Get a random theme
export function getRandomTheme(): string {
  const themeNames = Object.keys(themes);
  const randomIndex = Math.floor(Math.random() * themeNames.length);
  return themeNames[randomIndex];
}

// Get specific theme colors
export function getThemeColors(themeName: string): ThemeColors {
  return themes[themeName] || themes.indigo; // Default to indigo if theme not found
}

// Helper function to convert hex to RGB for CSS variables
function hexToRgb(hex: string): string {
  // Remove the # if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Return as comma-separated RGB
  return `${r}, ${g}, ${b}`;
}

// Apply theme to CSS variables
export function applyTheme(themeName: string): void {
  const theme = getThemeColors(themeName);
  const root = document.documentElement;
  
  // Set color values
  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-secondary', theme.secondary);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-light', theme.light);
  root.style.setProperty('--color-dark', theme.dark);
  
  // Set RGB versions for opacity operations
  root.style.setProperty('--color-primary-rgb', hexToRgb(theme.primary));
  root.style.setProperty('--color-secondary-rgb', hexToRgb(theme.secondary));
  root.style.setProperty('--color-accent-rgb', hexToRgb(theme.accent));
  // Remove existing theme background classes
  document.body.classList.forEach(className => {
    if (className.startsWith('bg-gradient-to-') || 
        className.startsWith('from-') || 
        className.startsWith('to-')) {
      document.body.classList.remove(className);
    }
  });
  
  // Add new background class - split by space to avoid DOM exception
  const backgroundClasses = theme.background.split(' ');
  backgroundClasses.forEach(className => {
    document.body.classList.add(className);
  });
}
