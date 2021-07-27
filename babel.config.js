/* 判断当前是开发阶段还是发布生产阶段 */
const prdPlugins = []
if (process.env.NODE_ENV === 'production') {
  /* 在生产阶段添加移除console插件 */
  prdPlugins.push('transform-remove-console')
}
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    ...prdPlugins //使用剩余参数将数组展开
  ]
}
