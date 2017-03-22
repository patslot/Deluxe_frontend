var express = require('express');
var bodyParser = require('body-parser');
var categMapping = require('./middleware/categoryMapping.js');
var app = express();

module.exports = function(options) {
  var gQuery = require('./middleware/graphqlQuery.js')(options.graphqlEndpoint);
  var queryHandler = require('./middleware/queryHandler.js')();
  var home = require('./routes/home.js')(gQuery, queryHandler);
  var article = require('./routes/article.js')(gQuery, categMapping, queryHandler);
  var contributor = require('./routes/contributor.js')(gQuery, categMapping, queryHandler);

  app.locals.GRAPHQL_ENDPOINT = options.graphqlEndpoint;
  app.locals.AD_PREFIX_TAG = options.adPrefixTag;
  app.locals.AD_WEB_BASE_TAG = options.adWebBaseTag;
  app.locals.AD_MOBILE_BASE_TAG = options.adMobileBaseTag;
  app.use(express.static('public'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.set('view engine', 'ejs');

  app.get('/', home.render);
  app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
  });

  if (options.isTesting === "true") {
    var testHelper = require('./middleware/testHelper.js')();
    app.get('/campaign/:categID/:image', testHelper.sendCampImage);
    app.get('/campaign/compone/:categID/:image', testHelper.sendComponeImage);
  }

  app.get('/Contributor', contributor.renderIndex);
  app.get('/Contributor/:contrName', contributor.renderArticles);
  app.get('/:categ/:articleID/:title', article.renderArticle);
  app.get('/:categ', article.renderArticles);

  return app;
}
