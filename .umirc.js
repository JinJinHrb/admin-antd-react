// ref: https://umijs.org/config/
export default {
  nodeModulesTransform: {
    type: 'none',
  },
  //   plugins: [
  //     // ref: https://umijs.org/plugin/umi-plugin-react.html
  //     ['umi-plugin-react', {
  //       antd: true,
  //       dva: {
  //         loading: true,
  //       },
  //       dynamicImport: true,
  //       title: 'umi',
  //       dll: true,
  //       pwa: false,
  //       routes: {
  //         exclude: [],
  //       },
  //       hardSource: false,
  //     }],
  //   ],
  antd: {},
  // dva: {
  //     loading: true,
  // },
  dynamicImport: {},
  title: 'umi',
  // dll: true,
  // pwa: false,
  // routes: {
  //     exclude: [],
  // },
  // hardSource: false,
  proxy: {
    '/api': {
      target: 'http://localhost:8002',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  fastRefresh: {},
};
