var StockDispCacheService = (function () {
  var This,
    StockDispCacheService = function () {
      This = this;
      This.stocksListHot = {};
      This.stocksListAll = {};
      This.stockDataWithSelect = {};
      This.subscriptionStockData = {};
      This.clearGoBackPageID();
      This.clearFilterSearchData();
      This.clearStockNameWhenGoBack();
    };

  StockDispCacheService.prototype.clearAll = function () {
    This.stocksListHot = {};
    This.stocksListAll = {};
    This.stockDataWithSelect = {};
    This.subscriptionStockData = {};
  };

  StockDispCacheService.prototype.setStocksListHot = function (stocksListHot) {
    if (stocksListHot && Object.keys(stocksListHot).length > 0) {
      This.stocksListHot = stocksListHot;
    }
  };

  StockDispCacheService.prototype.getStocksListHot = function () {
    return This.stocksListHot;
  };

  StockDispCacheService.prototype.setStocksListAll = function (stocksListAll) {
    if (stocksListAll && Object.keys(stocksListAll).length > 0) {
      This.stocksListAll = stocksListAll;
    }
  };

  StockDispCacheService.prototype.getStocksListAll = function () {
    return This.stocksListAll;
  };

  StockDispCacheService.prototype.setSubscriptionStockData = function (data) {
    if (data) {
      This.subscriptionStockData = data;
    }
  };

  StockDispCacheService.prototype.getSubscriptionStockData = function () {
    return This.subscriptionStockData;
  };

  StockDispCacheService.prototype.cacheStockNameWhenGoBack = function (stockItem) {
    if (stockItem) {
      sessionStorage && sessionStorage.setItem('cacheStockNameWhenGoBack', stockItem);
    }
  };

  StockDispCacheService.prototype.getStockNameWhenGoBack = function () {
    return (sessionStorage && sessionStorage.getItem('cacheStockNameWhenGoBack')) || '';
  };

  StockDispCacheService.prototype.clearStockNameWhenGoBack = function () {
    sessionStorage && sessionStorage.removeItem('cacheStockNameWhenGoBack');
  };

  StockDispCacheService.prototype.cacheFilterSearchData = function (data) {
    if (data) {
      sessionStorage && sessionStorage.setItem('cacheStockFilterSearchData', data);
    }
  };

  StockDispCacheService.prototype.getFilterSearchData = function () {
    return (sessionStorage && sessionStorage.getItem('cacheStockFilterSearchData')) || '';
  };

  StockDispCacheService.prototype.clearFilterSearchData = function () {
    sessionStorage && sessionStorage.removeItem('cacheStockFilterSearchData');
  };

  StockDispCacheService.prototype.setGoBackPageID = function (pageId) {
    if (pageId) {
      sessionStorage && sessionStorage.setItem('goPageId', pageId);
    }
  };

  StockDispCacheService.prototype.getGoBackPageID = function () {
    return sessionStorage && sessionStorage.getItem('goPageId');
  };

  StockDispCacheService.prototype.clearGoBackPageID = function () {
    sessionStorage && sessionStorage.removeItem('goPageId');
  };

  StockDispCacheService.prototype.setStockDataWithSelect = function (data) {
    This.stockDataWithSelect = data;
  };

  StockDispCacheService.prototype.getStockDataWithSelect = function () {
    return This.stockDataWithSelect;
  };

  StockDispCacheService.prototype.cleanStockDataWithSelect = function () {
    This.stockDataWithSelect = {};
  };

  StockDispCacheService.prototype.setDebitAccount = function (value) {
    if (HeaderObject.GetIDNo() == 'GUEST') {
      return;
    }
    if (!value) {
      return;
    }
    var data = This.getDebitAccount() || { certNo: '' };
    data['certNo'] = value;
    data = JSON.stringify(data);
    ytaJsonStore.setItem(
      'stockDebitAccount',
      data,
      function () {},
      function () {}
    );
  };

  StockDispCacheService.prototype.getDebitAccount = function () {
    return ytaJsonStore.getItem('stockDebitAccount') ? JSON.parse(ytaJsonStore.getItem('stockDebitAccount')) : '';
  };

  return StockDispCacheService;
})();