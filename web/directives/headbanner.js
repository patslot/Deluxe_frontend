const htmlTpl = `
<div class="head_banner_wrapper hidden-xs">
  <div class="superhead_banner">
    <div id="<%= divId %>"></div>
  </div>
</div>
`;

export default function() {
  return {
    restrict: 'E',
    scope: {
      divId: '@headbannerId',
      articleId: '@articleId'
    },
    link: function (scope, element) {
      var unwatch = scope.$watch(function(newVal) {
        var divId = newVal.divId;
        var articleId = newVal.articleId || "";
        if (!divId) {
          return;
        }
        element.html(ejs.render(htmlTpl, {divId: divId}));
        showWebAd("HeadBanner", divId, articleId);
        unwatch();
      });
    }
  };
};
