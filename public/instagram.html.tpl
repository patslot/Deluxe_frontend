<h3>Instagram photos</h3>
<span ng-repeat="ig in igMedias">
  <span ng-if="ig.images.thumbnail">
    <a href="ig.link"]><img src="{{ig.images.thumbnail.url}}" /></a></span>
</span>
