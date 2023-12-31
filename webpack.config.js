const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: process.env.NODE_ENV || 'development',
	entry: './client/index.js',
	// Target: 'electron-renderer',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, './electron/build'),
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: path.resolve(__dirname, 'index.html'),
		}),
	],
	performance: {
		hints: false,
	},
	devServer: {
		historyApiFallback: true,
		port: 8080,
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				router: () => 'http://localhost:3000',
			},
		},
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react'],
					},
				},
			},
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				use: 'ts-loader',
			},
			{
				test: /\.s[ac]ss$/i,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.(png|jp(e*)g|svg|gif)$/,
				loader: 'file-loader',
			},
		],
	},
	resolve: {
		extensions: ['.jsx', '.js'],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
};
