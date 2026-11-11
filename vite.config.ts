import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// Build ONE classic script (IIFE) so a plain <script src="..."> works on any page,
// including pages opened from file://. ES modules would not.
export default defineConfig(({ command }) => ({
  plugins: [preact()],
  // Library builds do not replace this automatically; some libs read it at runtime.
  define: command === 'build' ? { 'process.env.NODE_ENV': '"production"' } : {},
  build: {
    target: 'es2019',
    lib: {
      entry: 'src/element.tsx',
      name: 'SavannaHello',
      formats: ['iife'],
      fileName: () => 'savanna-hello.js',
    },
  },
}))
