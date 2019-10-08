/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

'use strict';

/* eslint-env node */

const path = require( 'path' );
const webpack = require( 'webpack' );
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );
const CKEditorWebpackPlugin = require( '@ckeditor/ckeditor5-dev-webpack-plugin' );
const UglifyJsWebpackPlugin = require( 'uglifyjs-webpack-plugin' );

module.exports = {
    // To enable sourcemap, uncomment this line.
    // devtool: 'source-map',
    performance: { hints: false },

    entry: [
        require.resolve('regenerator-runtime/runtime.js'),
        path.resolve( __dirname, 'src', 'decoupled-editor-with-collaboration.js' )
    ],

    output: {
        // The name under which the editor will be exported.
        library: 'DecoupledEditor',

        path: path.resolve( __dirname, 'build' ),
        filename: 'decoupled-editor-with-collaboration.js',
        libraryTarget: 'umd',
        libraryExport: 'default'
    },

    optimization: {
        minimizer: [
            new UglifyJsWebpackPlugin( {
                // To enable sourcemap, uncomment this line.
                // sourceMap: true,
                uglifyOptions: {
                    output: {
                        // Preserve CKEditor 5 license comments.
                        comments: /^!/
                    }
                }
            } )
        ]
    },

    plugins: [
        new CKEditorWebpackPlugin( {
            // UI language. Language codes follow the https://en.wikipedia.org/wiki/ISO_639-1 format.
            // When changing the built-in language, remember to also change it in the editor configuration (src/ckeditor.js).
            language: 'en',
            additionalLanguages: 'all'
        } )
        // ,
        //     new webpack.BannerPlugin( {
        //             banner: [
        //                     'CKEditor 5 with collaboration features is licensed only under a commercial license and is protected by copyright law.',
        //                     'For more details about available licensing options please contact us at' +
        //                     ' https://ckeditor.com/contact/.'
        //             ].join( '\n' )
        //     } )
    ],

    module: {
        rules: [
            {
                test: /\.svg$/,
                use: [ 'raw-loader' ]
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [ require( '@babel/preset-env' ) ]
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            singleton: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: styles.getPostCssConfig( {
                            themeImporter: {
                                themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
                            },
                            minify: true
                        } )
                    },
                ]
            },
        ]
    }
};
