import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'build',

  resolve: {
    atomDirs: [
      // { type: 'component', dir: 'doc' },
    ],
  },
  monorepoRedirect: true,
  // plugins: ['./plugin/symlink'],
});
