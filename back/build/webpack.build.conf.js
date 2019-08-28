const merge             = require( 'webpack-merge' )
const baseWebpackConfig = require( './webpack.base.conf' )
const OptimizeCssAssetsPlugin = require( 'optimize-css-assets-webpack-plugin' )
const UglifyJsPlugin          = require( 'uglifyjs-webpack-plugin' )

const buildWebpackConfig = merge( baseWebpackConfig, {
		// BUILD settings gonna be here
		mode:    'production',
		devtool: false,
		plugins: []
	}, {
		optimization: {
			minimizer:   [ new OptimizeCssAssetsPlugin( {} ),
			               new UglifyJsPlugin( {} ) ],
			splitChunks: {
				cacheGroups: {
					vendor: {
						name:    'vendors',
						test:    /node_modules/,
						chunks:  'all',
						enforce: true
					}
				}
			}
			
		}
	}
)

// export buildWebpackConfig
module.exports = new Promise( (resolve, reject) => {
	return resolve( buildWebpackConfig )
} )
