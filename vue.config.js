/* 使用chainWebpack的方式修改webpack的默认配置 */
module.exports = {
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      /* 修改生产模式下打包入口文件 */
      config
        .entry('app')
        .clear()
        .add('./src/main-prd.js')

      config.set('externals', {
        vue: 'Vue',
        axios: 'axios',
        'vue-quill-editor': 'VueQuillEditor',
        lodash: '_',
        nprogress: 'NProgress',
        echarts: 'echarts',
        'vue-router': 'VueRouter'
			})
			/* 在html插件中添加属性表明当前是生产模式 */
			config.plugin('html').tap(args => {
				args[0].isProd = true
				return args
			})
    })
    config.when(process.env.NODE_ENV === 'development', config => {
      /* 修改开发模式下打包入口文件 */
      config
        .entry('app')
        .clear()
				.add('./src/main-dev.js')
			
				config.plugin('html').tap(args => {
					args[0].isProd = false
					return args
				})
    })
  }
}
