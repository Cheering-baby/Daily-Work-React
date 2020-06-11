// ref: https://umijs.org/config/
import os from 'os';
import defaultSettings from './src/defaultSettings';
import path from 'path';

export default {
  // https://umijs.org/zh/config/#minimizer
  // hash --> Type: Boolean Default: false
  // 是否开启 hash 文件后缀。
  hash: true,
  publicPath: defaultSettings.publicPath,
  history: 'hash',
  devtool: 'source-map', // add for transfer to umi
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          // 开启dva
          immer: true,
        },
        routes: {
          // exclude: [/models/, /locales/, /service/, /components/, /utils/, /config.js/],
          exclude: [
            /(consts|models|messages|locales|services|components|utils|hooks)/,
            /model\.js/,
            /config\.js/,
          ],
        },
        targets: {
          ie: 10,
        },
        dynamicImport: {
          // 实现路由级的动态加载
          loadingComponent: './components/PageLoading/index', // 指定加载时的组件路径
        },
        ...(!process.env.TEST && os.platform() === 'darwin' // 非测试 并且是mac的话
          ? {
              dll: {
                // 通过 webpack 的 dll 插件预打包一份 dll 文件来达到二次启动提速的目的
                include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
                exclude: ['@babel/runtime'],
              },
            }
          : {}),
        title: 'portal-frontend',
        dll: false,
      },
    ],
    [
      './plugins/localePlugin',
      {
        enable: true,
        default: 'en-US',
        baseNavigator: true,
      },
    ],
  ],
  targets: {
    // 配置浏览器最低版本，会自动引入 polyfill 和做语法转换，配置的 targets 会和合并到默认值，所以不需要重复配置
    ie: 10,
  },
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: defaultSettings.theme,
  ignoreMomentLocale: true,

  lessLoaderOptions: {
    // 给 less-loader 的额外配置项
    javascriptEnabled: true, // 允许在less中写js
  },
  disableRedirectHoist: true, // 禁用 redirect 上提
  cssLoaderOptions: {
    // 开启css模块化
    modules: true,
    // 配置生成的标识符
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      } // 直接返回类名
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = antdProPath
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `portal${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
      // 类名为antd-pro-pages-dashboard-analysis-rankingTitle
    },
  },
  manifest: {
    // 生成manifest.json文件
    name: 'ant-design-pro',
    background_color: '#FFF',
    description: 'An out-of-box UI solution for enterprise applications as a React boilerplate.',
    display: 'standalone',
    start_url: '/index.html',
    icons: [
      {
        src: '/favicon.png',
        sizes: '48x48',
        type: 'image/png',
      },
    ],
  },
  cssnano: {
    // css压缩
    mergeRules: false,
  },
  urlLoaderExcludes: [/\.(png|jpe?g|gif)$/, /\.(ttf|eot|woff|woff2|svg)$/],
  chainWebpack(config) {
    config.module
      .rule('svg-with-file')
      .test(/\.(ttf|eot|woff|woff2|svg)$/)
      .use('svg-with-file-loader')
      .loader('file-loader')
      .options({
        name: 'statics/[name]-[hash:8].[ext]',
      });
    config.module
      .rule('image-file')
      .test(/\.(png|jpe?g|gif)$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        limit: 10000,
        name: 'statics/[name]-[hash:8].[ext]',
      });
    config.output.filename('[name].[hash].js').end();
    config.resolve.alias.set('@', path.join(__dirname, 'src'));
  },
};
