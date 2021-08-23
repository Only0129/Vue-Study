const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);
const webpack = require('webpack');

const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const theme = require('./src/assets/css/CommonLess.json').theme;

// const baseUrl = require('./src/config/baseUrl')
module.exports = {
	// 基本路径
	// baseUrl: '',
	publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
	// 输出文件目录
	outputDir: 'dist',
	// eslint-loader 是否在保存的时候检查
	lintOnSave: true,
	//配置打包后放置生成的静态资源 (js、css、img、fonts) 的目录
	assetsDir: 'static',
	// webpack配置
	configureWebpack: {
		//如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中。
		// https://cli.vuejs.org/zh/config/#configurewebpack
		// 开发生产共同配置
		resolve: {
			extensions: ['.js', '.vue', '.json', '.less'], // 可以省略后缀名
			alias: {
				vue$: 'vue/dist/vue.esm.js', //加上这一句
				'@': path.resolve(__dirname, './src'),
				'@c': path.resolve(__dirname, './src/components'),
			},
		},
		//devtool详解:https://www.cnblogs.com/chris-oil/p/8856020.html
		devtool: 'cheap-module-source-map',
		//gizp插件结束开始
		optimization: {
			splitChunks: {
				chunks: 'all', //块的范围，有三个可选值：initial/async动态异步加载/all全部块(推荐)，默认为async;
				minSize: 30000, //代码分割的最小值，默认30k；
				maxSize: 0,
				minChunks: 1, //模块被引用次数多少时才会进行代码分割，默认为1；
				maxAsyncRequests: 5, //最大的按需(异步)加载次数，默认为5
				maxInitialRequests: 3, //最大的初始化加载次数，默认为3；
				automaticNameDelimiter: '~',
				automaticNameMaxLength: 30,
				name: true, //拆分出来块的名字(Chunk Names)，默认由块名和hash值自动生成；
				cacheGroups: {
					//缓存组
					vendors: {
						//key 为entry中定义的 入口名称
						test: /[\\/]node_modules[\\/]/,
						priority: -10, //优先级
					},
					default: {
						minChunks: 2,
						priority: -20,
						reuseExistingChunk: true, //复用之前的打包模块
					},
				},
			},
		},
		plugins: [
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery',
				jquery: 'jquery',
				'windows.jQuery': 'jquery',
			}),
			// Ignore all locale files of moment.js
			new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

			// 配置compression-webpack-plugin压缩
			new CompressionWebpackPlugin({
				algorithm: 'gzip',
				test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
				threshold: 10240,
				minRatio: 0.8,
			}),
			new webpack.optimize.LimitChunkCountPlugin({
				maxChunks: 5,
				minChunkSize: 100,
			}),
		],
		//gizp插件结束
		externals: {
			// 新加这部分
			// 'vue': 'Vue',
			// 'element-ui': 'element-ui',
			// 'ant-design-vue': 'ant-design-vue',
		},
	},

	chainWebpack: (config) => {
		//https://cli.vuejs.org/zh/config/#chainwebpack
		config.when(process.env.NODE_ENV === 'development', (config) => config.devtool('cheap-module-eval-source-map'));
		/* 修复热更新失效*/
		config.resolve.symlinks(true);
		/* 添加分析工具 */
		if (process.env.NODE_ENV === 'production') {
			if (process.env.npm_config_report) {
				console.log(process.env.npm_config_report);
				config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin).end();
				config.plugins.delete('prefetch');
			}
		}
		config.when(process.env.NODE_ENV !== 'development', (config) => {
			config.optimization.splitChunks({
				chunks: 'all',
				cacheGroups: {
					libs: {
						name: 'chunk-libs',
						test: /[\\/]node_modules[\\/]/,
						priority: 10,
						chunks: 'initial', // only package third parties that are initially dependent
					},
					antd: {
						name: 'chunk-antd', // split elementUI into a single package
						priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
						test: /[\\/]node_modules[\\/]_?ant-design-vue(.*)/,
					},
					commons: {
						name: 'chunk-commons',
						test: resolve('src/components'), // can customize your rules
						minChunks: 3, //  minimum common number
						priority: 5,
						reuseExistingChunk: true,
					},
				},
			});
			config.optimization.runtimeChunk('single');
		});
		/* 提取公共代码 */
	},

	// 生产环境是否生成 sourceMap 文件
	productionSourceMap: false,
	// css相关配置
	css: {
		// 是否使用css分离插件 ExtractTextPlugin
		// extract: true,
		// 开启 CSS source maps?
		sourceMap: true,
		// css预设器配置项
		loaderOptions: {
			less: {
				lessOptions: {
					// If you are using less-loader@5 please spread the lessOptions to options directly
					modifyVars: theme,
					javascriptEnabled: true,
					included: /node_modules/,
				},
			},
		},
		// 启用 CSS modules for all css / pre-processor files.
		// modules: false
		// requireModuleExtension: true
	},
	// use thread-loader for babel & TS in production build
	// enabled by default if the machine has more than 1 cores
	parallel: require('os').cpus().length > 1,
	// PWA 插件相关配置
	// see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
	pwa: {},
	// webpack-dev-server 相关配置
	devServer: {
		open: true,
		host: '0.0.0.0',
		port: 8008,
		https: false,
		hot: true,
		proxy: {
			// 设置代理
			// proxy all requests starting with /api to json
			'/api1': {
				target: 'http://localhost:5000', //真实请求的目标地址
				changeOrigin: true,
				// secure: false,//https改为false
				pathRewrite: {
					'^/api1': '',
				},
			},
		},
	},
	// 第三方插件配置
	pluginOptions: {
		// ...
	},
};
