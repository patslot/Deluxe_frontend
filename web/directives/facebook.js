const TEMPLATE = `
<div id="fb-root"></div>
<script>
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v2.8&appId=1048461655187186";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
</script>

<div>
  <div class="nm_img_wrapper" style="border: 1px #DDD solid; width: 300px; height: 350px; margin: auto;">
    <div class="fb-page" data-href="https://www.facebook.com/deluxehongkong" data-tabs="timeline" data-width="300" data-height="350" data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="false"><blockquote cite="https://www.facebook.com/deluxehongkong" class="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/deluxehongkong">Apple Daily Deluxe</a></blockquote></div>
  </div>
</div>
`;

export default function() {
  return {
    restrict: 'E',
    template: TEMPLATE
  };
};
