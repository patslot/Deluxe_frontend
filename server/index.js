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
  var events = require('./routes/events.js')(gQuery, categMapping, queryHandler)
  var api = require("./routes/api.js")(options.edmSubscriptionEndpoint);

  app.locals.GRAPHQL_ENDPOINT = options.graphqlEndpoint;
  app.locals.AD_PREFIX_TAG = options.adPrefixTag;
  app.locals.AD_WEB_BASE_TAG = options.adWebBaseTag;
  app.locals.AD_MOBILE_BASE_TAG = options.adMobileBaseTag;
  app.locals.GA_CODE = options.GA_CODE;
  app.locals.LOGGING_GEO_API = options.LOGGING_GEO_API;
  app.use(express.static('public'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.set('view engine', 'ejs');

  app.use("/api", api);

  app.get('/', home.render);
  // TODO: Add favicon.ico?
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
  app.get('/Event', events.renderEvents);
  app.get('/:categ/:articleID/:title', article.renderArticle);
  app.get('/:categ', article.renderArticles);
  app.get('/article/:articleID', article.renderArticle);

  app.use(function(err, req, res, next) {
    console.error(err);
    if (req.accepts(["text/html", "application/json"]) === "application/json") {
      return res.status(500).json({status: 500, message: err});
    }
    return res.status(500).render("500", { menu: {main: [], sub: []} });
  });

  app.use(function(req, res) {
    if (req.accepts(["text/html", "application/json"]) === "application/json") {
      return res.status(404).json({status: 404, message: "not found"});
    }
    return res.status(404).render("404", { menu: {main: [], sub: []} });
  });

  return app;
}
