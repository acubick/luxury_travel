const merge             = require( 'webpack-merge' )
const baseWebpackConfig = require( './webpack.base.conf' )
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' )

const devWebpackConfig = merge( baseWebpackConfig, {
	// DEV settings gonna be here
	mode: 'development',
	
	devtool:   'eval-source-map',
	devServer: {
		// historyApiFallback: true,
		// noInfo: true,
		overlay:     {
			warnings: true,
			errors:   true
		},
//		contentBase: path.join( __dirname, 'dist' ),
		port:        4200
	}
	
},
	{
		plugins: [
			new MiniCssExtractPlugin({
				filename: 'bundle.css'
			})
		]
	}
	
	)
// export devWebpackConfig

module.exports = new Promise( (resolve, reject) => {
	return resolve( devWebpackConfig )
} )

