import { terser } from 'rollup-plugin-terser';
import size from 'rollup-plugin-size';
import ts from '@rollup/plugin-typescript';

/**
 * @type import('rollup').RollupOptions
 */
const config = {
  input: './src/useStatusTransition.ts',
  output: {
    file: 'dist/useStatusTransition.js',
    format: 'umd',
    name: 'useStatusTransition',
    exports: 'named',
    globals: {
      react: 'React',
    },
  },
  external: ['react'],
  plugins: [ts(), terser(), size()],
};

export default config;
