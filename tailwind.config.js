/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/components/**/*.tsx', './src/pages/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Neue Haas Grotesk Display', 'sans-serif'],
      },
      spacing: {
        // Define margins and gutters for the grid
        'grid-desktop-margin': '40px',
        'grid-desktop-gutter': '24px',
        'grid-mobile-margin': '16px',
        'grid-mobile-gutter': '20px',
      },
      maxWidth: {
        'grid-desktop': '1440px',  // Desktop grid container width
        'grid-mobile': '360px',    // Mobile grid container width
      },
      gridTemplateColumns: {
        // Define the number of columns for desktop and mobile grids
        'desktop': 'repeat(12, minmax(0, 1fr))',  // 12 columns for desktop
        'mobile': 'repeat(2, minmax(0, 1fr))',    // 2 columns for mobile
      },
      fontSize: {
        // Headings
        'h1-desktop': ['56px', { lineHeight: '120%' }], // Desktop H1
        'h1-mobile': ['40px', { lineHeight: '120%' }], // Mobile H1
        'h2-desktop': ['48px', { lineHeight: '120%' }], // Desktop H2
        'h2-mobile': ['32px', { lineHeight: '120%' }], // Mobile H2
        'h3-desktop': ['32px', { lineHeight: '140%' }], // Desktop H3
        'h3-mobile': ['24px', { lineHeight: '140%' }], // Mobile H3
        'h4-desktop': ['28px', { lineHeight: '150%' }], // Desktop H4
        'h4-mobile': ['16px', { lineHeight: '150%' }], // Mobile H4

        // Large Text (Text Sizes for Desktop & Mobile)
        'text-huge-desktop': ['48px', { lineHeight: '150%' }], // Desktop Huge Text
        'text-huge-mobile': ['40px', { lineHeight: '150%' }], // Mobile Huge Text
        'text-extra-large-desktop': ['36px', { lineHeight: '150%' }], // Desktop Extra Large Text
        'text-extra-large-mobile': ['32px', { lineHeight: '150%' }], // Mobile Extra Large Text
        'text-large-desktop': ['24px', { lineHeight: '150%' }], // Desktop Large Text
        'text-large-mobile': ['20px', { lineHeight: '150%' }], // Mobile Large Text

        // Medium Text
        'text-medium-desktop': ['18px', { lineHeight: '150%' }], // Desktop Medium Text
        'text-medium-mobile': ['16px', { lineHeight: '150%' }], // Mobile Medium Text

        // Regular Text
        'text-regular-desktop': ['16px', { lineHeight: '150%' }], // Desktop Regular Text
        'text-regular-mobile': ['14px', { lineHeight: '150%' }], // Mobile Regular Text

        // Small Text
        'text-small-desktop': ['14px', { lineHeight: '150%' }], // Desktop Small Text
        'text-small-mobile': ['12px', { lineHeight: '150%' }], // Mobile Small Text
      },
      colors: {
        'dark-pastel-red': 'var(--color-dark-pastel-red)',
        'bright-pastel-red': 'var(--color-bright-pastel-red)',
        'bright-pastel-pink': 'var(--color-bright-pastel-pink)',
        'pastel-brown': 'var(--color-pastel-brown)',
        'neon-yellow': 'var(--color-neon-yellow)',
        'pastel-azure': 'var(--color-pastel-azure)',
        'neutral-white': 'var(--color-neutral-white)',
        'neutral-lightest': 'var(--color-neutral-lightest)',
        'neutral-lighter': 'var(--color-neutral-lighter)',
        'neutral-light': 'var(--color-neutral-light)',
        'neutral': 'var(--color-neutral)',
        'neutral-dark': 'var(--color-neutral-dark)',
        'neutral-darker': 'var(--color-neutral-darker)',
        'neutral-darkest': 'var(--color-neutral-darkest)',
        'black': 'var(--color-black)',
        'beige-light': 'var(--color-beige-light)',
        'beige': 'var(--color-beige)',
        'beige-dark': 'var(--color-beige-dark)',
      },
    },
  },
  plugins: [],
};
