import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const palette = {
  // --- BRAND IDENTITY ---
  neoMint: '#00D09C',    // Primary: Success, Active, Primary Buttons
  mpesaRose: '#EF4444',  // Error: Alerts, Sell, Negative Trends (Improved accessibility)
  deepSpace: '#0F1115',  // Background: Deep Dark OLED
  gunmetal: '#1E293B',   // Surface: Cards, Inputs, Modals
  slate: '#334155',      // Borders: Subtle dividers
  
  // --- NEUTRALS ---
  starlight: '#FFFFFF',  // Main Text (Pure White for OLED pop)
  silver: '#94A3B8',     // Secondary Text (Muted Slate)
  
  // --- UTILITY ---
  warning: '#F59E0B',    // Amber for security reminders
  info: '#3B82F6',       // Blue for informational tips
  transparent: 'transparent',
};

export const colors = {
  // 1. Core Backgrounds
  background: palette.deepSpace,  
  eigengrau: palette.deepSpace,   // Compatibility with legacy code
  surface: palette.gunmetal,      
  secondaryColor: palette.gunmetal, 

  // 2. Interactive / Action
  primary: palette.neoMint,       
  accentColor: palette.neoMint,
  error: palette.mpesaRose,
  warning: palette.warning,
  info: palette.info,

  // 3. Text
  textPrimary: palette.starlight,   // Headers
  textColor: palette.starlight,     // Compatibility
  textSecondary: palette.silver,    // Body/Labels
  bodyTextColor: palette.silver,    // Compatibility
  
  // 4. Borders & Glass
  border: palette.slate,
  divider: 'rgba(255, 255, 255, 0.05)', // Super subtle lines
  glass: 'rgba(255, 255, 255, 0.03)',   // For frosted glass effects
  
  // 5. Utility
  white: '#FFFFFF',
  black: '#000000',
  transparent: palette.transparent,
};

export const theme = {
  colors,
  sizes: {
    width,
    height,
    base: 16,
    radius: 20,         // Modern, more rounded corners
    padding: 24,
    h1: 32,
    h2: 24,
    t16: 16,
    t14: 14,
    t12: 12,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
  },
  // Added fonts structure for cleaner usage in styles
  fonts: {
    SourceSans3_400Regular: { fontFamily: 'SourceSans3-Regular' },
    SourceSans3_600SemiBold: { fontFamily: 'SourceSans3-SemiBold' },
    SourceSans3_700Bold: { fontFamily: 'SourceSans3-Bold' },
  }
};