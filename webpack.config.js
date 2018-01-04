var webpack = require('webpack');

module.exports = {
    entry: [
        './demo/index.js'
    ],
    output: {
        path: __dirname + '/demo',
        publicPath: '/demo',
        filename: 'bundle.js'
    },
    devtool: process.env.NODE_ENV === 'production' ? 'cheap-module-source-map' : 'cheap-module-eval-source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                    use: [
                    'style-loader',
                    'css-loader?importLoaders=1',
                    'postcss-loader'
                    ]
            }
        ],
        loaders: [
            {
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    'css-loader?importLoaders=1',
                    'postcss-loader'
                ]
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            },
            {
                test: /\.json$/,
                loader: "json"
            }
        ]
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    devServer: {
        historyApiFallback: true,
        contentBase: './'
    }
};