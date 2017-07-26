export default function($timeout, $scope, $attrs, gqModel, c, queryHandler,
  articleUtil) {
  var categEname = $attrs.categEname;
  var categName = $attrs.categName;
  var articleId = $attrs.articleId;
  var articleAuthor = $attrs.articleAuthor;
  var isSharedUrl = $attrs.isSharedUrl === 'true';

  var offset = 0;
  var recommendCount = 12;
  var recommendArticles = [];

  var isReady = false;
  var curArticleID = articleId;
  // Map current article ID to next article ID
  var nextArticleIDMap = {};
  $scope.nextArticles = [];
  $scope.noMoreArticles = false;
  $scope.loadingArticle = false;

  function parseRecommendArticles(articleId, parseFunc) {
    var articles = recommendArticles.filter(function (item) {
      return item.id !== articleId;
    }).slice(0, recommendCount);
    return parseFunc(categName, articles);
  }

  var handleRes = function (articleKey, res, parseFunc, listCategArticle) {
    $timeout(function () {
      $scope.igMedias = queryHandler.parseInstagram(res.listInstagram);
      recommendArticles = res[articleKey] || [];
      $scope.latestArticles = parseRecommendArticles(recommendArticles, parseFunc);
      if (listCategArticle) {
        gqModel.queryArticleIDs(listCategArticle, 0, c.MAX_CATEG_ARTICLES).then(function(res) {
          $timeout(function() {
            var articleIDs = res[listCategArticle];
            var i;
            for (i = 0; i < articleIDs.length - 1; i++) {
              nextArticleIDMap[articleIDs[i].id.toString()] =
                articleIDs[i+1].id.toString();
            }
            isReady = true;
          });
        });
      }
    });
  };

  if (categEname === 'editor_picks') {
    gqModel.queryEditorPicks(offset, recommendCount + 1).then(function (res) {
      handleRes('listEditorPick', res, queryHandler.parseCmsArticles);
    });
  } else if (categEname === 'contributor') {
    gqModel.queryContributorArticlesInArticle(articleAuthor, offset, recommendCount + 1).then(function (res) {
      handleRes('listContributorArticle', res, queryHandler.parseCmsArticles);
    });
  } else if (categEname === 'event') {
    gqModel.queryPostEvents().then(function (res) {
      handleRes('listPostEvent', res, queryHandler.parseCmsArticles);
    });
  } else {
    var listCategArticle = c.TAG_TO_LIST_ARTICLE_API[categEname];
    if (listCategArticle) {
      gqModel.queryArticle(listCategArticle, offset, recommendCount + 1).then(function(res) {
        handleRes(listCategArticle, res, queryHandler.parseArticles, listCategArticle);
      });
    }
  }

  function updateLoading() {
    $timeout(function() {
      $scope.loadingArticle = false;
    }, 100);
  }

  function loadArticle() {
    $scope.loadingArticle = true;
    var nextArticleID = nextArticleIDMap[curArticleID];
    if (!nextArticleID) {
      $scope.loadingArticle = false;
      $scope.noMoreArticles = true;
      return;
    }
    var articleType = articleUtil.getArticleType(nextArticleID);
    var queryFunc = null;
    var queryResName = '';
    if (articleUtil.isCMSArticle(articleType)) {
      queryFunc = gqModel.queryCmsArticleDetail;
      queryResName = 'getCMSArticleDetail';
    } else if (articleUtil.isNewsArticle(articleType)) {
      queryFunc = gqModel.queryNewsArticleDetail;
      queryResName = 'getNewsArticleDetail';
    }
    if (!queryFunc) {
      $scope.loadingArticle = false;
      return;
    }
    queryFunc(nextArticleID).then(function(res) {
      $timeout(function() {
        var nextArticle = res[queryResName];
        nextArticle.type = articleType;
        nextArticle.id = nextArticleID;
        nextArticle.idx = $scope.nextArticles.length.toString();
        nextArticle.isSharedUrl = isSharedUrl;
        nextArticle.latestArticles = parseRecommendArticles(nextArticleID,
            queryHandler.parseArticles);
        if (articleUtil.isNewsArticle(articleType)) {
          queryHandler.parseNewsArticleDetail(nextArticle);
        } else if (articleUtil.isCMSArticle(articleType)) {
          queryHandler.parseCmsArticleDetail(nextArticle);
        }
        $scope.nextArticles.push(nextArticle);
        curArticleID = nextArticleID;
        updateLoading();
      });
    }, function(err) {
      $scope.loadingArticle = false;
    });
  }

  $scope.loadArticle = function() {
    if (!isReady || $scope.noMoreArticles) {
      return false;
    }
    if ($scope.loadingArticle) {
      return false;
    }
    if (isScrolledIntoView('#loading-trigger')) {
      loadArticle();
    }
  };
};
