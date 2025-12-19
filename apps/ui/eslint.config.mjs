import { configs } from '@vuenm/eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig({
  extends: [configs.vue],
  files: ['src/**/*.vue', 'src/**/*.ts'],
});
