var settings = require('./config')

// Express server, which handles requests on port 3001
var path = require('path')
var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var mongoose = require('mongoose')
var passport = require('passport')
var session = require('express-session')
var bluebird = require('bluebird')
var mongoStore = require('connect-mongo')(session)
var favicon = require('serve-favicon');
var app = express()

app.use(favicon(path.join(__dirname, '/src/assets/favicon.ico')))

app.set('port', settings.expressPort)

app.use('/', express.static(path.join(__dirname, '/src')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(cookieParser())

//app.use(session({secret: 'fart', resave: true, saveUninitialized: true}))

//peresistent login sessions in mongodb
app.use(session({
  secret: 'fart',
  resave: true,
  saveUninitialized: true,
  maxAge: new Date(Date.now() + 36000000),
  store: new mongoStore(
    { mongooseConnection:mongoose.connection })
}))

app.use(passport.initialize())
app.use(passport.session())
var initPassport = require('./passport/init')
initPassport(passport)

// connect to MongoDB

mongoose.Promise = bluebird
mongoose.connect('mongodb://localhost/shitlistanitsocialmediatest', function (err, db) {
  if (!err) {
    console.log('Connected to Database. . .')
  } else {
    console.log(err)
  }
})

require('./models/Thread')
require('./models/Comment')
require('./models/User')

var routes = require('./routes/index')(passport)
app.use('/', routes)


app.listen(app.get('port'), function () {
  console.log('Express server started at http://localhost:' + settings.expressPort + '/')
})

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

// Hot-reloading dev-server
new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  // Proxy backend requests to Express server
  proxy: {
    "/api/*": {
      target: "http://localhost:" + settings.expressPort,
      secure: false
    }
  }
}).listen(settings.webpackServerPort, 'localhost', function (err, result) {
  if (err) {
    return console.log(err);
  }

  console.log('Webpack dev react server listening at http://localhost:' + settings.webpackServerPort +  '/');
});

