var gQuery = require('../middleware/graphqlQuery.js');
var categMapping = require('../middleware/categoryMapping.js');

var renderArticle = function(req, res) {
  gQuery.articleQuery(req.params.articleID).then(function(result) {
		var article = result.getArticleDetail || {};
    article.video = null;
    article.mediaGroup.forEach(function(media, idx) {
      if (media.type === "videos") {
        article.video = article.mediaGroup[idx];
      }
    });
    var categ = req.params.categ;
    article.ename = categMapping.nameToEname[categ];
    article.adTag = categMapping.nameToAdTag[categ].detail;
    res.render('articleDetail', article); 
  }, function(err) {
    console.error(err);
    res.sendStatus(500, err);
  });
};

module.exports = {
  renderArticle: renderArticle
};
