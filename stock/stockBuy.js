try {
  window.stockApiService = new StockApiService();
  window.stockDispCacheService = new StockDispCacheService();
  window.stockStockCommonService = new StockCommonService();
  window.stockSubscriptionModule = new StockSubscriptionComponent(stockApiService, stockDispCacheService, stockStockCommonService, ValidateRules['TW']);
} catch (error) {
  console.error('error', error);
}