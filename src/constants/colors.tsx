// src/constants/theme.ts

const palette = {
  // --- BRAND IDENTITY ---
  neoMint: '#00D09C',    // Primary: Crypto, Growth, Buy, Success
  mpesaRose: '#FF3B5C',  // Secondary: Fiat, Sell, Withdraw, Error
  deepSpace: '#0B0E11',  // Background: Secure, Deep Dark
  gunmetal: '#1B2028',   // Surface: Cards, Inputs, Modals
  
  // --- NEUTRALS ---
  starlight: '#F5F7FA',  // Main Text (Readable White)
  silver: '#9CA3AF',     // Secondary Text (Muted)
  onyx: '#2A303C',       // Borders, Dividers
  
  // --- UTILITY ---
  white: '#FFFFFF',
  transparent: 'transparent',
};

export const colors = {
  // 1. Core Backgrounds
  eigengrau: palette.deepSpace,  // Main App Background
  secondaryColor: palette.gunmetal, // Card Background
  imageBackground: palette.gunmetal, 

  // 2. Text Colors
  white: palette.white,
  textColor: palette.starlight,   // Headings
  bodyTextColor: palette.silver,  // Paragraphs
  
  // 3. Brand Accents
  primary: palette.neoMint,       // USE THIS for "Get Started" / "Buy"
  accentColor: palette.neoMint,   // Kept for backward compatibility
  
  // 4. Functional Colors
  vividTangerine: palette.mpesaRose, // USE THIS for "Withdraw" / "Sell"
  error: palette.mpesaRose,
  
  // 5. Borders & Dividers
  onyx: palette.onyx,
  
  // 6. Extras (Kept for compatibility, but harmonized)
  apricot: '#FFD9C3', 
  transparent: 'transparent',
};

export const theme = {
  colors,
  sizes: {
    base: 16,
    radius: 16,
    padding: 24,
    h1: 34,
    h2: 24,
    t16: 16,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
  },
};