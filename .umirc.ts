import { defineConfig } from 'umi';
import routes from './config/routes';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes,
  history: { type: 'hash' },
  hash: true,
  fastRefresh: {},
});
