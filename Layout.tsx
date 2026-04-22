@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Playfair Display", ui-serif, Georgia, serif;

  --color-paper: #FDFCFB;
  --color-paper-alt: #F9F7F5;
  --color-ink: #1A1A1A;
  --color-forest: #1B3022;
  --color-slate: #4A4743;
  --color-bronze: #8C8882;
  --color-divider: #E5E2DE;
  
  --shadow-subtle: none; /* Moving away from shadows towards line-based structure */
}

@layer base {
  body {
    @apply bg-paper text-ink font-sans antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-serif font-semibold tracking-tight;
  }
}

@layer utilities {
  .tracking-widest-pro {
    letter-spacing: 0.2em;
  }
}

.editorial-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 0; /* Removing gap to favor intentional borders */
}

.border-standard {
  @apply border-divider;
}
