import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Caminhos relativos: o build funciona em qualquer hospedagem estática,
// inclusive em subpastas como a do GitHub Pages.
export default defineConfig({
  base: './',
  plugins: [react()],
});
