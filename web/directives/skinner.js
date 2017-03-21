
const TEMPLATE = `
<div class="skinner_ad_wrapper hidden-xs">
  <div class="skinner_ad_content">
    <div class="skinner_ad_anchor" skinner_ad="align_top"></div>
    <div id="skycraper1" class="skinner_ad" skinner_ad_left>
      <script>
        showWebAd("Skyscraper1", "skycraper1");
      </script>
    </div>
    <div id="skycraper2" class="skinner_ad" skinner_ad_right>
      <script>
        showWebAd("Skyscraper2", "skycraper2");
      </script>
    </div>
  </div>
</div>
`;

export default function() {
  return {
    restrict: 'E',
    template: TEMPLATE
  };
};
