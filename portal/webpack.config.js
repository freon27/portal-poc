const webpack = require('webpack');
const path = require('path');
const applications = require('./applications.config.json');

const PORT = 8080;

const devApplications = {
    app1: {
        proxy: 'http://localhost:4201',
        rewrite: true
    },
    app2: {
        proxy: 'http://localhost:4202',
        rewrite: true
    },
    header: {
        proxy: 'http://localhost:3000',
        rewrite: true
    }
};

module.exports = {
    entry: [
        __dirname + '/main.js',
        __dirname + '/main.css'
    ],
    output: {
        path: process.cwd() + '/build',
        filename: '[name].js',
        publicPath: '/build/',
        jsonpFunction: 'portalWebpackJsonp'
    },
    devtool: 'inline-source-map',
    devServer: {
        port: PORT,
        publicPath: '/build/',
        contentBase: './',
        historyApiFallback: true,
        proxy: getProxyConfig(applications, devApplications),
    },
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, './'),
        ],
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.html$/,
                exclude: /node_modules|svelte/,
                loader: 'html-loader',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: getBabelConfig(),
            }
        ],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            minChunks: module => module.context && module.context.indexOf('node_modules') !== -1
        }),
    ],
};

function getBabelConfig() {
    return {
        presets: [
            ['babel-preset-env', {
                targets: {
                    'browsers': ['last 2 versions'],
                },
            }],
        ],
        plugins: [
            'transform-object-rest-spread',
            'transform-class-properties',
            'syntax-dynamic-import',
            'transform-function-bind',
        ],
    };
}

function getProxyConfig(applications, devApplications) {
    const proxy = {};
    for (app of applications) {
        const path = app.baseHref + '/';
        let target = `http://localhost:${PORT}/build/${path}`;

        let rewritePath = false;
        if (devApplications.hasOwnProperty(app.name)) {
            target = devApplications[app.name].proxy ? devApplications[app.name].proxy : target;
            rewritePath = devApplications[app.name].rewrite;
        }
        proxy[path] = {
            target: target,
            bypass: function (req, res, proxyOptions) {
                if (req && req.headers && req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
                    console.log('bypass');
                    return '/index.html';
                }
            }
        };

        if (rewritePath) {
            proxy[path].pathRewrite = {
                [path]: ''
            }
        }
    }
    return proxy;
}

/**
 function getProxyConfig(applications, devApplications) {
  const proxy = {};
  for (const appName of Object.keys(devApplications)) {
    const application = applications.find(a => a.name === appName);
    const path = application.baseHref + '/';
    proxy[path] = {
      target: devApplications[appName],
      pathRewrite: {
        [path]: ''
      },
      bypass: function (req, res, proxyOptions) {
        if (req.headers.accept.indexOf('html') !== -1) {
          return '/index.html';
        }
      }
    };
  }
  return proxy;
}
 */