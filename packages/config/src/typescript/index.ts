import type { CompilerOptions } from 'typescript';

const config: CompilerOptions = {
  target: 'ES2020',
  lib: ['DOM', 'DOM.Iterable', 'ESNext'],
  module: 'ESNext',
  skipLibCheck: true,
  moduleResolution: 'bundler',
  allowImportingTsExtensions: true,
  resolveJsonModule: true,
  isolatedModules: true,
  noEmit: true,
  strict: true,
  noUnusedLocals: true,
  noUnusedParameters: true,
  noFallthroughCasesInSwitch: true,
  jsx: 'react-jsx',
};

export default config; 