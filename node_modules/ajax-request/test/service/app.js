var express = require('express');
var app = express();
var path = require('path');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');

app.use(serveStatic(path.join(__dirname, 'assets'), { index: false }));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/', function (req, res) {
  res.send('html');
});

app.get('/json', function(req, res) {
  res.send({
    id: 1
  });
});

app.get('/chinese', (req, res) => {
  res.send({
    v: '2010款1.6L 手动逸俊版'
  })
})

app.get('/querystring', function(req, res) {
  res.send(req.query);
});

app.post('/save', function(req, res) {
  res.send(req.body);
});

app.get('/500', function(req, res) {
  res.status(500);
  res.send('error');
});

module.exports = app;