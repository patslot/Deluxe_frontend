import $ from "jquery";
window.jQuery = $;
window.$ = $;
global.jQuery = $;

import angular from 'angular';
import moment from 'moment/moment.js';
import 'ejs/ejs.js';
import 'bootpag/lib/jquery.bootpag.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';


import './assets/css/topMenu.css';
import './assets/css/mobileMenu.css';
import './assets/css/articleDetail.css';
import './assets/css/common.css';
import './assets/css/contributorArticles.css';
import './assets/css/scrolls.css';
import './assets/css/articleList.css';
import './assets/css/contributor.css';
import './assets/css/events.css';
import './assets/css/campaign.css';
import './assets/css/mpm.css';
import './assets/css/newsletter.css';
import './assets/css/upcomingEvents.css';
import './assets/css/featherlight.css';
import './assets/css/slick.css';
import './assets/css/keyword.css';

import './js/lazy-scroll.js';
import './js/jquery.endless-scroll.js';
import './js/featherlight.js';
import './js/slick.min.js';
import './assets/css/slick/slick-theme.css';

import './js/misc.js';

var controllers = require('./controllers');
var services = require('./services');
var dirs = require('./directives');

module.exports = function(options) {
  var constant = function() {
    return {
      TAG_TO_LIST_ARTICLE_API: {
        'add_fash': 'listFashionArticle',
        'add_beau': 'listBeautyArticle',
        'add_luxe': 'listLuxeArticle',
        'add_wedd': 'listWeddingArticle',
        'add_cele': 'listCelebrityArticle',
        'add_life': 'listLifeStyleArticle'
      },
      LOAD_CATEG_ARTICLES_COUNT: 6,
      MAX_CATEG_ARTICLES: options.MAX_CATEG_ARTICLES || 200,
      GRAPHQL_ENDPOINT: options.GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql'
    };
  };

  angular.module('appServices', [])
    .factory('const', [constant])
    .factory('queryHandler', [services.queryHandler])
    .factory('articleUtil', [services.articleUtil])
    .factory('gqModel', ['const', services.gqModel]);

  angular.module('appDirectives', [])
    .directive('latestArticles', [dirs.latestArticles])
    .directive('articlesInCateg', [dirs.articlesInCateg])
    .directive('articlesInKeyword', [dirs.articlesInKeyword])
    .directive('articlesInSearch', [dirs.articlesInSearch])
    .directive('addCarousel', ['$timeout', dirs.addCarousel])
    .directive('addCarouselRecommend', ['$timeout', dirs.addCarouselRecommend])
    .directive('facebookBlock', [dirs.facebook])
    .directive('instagramMedias', [dirs.instagram])
    .directive('instagramMedias4', [dirs.instagram4])
    .directive('skinnerBlock', [dirs.skinner])
    .directive('headbanner', [dirs.headbanner])
    .directive('midbanner', [dirs.midbanner])
    .directive('fixedbanner', [dirs.fixedbanner])
    .directive('fadeinoutbanner', [dirs.fadeinoutbanner])
    .directive('flyingcarpetfixedbanner', [dirs.flyingcarpetfixedbanner])
    .directive('lrec', [dirs.lrec])
    .directive('splashScreen', [dirs.splashScreen])
    .directive('homeArticle', [dirs.homeArticle])
    .directive('shareBar', [dirs.shareBar])
    .directive('contributorBlock', [dirs.contributorBlock])
    .directive('articleDetails', ['$compile', dirs.articleDetails])

  angular
    .module('addv2', ['lazy-scroll', 'appServices', 'appDirectives'])
    .filter("trust", ['$sce', function($sce) {
      return function(htmlCode) {
        return $sce.trustAsHtml(htmlCode);
      }
    }])
    .controller('HomepageController', ['$timeout', '$scope', '$window', 'gqModel', 'const',
      'queryHandler', controllers.homepage])
    .controller('CategController', ['$timeout', '$scope', '$attrs', '$window', 'gqModel',
      'const', 'queryHandler', controllers.category]) 
    .controller('KeywordController', ['$timeout', '$scope', '$attrs', '$window', 'gqModel',
      'const', 'queryHandler', controllers.keyword]) 
    .controller('SearchController', ['$timeout', '$scope', '$attrs', '$window', 'gqModel',
      'const', 'queryHandler', controllers.search]) 
    .controller('subCategController', ['$timeout', '$scope', '$attrs', '$window', 'gqModel',
      'const', 'queryHandler', controllers.subcategory])
    .controller('ArticleController', ['$timeout', '$scope', '$attrs','$window', 'gqModel',
      'const', 'queryHandler', 'articleUtil', controllers.article])
    .controller('ContributorController', ['$timeout', '$scope', 'gqModel',
      'queryHandler', controllers.contributor])
    .controller('ContributorArticlesController', ['$timeout', '$scope',
      'gqModel', '$attrs', 'queryHandler', controllers.contributorArticles])
    .controller('EventsController', ['$timeout', '$scope',
      'gqModel', '$attrs', 'queryHandler', controllers.events]);
}
