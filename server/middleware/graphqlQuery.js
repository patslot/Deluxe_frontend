'use strict';

var Lokka = require('lokka').Lokka;
var Transport = require('lokka-transport-http').Transport;

module.exports = function(GRAPHQL_ENDPOINT) {
  var client = new Lokka({transport: new Transport(GRAPHQL_ENDPOINT)});
  var gConst = require('./graphqlConst.js')(client);

  const getContributorName = `
    getCMSArticleDetail(articleID: $id) {
      ... on ContributorArticleDetail {
        contributorName
      }
    }
  `;

  const cmsComponeFeedModel = `{
    homeGalleryID
    apID
    catName
    imgName
    caption
    content
    linkURL
    sort
    startDateTime
    endDateTime
    confirm
    hasVideo
    adCode
    apCatID
  }`;

  const CmsComponeFeedItem = `{
    homeGalleryID
    apID
    catName
    imgName
    caption
    content
    linkURL
    sort
    startDateTime
    endDateTime
    confirm
    hasVideo
    adCode
    apCatID
  }`;

  const articleModel = ` (offset: $offset, count: $count) {
    __typename
    id
    title
    lastUpdate
    ... on NewsArticle {
      mediaGroup {
        type
        largePath
      }
      firstContentBlock {
        subHead
        content
      }
    }
    ... on CmsArticle {
      anvato
      articleThumbnail
      categoryID
      intro
      lastUpdate
      publish
      title
      videoFile
      videoThumbnail
      youtube
    }
  }`;
    
  const articleModelByTag = ` (tag: $tag, offset: $offset, count: $count) {
    __typename
    id
    title
    lastUpdate
    ... on NewsArticle {
      mediaGroup {
        type
        largePath
      }
      firstContentBlock {
        subHead
        content
      }
    }
    ... on CmsArticle {
      anvato
      articleThumbnail
      categoryID
      intro
      lastUpdate
      publish
      title
      videoFile
      videoThumbnail
      youtube
      tag
    }
  }`;
    
  const listMenu = `listMenu {
    categoryID
    campaignID
    name
    eName
    showNew
    genCatJSON
    subCategory
    display
    sort
    memo
    img
  }`;

  const listCampaign = `listCampaign {
    imgName
    linkURL
    content
  }`;

  const listContributorArticle = `listContributorArticle(name: $name, offset: $offset, count: $count) {
    id
    categoryID
    publish
    lastUpdate
    title
    articleThumbnail
    videoThumbnail
    videoFile
    anvato
    youtube
    intro
  }`;

  const cmsArticleModel = `{
    id
    categoryID
    publish
    lastUpdate
    title
    articleThumbnail
    videoThumbnail
    videoFile
    anvato
    youtube
    intro
  }`;

  var createCmsComponeFeedQuery = function(queryName) {
    return queryName + ' ' + CmsComponeFeedItem;
  };

  var createQuery = function(queries) {
       console.log( 'query { ' + queries.join(' ') + ' }');
    return 'query { ' + queries.join(' ') + ' }';
  };

  var createQueryWithParams = function(paramStr, queries) {
   //  console.log( 'query (' + paramStr + ') { ' + queries.join(' ') + ' }');
       return 'query (' + paramStr + ') { ' + queries.join(' ') + ' }';
  };

  return {
    newsArticleQuery: function(articleID) {
      return client.query(createQueryWithParams('$id: String',
        [listMenu, listCampaign, gConst.getNewsArticleDetail]), {id: articleID});
    },
    // For CMS article or editor pick article
    cmsArticleQuery: function(articleID) {
      
      return client.query(createQueryWithParams('$id: String',
        [listMenu, listCampaign, createCmsComponeFeedQuery('listContributor'), gConst.getCMSArticleDetail, getContributorName]), {id: articleID});
    },
    homeQuery: function() {
      return client.query(createQuery(['listMPM ' + cmsComponeFeedModel,
        listMenu,
        listCampaign,
        createCmsComponeFeedQuery('listHomeLatestArticle')
      ]));
    },
    categQuery: function(listCategArticle, offset, count) {
      return client.query(createQueryWithParams('$offset: Int, $count: Int',
        [listCategArticle + ' ' + articleModel,
        listMenu, listCampaign]),
        {offset: offset, count: count});
    },
    subCategQuery: function(listCategArticle, tag, offset, count) {
      return client.query(createQueryWithParams('$tag: String, $offset: Int, $count: Int',
        [listCategArticle + ' ' + articleModelByTag,
        listMenu, listCampaign]),
        {tag: tag, offset: offset, count: count});
    },
    contributorIndexQuery: function() {
      return client.query(createQuery([listMenu, listCampaign,
        createCmsComponeFeedQuery('listContributor')
      ]));
    },
    contributorArticlesQuery: function(contrName, offset, count) {
      return client.query(createQueryWithParams('$name: String, $offset: Int, $count: Int',
        [listMenu, listCampaign,
          createCmsComponeFeedQuery('listContributor'),
          listContributorArticle
        ]),
        {name: contrName, offset: offset, count: count});
    },
    queryEditorPicks: function(offset, count) {
      return client.query(createQueryWithParams('$offset: Int, $count: Int',
        [listMenu, listCampaign,
        'listEditorPick (offset: $offset, count: $count) ' + cmsArticleModel]),
        {offset: offset, count: count});
    },
    eventsQuery: function(pagesize, page) {
      return client.query(createQueryWithParams('$pagesize: Int, $page: Int',
        [listMenu, listCampaign, 'totalPostEvent',
          'listUpcomingEvent ' + cmsComponeFeedModel,
          'listPostEvent (pagesize: $pagesize, page: $page) ' +
          cmsArticleModel]),
        {pagesize: pagesize, page: page});
    },
    upcomingEventQuery: function () {
      return client.query(createQuery([
        createCmsComponeFeedQuery('listUpcomingEvent')
      ]));
    }
  };
};
