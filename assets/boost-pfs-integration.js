/** Please don't modify or unzip this content. It will be updated regularly **/
    (function() {
      BoostPFS.inject(this);

      //Set global variable
      Globals.hasIntegration = true;
      // 3rd app compile template
      Integration.compileIntegrationTemplate = function (data, itemHtml) {
        var okendoWidgetPlusEnabled = document && !!document.getElementById('okendo-reviews-script');var itemOkendoReviewsHtml = okendoWidgetPlusEnabled ? (Utils.getProductMetafield(data, 'okendo', 'StarRatingSnippet') !== null ? Utils.getProductMetafield(data, 'okendo', 'StarRatingSnippet') : '') : (Utils.getProductMetafield(data, 'okendo', 'ProductListingSnippet') !== null ? Utils.getProductMetafield(data, 'okendo', 'ProductListingSnippet') : ''); itemHtml = itemHtml.replace(/{{itemReviews}}/g, itemOkendoReviewsHtml);
        return itemHtml;
      };

      Integration.call3rdIntegrationFunc = function(data) {
        
      }

    })();