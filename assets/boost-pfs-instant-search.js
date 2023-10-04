// Override Settings
var boostPFSInstantSearchConfig = {
	search: {
		suggestionMode: 'test',
		//suggestionPosition: 'left'
      enableDefaultResult: false,
      suggestionStyle: 'style1'
	}
};

(function() {
	BoostPFS.inject(this);

	// Customize style of Suggestion box
	SearchInput.prototype.customizeInstantSearch = function() {
		var suggestionElement = this.$uiMenuElement;
		var searchElement = this.$element;
		var searchBoxId = this.id;
	};

  // Bind Event for input search Mobile
  var bindEventsMobile = InstantSearchMobile.prototype.bindEvents;
  InstantSearchMobile.prototype.bindEvents = function() {
    bindEventsMobile.call(this);

    var self = this;
    var searchButtonMobile = '.site-nav--mobile .search-button, .js-search-destop';
    var searchInputMobile = '.search-input-group input[type="search"], .wg-search-form .search-input';
    var searchCloseButtonMobile = '.drawer__close > button, .drawer_back a';
    jQ(searchButtonMobile).off('click').click(function(e) {
      e.preventDefault();
      //e.stopPropagation();
      jQ(searchInputMobile).focus();
      self.openSuggestionMobile();
      jQ(searchCloseButtonMobile).trigger('click');

    });
  }
  
  // Bind Event for input search style 3
  var bindEvents = InstantSearchStyle3.prototype.bindEvents;
  InstantSearchStyle3.prototype.bindEvents = function() {
    bindEvents.call(this);

    var self = this;
    var searchButtonDesktop = '.site-header__links .search-button';
    var searchInputDesktop = '#SearchContainer #search-input';
    var searchCloseButtonDesktop = '.drawer__close > button';
    jQ(searchButtonDesktop).off('click').click(function(e) {
      e.preventDefault();
      //e.stopPropagation();
      jQ(searchInputDesktop).focus();
      self.openSuggestionStyle3();
      jQ(searchCloseButtonDesktop).trigger('click');

    });
  }

  // Fix search for the Flow theme
  jQ('.site-header__links .search-button').on('click', function() {
    setTimeout(function() {
      boostPFS.initSearchBox();
      if(Utils.isCollectionPage()) jQ('.search-input-group > .boost-pfs-search-box').val('');
    }, 500);
  });

  InstantSearchApi.beforeCall = function(searchTerm) {
      /* Change the params before calling api */
      var selected_collection = localStorage.getItem("boostSearchCollection");
      Globals.instantSearchQueryParams.collection_scope = selected_collection;
  }
 
  
  SearchInput.prototype._bindAutoCompleteSource = function(request, response) {
		window.suggestionCallback = response;
		Globals.currentTerm = Utils.stripHtml(request.term);
		var term = (request.term).trim().replace(/\s+/g, ' ');
		if (term != '') {
			var $instantSearchResult = this.searchAutoComplete.$element;
			this.instantSearchResult.setData($instantSearchResult, null, true);
			this.instantSearchResult.refresh();
			//if (Globals.suggestionCache.hasOwnProperty(term)) {
			//	window.suggestionCallback(Globals.suggestionCache[term]);
				//return;
			//}
			term = encodeURIComponent(term);
			InstantSearchApi.getSuggestionData(term, 0, 'suggest');
		}
	};
  
  jQ(document).ready(function(){
    if(typeof(localStorage.getItem("boostSearchCollection")) == 'undefined' || localStorage.getItem("boostSearchCollection") == null){
      	var defaultCollectionVal = jQ('.bc-select-collection').val();
      	localStorage.setItem("boostSearchCollection", defaultCollectionVal);
    }
    
    if(localStorage.getItem("boostSearchCollection") !== null){
    	jQ("select.bc-select-collection option").removeAttr('selected');
        jQ("select.bc-select-collection [value='" + localStorage.getItem("boostSearchCollection") + "']").attr('selected','selected');
    	jQ('.bc-sf-input-collection').val(localStorage.getItem("boostSearchCollection"));
    }
    
    jQ("select.bc-select-collection").change(function(){
      	var selected = jQ(this).val();
      	jQ("select.bc-select-collection option").removeAttr('selected');
        jQ("select.bc-select-collection [value='" + selected + "']").attr('selected','selected');
    	localStorage.setItem("boostSearchCollection", selected);
      	jQ('.bc-sf-input-collection').val(selected);
    });
    // In collections
    if (Globals.collectionId == '134875906125'|| Globals.collectionId == '134875840589' //TRAPO HEX
        || Globals.collectionId == '134875971661' //TRAPO ECO
       	|| Globals.collectionId == '268348751949' //CAR WIPER        
        || Globals.collectionId == '136618475597'){ //CAR ACCESSORIES
    localStorage.setItem("boostSearchCollection", Globals.collectionId);
    jQ('.bc-sf-input-collection').val(Globals.collectionId);
    }
  });
  
  InstantSearchResultItemProduct.prototype.getTemplate = function(tempType) {
		switch (tempType) {
			case InstantSearchResultItemProduct.tempType.IMAGE:
				return `
					<div class="{{class.searchSuggestion}}-left">
						<img tabindex="-1" src="{{imageUrl}}" alt="{{escapedTitle}}">
					</div>
				`.trim();
			case InstantSearchResultItemProduct.tempType.SKU:
				return `
					<p class="{{class.searchSuggestion}}-product-sku">SKU: {{sku}}</p>
				`.trim();
			case InstantSearchResultItemProduct.tempType.VENDOR:
				return `
					<p class="{{class.searchSuggestion}}-product-vendor">{{vendor}}</p>
				`.trim();
			case InstantSearchResultItemProduct.tempType.PRICE:
				return `
					<p class="{{class.searchSuggestion}}-product-price hh">
						<span class="{{class.searchSuggestion}}-product-regular-price">{{regularPrice}}</span>
					</p>
				`.trim();
			case InstantSearchResultItemProduct.tempType.PRICE_SALE:
				return `
					<p class="{{class.searchSuggestion}}-product-price">
						<s>{{compareAtPrice}}</s>&nbsp;
						<span class="{{class.searchSuggestion}}-product-sale-price">{{regularPrice}}</span>
					</p>
				`.trim();
			default:
				return `
					<li class="{{class.searchSuggestionItem}} {{class.searchSuggestionItem}}-product {{class.searchUiAutocompleteItem}}" aria-label="{{escapedBlockType}}: {{escapedTitle}}" data-id="{{id}}" role="option">
						<a tabindex="-1" href="{{url}}" {{newTabAttribute}}>
							{{itemProductImage}}
							<div class="{{class.searchSuggestion}}-right">
								<p class="{{class.searchSuggestion}}-product-title">{{title}}</p>
								{{itemShippingImage}}
								{{itemProductSku}}
								{{itemProductVendor}}
								{{itemProductPrice}}
							</div>
						</a>
					</li>
				`.trim();
		}
	}

	/**
	 * Replace the brackets in raw html template with proper values
	 * @returns {String} HTML string
	 */
	InstantSearchResultItemProduct.prototype.compileTemplate = function() {
		if (this.isShow) {
			var searchTerm = Utils.stripHtml(Globals.currentTerm);
			// Product image
			var imageHTML = '';
			if (Settings.getSettingValue('search.showSuggestionProductImage') && this.imageUrl.length) {
				imageHTML = this.getTemplate(InstantSearchResultItemProduct.tempType.IMAGE);
				imageHTML = imageHTML.replace(/{{imageUrl}}/g, this.imageUrl);
			}
			// Product title
			var productTitle = this.customizeProductTitle();
			productTitle = this._highlightSuggestionResult(productTitle, searchTerm);
          
          	// product shipping image
          	var imageSrc = boostPFSAppConfig.general.asset_url.split("boost-pfs.js").join("express-shipping.jpeg");
          	var productShippingImage = this.data.handle.indexOf("ready-to-stock") > -1 ? "<img src='"+ imageSrc +"' class='boost-shipping-image' >": ''
			// SKU
			var skuHTML = '';
			if (Settings.getSettingValue('search.showSuggestionProductSku') && this.sku.length) {
				skuHTML = this.getTemplate(InstantSearchResultItemProduct.tempType.SKU);
				skuHTML = skuHTML.replace(/{{sku}}/g, this.sku);
			}
			// Vendor
			var vendorHTML = '';
			if (Settings.getSettingValue('search.showSuggestionProductVendor') && this.vendor.length) {
				vendorHTML = this.getTemplate(InstantSearchResultItemProduct.tempType.VENDOR);
				vendorHTML = vendorHTML.replace(/{{vendor}}/g, this.vendor);
			}
			// Price
			var priceHTML = this.compileSuggestionProductPrice();
			// Open the result item in new tab when selected
			var newTabAttr = Settings.getSettingValue('search.openProductNewTab') ? 'target="_blank"' : '';

			return this.getTemplate()
				.replace(/{{id}}/g, this.id)
				.replace(/{{escapedBlockType}}/g, Utils.stripHtml(this.parent.type))
				.replace(/{{url}}/g, this.url)
				.replace(/{{newTabAttribute}}/g, newTabAttr)
				.replace(/{{itemProductImage}}/g, imageHTML)
				.replace(/{{title}}/g, productTitle)
				.replace(/{{escapedTitle}}/g, Utils.stripHtml(productTitle))
				.replace(/{{itemProductSku}}/g, skuHTML)
				.replace(/{{itemProductVendor}}/g, vendorHTML)
				.replace(/{{itemProductPrice}}/, priceHTML)
				.replace(/{{class.searchSuggestion}}/g, Class.searchSuggestion)
				.replace(/{{class.searchSuggestionItem}}/g, Class.searchSuggestionItem)
				.replace(/{{class.searchUiAutocompleteItem}}/g, Class.searchUiAutocompleteItem)
            	.replace(/{{itemShippingImage}}/g , productShippingImage)
		} else {
			return '';
		}
	}

    InstantSearchResultItemProduct.prototype.compileSuggestionProductPrice = function() {
		// If the multi-currency feature is enabled, update the product price
		this.prepareSuggestionProductPriceData();
		// Check on sale
		var onSale = this.data.compare_at_price_min > this.data.price_min;
		// Format price
		var price = Utils.formatMoney(this.data.price_min);
		var compareAtPrice = '';
		if (this.data && this.data.compare_at_price_min) {
			compareAtPrice = Utils.formatMoney(this.data.compare_at_price_min);
			if (Settings.getSettingValue('search.removePriceDecimal')) {
				price = Utils.removeDecimal(price);
				compareAtPrice = Utils.removeDecimal(compareAtPrice);
			}
		}
		
		// Build Price
		var result = '';
		if (Settings.getSettingValue('search.showSuggestionProductPrice')) {
			if (onSale && Settings.getSettingValue('search.showSuggestionProductSalePrice')) {
				result = this.getTemplate(InstantSearchResultItemProduct.tempType.PRICE_SALE);
			} else {
				result = this.getTemplate(InstantSearchResultItemProduct.tempType.PRICE);
			}
		}
		return result
			.replace(/{{regularPrice}}/g, price)
			.replace(/{{compareAtPrice}}/g, compareAtPrice);
	}

})();