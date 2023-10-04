// Override Settings
var bcSfSearchSettings = {
  search: {
      //suggestionMode: 'test',
      suggestionPosition: 'right',
      //suggestionWidth: 'auto'
  }
};

// Customize style of Suggestion box
BCSfFilter.prototype.customizeSuggestion = function(suggestionElement, searchElement, searchBoxId) {

};

BCSfFilter.prototype.buildSuggestionSelectCollection = function(searchTerm, data, ul) {
  var content = this.getSettingValue('label.error.noSuggestionResult').replace(/{{ terms }}/g, searchTerm);
  var result = '<li class="bc-sf-search-suggestion-no-result" aria-label="No Results">';
  result += '<span>Please select a category before searching.</span>';
  result += '</li>';
  return result;
};

// Prepare Params of Suggestion API
BCSfFilter.prototype.prepareSuggestionParams = function(searchTerm, eventType) {
  var params = {};
  params.shop = this.shopDomain;
  params.t = new Date().getTime();
  if (!this.getSettingValue('search.enableDefaultResult')) params.enable_default_result = false;
  if (!this.getSettingValue('search.enableFuzzy')) params.fuzzy = false;
  if (this.getSettingValue('search.reduceMinMatch') !== false) {
    params.reduce_min_match = this.getSettingValue('search.reduceMinMatch');
  }
  // Get product/variant available or not
  if (this.getSettingValue('search.productAvailable') == true) params.product_available = true;
  // Limit
  var blocks = this.getSettingValue('search.suggestionBlocks');
  for (var k = 0; k < blocks.length; k++) {
      var id = blocks[k]['type'].slice(0, -1);
      params[id + '_limit'] = blocks[k]['number'];
  }
  params['dym_limit'] = this.getSettingValue('search.suggestionDymLimit');
  // Skip fields
  var skipFields = this.getSettingValue('search.skipFields');
  if (skipFields.length > 0) param.skipFields = skipFields;
  params.callback = 'BCSfSuggestionCallback';
  params.event_type = eventType;
  // Suggest types
  var suggestionTypes = eventType == 'suggest_dym' ? ['products'] : this.getSettingValue('search.suggestionTypes');
  params.suggest_types = suggestionTypes;
  if ($('select.bc-select-collection').length > 0) {
    params.collection_scope = $('select.bc-select-collection').val();
  } else {
    params.collection_scope = bcSfFilterConfig.general.collection_id;
  }
  params.product_limit = 10;

  return params;
};

jQ(document).ready(function(){
  jQ("select.bc-select-collection").change(function(){
      var selected = jQ(this).children("option:selected").val();
      jQ('body').find('.bc-sf-input-collection').val(selected);
      jQ('.bc-sf-search-suggestion-mobile-top-panel').find('.bc-sf-input-collection').val(selected);
      jQ("select.bc-select-collection option").prop({selected: false});
      jQ("select.bc-select-collection [value='" + selected + "']").prop({selected: true});
  });
});

// Build Suggestion
BCSfFilter.prototype.buildSuggestion = function(searchTerm, suggestionData, ul, searchBoxId) {
  var self = this;
  searchTerm = this.escape(searchTerm);
  // Build Result
  var result = '';
  var isAllEmpty = getValueInObjectArray('all_empty', suggestionData);
  var selectCollection = $('select.bc-select-collection').val();
  //console.log(selectCollection);
  //console.log($('select.bc-select-collection').length);
  // Check is_empty
  // If true: Nothing found
  if (isAllEmpty) {
      result += this.buildSuggestionNoResult(searchTerm, ul);
      jQ(ul).append(result);
  } else if ($('select.bc-select-collection').length > 0 && (!selectCollection || selectCollection === 0) ) {
      result += this.buildSuggestionSelectCollection(searchTerm, ul);
      jQ(ul).append(result);
  }
  // Otherwise: Start buidling the content of Suggestion
  else {
      // Build main content
      var blocks = this.getSettingValue('search.suggestionBlocks');
      // Style2
      if (self.isSuggestionStyle2() && blocks[0].type != "products") {
          var indexProducts = blocks.findIndex(function(block) {
              return block.type == 'products';
          });
          var tempProducts = blocks[indexProducts];
          blocks.splice(indexProducts, 1);
          // if suggestionStyle2ReverseProductBlock is enabled
          if (self.getSettingValue('search.suggestionStyle2ReverseProductBlock')) {
              blocks.push(tempProducts);
          } else {
              blocks.unshift(tempProducts);
          }
      }
      for (var k = 0; k < blocks.length; k++) {
          var suggestionItemInfo = blocks[k];
          if (suggestionItemInfo.hasOwnProperty('status') && suggestionItemInfo['status'] == 'active') {
              var index = this.findIndexArray(suggestionItemInfo['type'], suggestionData, 'key');
              if (index > -1 && suggestionData[index].hasOwnProperty('values')) {
                  var suggestionItemData = suggestionData[index];
                  var content = '<li class="bc-sf-search-suggestion-group" data-group="' + suggestionItemInfo['type'] + '" aria-label="' + blocks[k]['label'] + '"><ul>';
                  if (bcSfFilterConfig.general.template == 'collection.bc-custom-filter') {
                      if (suggestionItemInfo['type'] == 'products') {
                        content += this.buildSuggestionProductList(searchTerm, suggestionItemData['values'], ul, suggestionItemInfo, suggestionData);
                      }
                  } else {
                    switch (suggestionItemInfo['type']) {
                      case 'suggestions':
                          content += this.buildSuggestionPopular(searchTerm, suggestionItemData['values'], ul, suggestionItemInfo, suggestionData);
                          break;
                      case 'products':
                          content += this.buildSuggestionProductList(searchTerm, suggestionItemData['values'], ul, suggestionItemInfo, suggestionData);
                          break;
                      case 'pages':
                          content += this.buildSuggestionPage(searchTerm, suggestionItemData['values'], ul, suggestionItemInfo, suggestionData);
                          break;
                      case 'collections':
                          content += this.buildSuggestionCollection(searchTerm, suggestionItemData['values'], ul, suggestionItemInfo, suggestionData);
                          break;
                    }
                  }
                  content += '</ul></li>';
                  jQ(ul).append(content);
              }
          }
      }

  }
  // Wrapper
  this.buildSuggestionWrapper(ul, searchBoxId);
};

// Build Suggestion mobile
BCSfFilter.prototype.buildSuggestionMobile = function() {
  // Append a search box on top
  var selector = this.selector.searchBoxMobile;
  if (jQ(selector).length == 0) {
      var btnClose = '<button type="button" class="bc-sf-search-btn-close-suggestion" onclick="closeSuggestionMobile(\'' + selector + '\', true);"><-</button>';
      var btnSearch = this.getSettingValue('search.showSearchBtnMobile') ? '<a href="javascript:;" class="bc-sf-search-submit-mobile" onclick="submitSearchFormMobile(this, event)"><span>Submit</span></a>' : '';
      var btnClear = '<button type="button" class="bc-sf-search-btn-clear-suggestion" onclick="clearSuggestionMobile(\'' + selector + '\');">X</button>';
      jQ('body').append('<div class="bc-sf-search-suggestion-mobile-top-panel"><form action="/search" method="get">' + btnClose + btnSearch + '<input class="bc-sf-input-collection" style="display: none" type="hidden" name="collection_scope" value="134875840589"><input type="text" name="' + this.searchTermKey + '" placeholder="' + this.getSettingValue('label.suggestion.placeholder') + '" id="' + selector.substr(1) + '" />' + btnClear + '</form></div>');
      this.buildSearchBox(selector);
  }
};

BCSfFilter.prototype.requestSuggestion = function(searchTerm, searchId) {
  var self = this;
  function BCSend(term) {
      var suggestion = getSuggestionInstance(searchId);
      self.showSuggestionLoading(suggestion, searchId);
      // Get data from cache
//         if (term in self.suggestionCache) {
//             suggestionCallback(self.suggestionCache[term]);
//             return;
//         }
      self.getSuggestionData(term, 0, 'suggest');
  }

  BCSend(searchTerm);
};

// Build Search url
BCSfFilter.prototype.buildSearchLink = function(term) {
  var collection_scope = '';
  if (this.queryParams.hasOwnProperty('collection_scope')) {
    collection_scope += '&collection_scope=' + this.queryParams['collection_scope'];
  }
  if ($('select.bc-select-collection').length > 0) {
    collection_scope = '&collection_scope=' + $('select.bc-select-collection').val();
  } else {
    collection_scope = '&collection_scope=' + bcSfFilterConfig.general.collection_id;
  }
  console.log('/search?' + this.searchTermKey + '=' + encodeURIParamValue(term) + collection_scope);
  return '/search?' + this.searchTermKey + '=' + encodeURIParamValue(term) + collection_scope;
};

BCSfFilter.prototype.buildSuggestionProductPrice = function(data) {
  
  	/* Multi-currency Shopify */
    var self = this;
    self.prepareSuggestionProductPriceData(data);
    
    // Check on sale
    var onSale = data.compare_at_price_min > data.price_min;
  	var priceVaries = data.price_min != data.price_max;
    // Format price
    var price = this.formatMoney(data.price_min * 100),
        compareAtPrice = this.formatMoney(data.compare_at_price_min * 100);
    if (this.getSettingValue('search.removePriceDecimal')) {
        price = this.removeDecimal(price);
        compareAtPrice = this.removeDecimal(compareAtPrice);
    }
    // Build Price
    var result = '';
    if (this.getSettingValue('search.showSuggestionProductPrice')) {
        result += '<div class="' + this.class.searchSuggestion + '-product-price">';
        if (onSale && this.getSettingValue('search.showSuggestionProductSalePrice')) {
            result += '<s>' + compareAtPrice + '</s>  ';
          	if (priceVaries) {
              result += '<span class="bc-sf-product-sale-price">from ' + price + '</span>';
            }else{
              result += '<span class="bc-sf-product-sale-price">' + price + '</span>';
            }
        } else {
            if (priceVaries) {
                result += '<span class="bc-sf-product-regular-price">from ' + price + '</span>';
            }else{
            	result += '<span class="bc-sf-product-regular-price">' + price + '</span>';
            }
            
        }
        result += '</div>';
    }
    return result;
};

/* Start Search Redirect */
function submitSearchFormMobile(t,e){e.preventDefault();var o=bcsffilter.getSearchRedirectUrl(bcsffilter.currentTerm);o?window.location.href=o:jQ(t).closest("form").submit()}function beforeSubmitSearchForm(t,e){var o=jQ(t).val(),i=bcsffilter.getSearchRedirectUrl(o);i&&(e.stopImmediatePropagation(),e.stopPropagation(),e.preventDefault(),window.location.href=i)}BCSfFilter.prototype.setSuggestionPosition=function(t){var e=this;if("function"==typeof getSuggestionPosition&&"function"==typeof this.checkIsFullWidthSuggestionMobile){var o=getSuggestionPosition(t),i=this.checkIsFullWidthSuggestionMobile(t)?"top":"top+12";"function"!=typeof e.isSuggestionStyle2||e.isSuggestionStyle2(),"left"==o?jQ(t).autocomplete("option","position",{my:"left "+i,at:"left bottom",collision:"none"}):jQ(t).autocomplete("option","position",{my:"right "+i,at:"right bottom",collision:"none"})}else"left"==this.getSettingValue("search.suggestionPosition")?jQ(t).autocomplete("option","position",{my:"left top+12",at:"left bottom",collision:"none"}):jQ(t).autocomplete("option","position",{my:"right top+12",at:"right bottom",collision:"none"});if(jQ(t).length>0&&jQ(t).on("keydown",function(o){13==o.keyCode&&e.enterSearchBoxEvent(t,o)}),jQ(t).closest("form").length>0){var n=jQ(t).closest("form").find('[type="submit"]');n&&n.length>0&&n.each(function(e,o){o.setAttribute("onclick","beforeSubmitSearchForm('"+t+"', event)")})}},BCSfFilter.prototype.enterSearchBoxEvent=function(t,e){var o=jQ(t).val(),i=this.getSearchRedirectUrl(o);i&&(e.preventDefault(),window.location.href=i)},BCSfFilter.prototype.getSearchRedirectUrl=function(t){if(this.suggestionCache&&this.suggestionCache.hasOwnProperty(t))for(var e=this.suggestionCache[t],o=0;o<e.length;o++)if("redirect"==e[o].key&&e[o].values){var i=e[o].values;return i=(i=i.replace("https://"+bcSfFilterMainConfig.shop.domain,"")).replace("http://"+bcSfFilterMainConfig.shop.domain,"")}return""};
/* End Search Redirect */
