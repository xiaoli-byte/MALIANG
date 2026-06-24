import { defineConfig } from 'umi';
import routes from './config/router/routes';
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes,
  fastRefresh: {},
  /**
   * @name 国际化插件
   * @doc https://umijs.org/docs/max/i18n
   */
  locale: {
    default: 'zh-CN',
  },
  webpack5: {},
  history: { type: 'hash' },
  // publicPath: '/bi/', 
  proxy: {
    '/aisos': {
      // 要代理的地址
      target: `http://111.19.166.16:10628`,
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
    },
  },
  // plugins: [
  //   new MonacoWebpackPlugin({
  //     languages: ['json']
  //   })
  // ]
  chainWebpack(config) {
    config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
      {
        languages: ['yaml', 'json', 'javascript', 'typescript'],
      },
    ]);
  },
});
