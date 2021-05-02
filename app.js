const express = require('express');
const app = express();
const routes = require('./src/routes/routes');
const http = require('http');
require('dotenv').config();

app.set('HTTPport', process.env.HTTP_PORT || 80);

//Best practices app settings
app.set('title', 'parkingservices');
app.set('query parser', `extended`);

const clientUrl = '*';

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", clientUrl);
  res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, HEAD,PUT,DELETE,PATCH");
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

/**
 * Essential Express middlewares
 */
app.use(express.urlencoded({
  extended: false
}))
app.use(express.json())

//Handles routes in the app
app.use('/api', routes);

// When route is not found error messege is thrown
app.use('/', (req, res) => {
  res.status(404).send({
    'error': 'Route not found.'
  });
});

/**
 *  @Create a HTTP service. 
 */
var httpServer = http.createServer(app);
httpServer.listen(app.get('HTTPport'), () => {
  console.log(`Find the HTTP server at: http://localhost:${app.get('HTTPport')}/`); // eslint-disable-line no-console
});
