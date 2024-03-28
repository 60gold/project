var StockApiService = (function () {
  var This,
    StockApiService = function () {
      This = this;
    };
  var showError = (function () {
    var timer = null;
    return function (data) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function () {
        stockSubscriptionModule.commonService.closeCommonPopup();
        if (data) {
          var modalOption = {
            showCloseBtn: false,
            showConfirmBtn: true,
            showCancelBtn: false,
            confirmAddOnClass: true,
            cancelAddOnClass: false,
            confirmText: '確定'
          };
          if (data.errorCode && data.errorMessage) {
            var message = '(' + data.errorCode + ')' + data.errorMessage;
            var popup = yuantaApp.newBlock._commonPopupModule().set('modal', modalOption).set('modalContent', message).appendTo().build();
            popup.open();
          } else if (data.errorMessage) {
            var popup = yuantaApp.newBlock._commonPopupModule().set('modal', modalOption).set('modalContent', data.errorMessage).appendTo().build();
            popup.open();
          } else {
            var popup = yuantaApp.newBlock._commonPopupModule().set('modal', modalOption).set('modalContent', '系統錯誤，請稍後再試').appendTo().build();
            popup.open();
          }
        }
      }, 0);
    };
  })();

  //股票-客戶庫存查詢 1430134
  StockApiService.prototype.FetchQueryCustStocks = function (goodNo) {
    var $d = jq.Deferred();
    var goodNoStr = goodNo || '';
    yuantaApp.Request.Adapter(
      'queryCustStocks',
      { workCode: 'queryCustStocks', custID: HeaderObject.GetIDNo(), goodNo: goodNoStr, isThreshold: true },
      function (data) {
        if (data && data.status === 'OK' && data.RsData) {
          $d.resolve(data.RsData);
        } else {
          // showError(data);
          $d.reject(data);
        }
      },
      function (error) {
        showError(error);
        $d.reject(error);
      },
      { start: true, end: false }
    );
    return $d.promise();
  };

  //查詢所有可申購境外股票及ETF IBDS010
  StockApiService.prototype.FetchStocksListAll = function () {
    var $d = jq.Deferred();
    yuantaApp.Request.Adapter(
      'fetchStocksListAll',
      { workCode: 'fetchStocksListAll', isThreshold: true },
      function (data) {
        if (data && data.status === 'OK' && data.RsData) {
          $d.resolve(data.RsData);
        } else {
          showError(data);
          $d.reject(data);
        }
      },
      function (error) {
        showError(error);
        $d.reject(error);
      },
      { start: true, end: false }
    );
    return $d.promise();
  };

  //依據參數設定查詢熱門境外股票及ETF IBDS010
  StockApiService.prototype.FetchStocksListHot = function () {
    var $d = jq.Deferred();
    yuantaApp.Request.Adapter(
      'fetchStocksListHot',
      { workCode: 'fetchStocksListHot', isThreshold: true },
      function (data) {
        if (data && data.status === 'OK' && data.RsData) {
          $d.resolve(data.RsData);
        } else {
          showError(data);
          $d.reject(data);
        }
      },
      function (error) {
        showError(error);
        $d.reject(error);
      },
      { start: true, end: false }
    );
    return $d.promise();
  };

  //申購取得境外股票或ETF資料 IBDS010
  StockApiService.prototype.FetchStocksByStockCode = function (trustNo) {
    var $d = jq.Deferred();
    yuantaApp.Request.Adapter(
      'fetchStocksByStockCode',
      { workCode: 'fetchStocksByStockCode', idNo: HeaderObject.GetIDNo(), trustNo: trustNo, isThreshold: true },
      function (data) {
        if (data && data.status === 'OK' && data.RsData) {
          $d.resolve(data.RsData);
        } else {
          showError(data);
          $d.reject(data);
        }
      },
      function (error) {
        showError(error);
        $d.reject(error);
      },
      { start: true, end: false }
    );
    return $d.promise();
  };

  //客戶庫存未平倉查詢 1430139
  StockApiService.prototype.FetchQueryOpenPositionStock = function (goodNo) {
    var $d = jq.Deferred();
    yuantaApp.Request.Adapter(
      'queryOpenPositionStock',
      { workCode: 'queryOpenPositionStock', custID: HeaderObject.GetIDNo(), goodNo: goodNo, isThreshold: true },
      function (data) {
        if (data && data.status === 'OK' && data.RsData) {
          $d.resolve(data.RsData);
        } else {
          showError(data);
          $d.reject(data);
        }
      },
      function (error) {
        showError(error);
        $d.reject(error);
      },
      { start: true, end: false }
    );
    return $d.promise();
  };

  //投資人清單查詢 1430138
  StockApiService.prototype.FetchQueryInvestorList = function () {
    var $d = jq.Deferred();
    yuantaApp.Request.Adapter(
      'queryInvestorList',
      { workCode: 'queryInvestorList', custID: HeaderObject.GetIDNo(), isThreshold: true },
      function (data) {
        if (data && data.status === 'OK' && data.RsData) {
          $d.resolve(data.RsData);
        } else {
          showError(data);
          $d.reject(data);
        }
      },
      function (error) {
        showError(error);
        $d.reject(error);
      },
      { start: false, end: false }
    );
    return $d.promise();
  };

  //長效單截止日期查詢 1430132
  StockApiService.prototype.FetchQueryLongTermOrderDeadlineDate = function (orderDate, marketCode) {
    var $d = jq.Deferred();
    yuantaApp.Request.Adapter(
      'queryLongTermOrderDeadlineDate',
      { workCode: 'queryLongTermOrderDeadlineDate', custID: HeaderObject.GetIDNo(), orderDate: orderDate, marketCode: marketCode, isThreshold: true },
      function (data) {
        if (data && data.status === 'OK' && data.RsData) {
          $d.resolve(data.RsData);
        } else {
          showError(data);
          $d.reject(data);
        }
      },
      function (error) {
        showError(error);
        $d.reject(error);
      },
      { start: false, end: false }
    );
    return $d.promise();
  };

  //股票委託單傳輸-首段 1430128
  StockApiService.prototype.FetchOrderOverseasStocks = function (data) {
    var $d = jq.Deferred();
    var queryBean = {};
    queryBean.workCode = 'orderOverseasStocks';
    queryBean.transNature = data.transNature || '';
    queryBean.branchCode = data.branchCode || '';
    queryBean.stockExchangeCode = data.stockExchangeCode || '';
    queryBean.trustNo = data.trustNo || '';
    queryBean.commQuantity = data.commQuantity || '';
    queryBean.commPrice = data.commPrice || '';
    queryBean.orderType = data.orderType || '';
    queryBean.orderPeriod = data.orderPeriod || '';
    queryBean.transType = data.transType || '';
    queryBean.orderPlacementMethod = data.orderPlacementMethod || '';
    queryBean.idCardNumber = data.idCardNumber || '';
    queryBean.trustAcc = data.trustAcc || '';
    queryBean.buType = data.buType || '';
    queryBean.trustBuzType = data.trustBuzType || '';
    queryBean.custBranchCode = data.custBranchCode || '';
    queryBean.depWithdrawalBankCode = data.depWithdrawalBankCode || '';
    queryBean.depWithdrawalAccount = data.depWithdrawalAccount || '';
    queryBean.custRiskProfile = data.custRiskProfile || '';
    queryBean.productRiskProfile = data.productRiskProfile || '';
    queryBean.custID = data.custID || '';
    queryBean.custLatestRiskRating = data.custLatestRiskRating || '';
    queryBean.execCode = 'CK';
    queryBean.entrustExprDate = data.entrustExprDate || '';
    queryBean.refAgentCode = data.refAgentCode || '';
    queryBean.custEDUBackground = data.custEDUBackground || '';
    queryBean.seriousIllenss = data.seriousIllenss || '';
    queryBean.kycValustionDate = data.kycValustionDate || '';
    queryBean.custCommissionProjCode = data.custCommissionProjCode || '';
    queryBean.currency = data.currency || '';
    queryBean.utilizationOfFunds = data.utilizationOfFunds || ''; //賣出用 NO(146)運用資金來源別
    queryBean.dispositionNotation = data.dispositionNotation || ''; //賣出用 NO(147)處分註記
    queryBean.isThreshold = true;

    yuantaApp.Request.Adapter(
      'workCode=orderOverseasStocks',
      queryBean,
      function (data) {
        if (data && data.status === 'OK' && data.RsData) {
          $d.resolve(data.RsData);
        } else {
          // if (data && data.errorCode == 'BKF_E082') {
          //   var modalOption = {
          //     showCloseBtn: false,
          //     showConfirmBtn: true,
          //     showCancelBtn: false,
          //     confirmAddOnClass: true,
          //     cancelAddOnClass: false,
          //     confirmText: '我知道了'
          //   };
          //   setTimeout(function () {
          //     var popup = yuantaApp.newBlock
          //       ._commonPopupModule()
          //       .set('modal', modalOption)
          //       .set(
          //         'modalContent',
          //         '<span class="key_blue" style="font-size:20px;">定期定額約定扣款金額不可大於一千萬。' + '(' + data.errorCode + ')' + '</span>'
          //       )
          //       .appendTo()
          //       .build();
          //     popup.open();
          //   }, 0);
          // }
          showError(data);
          $d.reject(data);
        }
      },
      function (error) {
        showError(error);
        $d.reject(error);
      },
      { start: true, end: false }
    );
    return $d.promise();
  };

  //股票委託單傳輸-次段-密碼驗證 1430128
  StockApiService.prototype.FetchOrderOverseasStocksPwd = function (data) {
    var $d = jq.Deferred();
    var queryBean = data;
    queryBean.workCode = 'orderOverseasStocksPwd';
    queryBean.isThreshold = true;

    yuantaApp.Request.Adapter(
      'workCode=orderOverseasStocksPwd',
      queryBean,
      function (data) {
        if (data && data.status === 'OK' && data.RsData) {
          $d.resolve(data.RsData);
        } else {
          showError(data);
          $d.reject(data);
        }
      },
      function (error) {
        showError(error);
        $d.reject(error);
      },
      { start: true, end: false }
    );
    return $d.promise();
  };

  //股票委託單傳輸-次段-生物辨識驗證 1430128
  StockApiService.prototype.FetchOrderOverseasStocksTouchID = function (data) {
    var $d = jq.Deferred();
    var queryBean = data;
    queryBean.workCode = 'orderOverseasStocksTouchID';
    queryBean.isThreshold = true;

    yuantaApp.Request.Adapter(
      'workCode=orderOverseasStocksTouchID',
      queryBean,
      function (data) {
        if (data && data.status === 'OK' && data.RsData) {
          $d.resolve(data.RsData);
        } else {
          showError(data);
          $d.reject(data);
        }
      },
      function (error) {
        showError(error);
        $d.reject(error);
      },
      { start: true, end: false }
    );
    return $d.promise();
  };

  //取得匯率(牌告)
  StockApiService.prototype.FetchGetFceRate = function (outCcy) {
    var $d = jq.Deferred();
    yuantaApp.Request.Adapter(
      'getFceRate',
      { workCode: 'getFceRate', outCcy: outCcy, inCcy: 'TWD' },
      function (data) {
        if (data && data.status === 'OK' && data.RsData) {
          $d.resolve(data.RsData);
        } else {
          showError(data);
          $d.reject(data);
        }
      },
      function (error) {
        showError(error);
        $d.reject(error);
      },
      { start: true, end: false }
    );
    return $d.promise();
  };

  //是否為信託戶
  StockApiService.prototype.FetchGetFundBranch = function (idNo) {
    var $d = jq.Deferred();
    yuantaApp.Request.Adapter(
      'workCode=getFundBranch',
      { workCode: 'getFundBranch', idNo: idNo, isThreshold: true },
      function (data) {
        if (data.status === 'OK' && data.RsData) {
          $d.resolve(data.RsData);
        } else {
          $d.reject(data);
        }
      },
      function (error) {
        showError(error);
        $d.reject(error);
      },
      { start: true, end: false }
    );
    return $d.promise();
  };

  //取得基金外幣轉出帳戶
  StockApiService.prototype.FetchGetFundFceOutAcct = function (idNo, selfTrans) {
    var $d = jq.Deferred();
    yuantaApp.Request.Adapter(
      'workCode=getFundFceOutAcct',
      { workCode: 'getFundFceOutAcct', idNo: idNo, selfTrans: selfTrans, isThreshold: true },
      function (data) {
        if (data && data.status === 'OK' && data.RsData) {
          $d.resolve(data.RsData);
        } else {
          showError(data);
          $d.reject(data);
        }
      },
      function (error) {
        showError(error);
        $d.reject(error);
      },
      { start: true, end: false }
    );
    return $d.promise();
  };

  // 檢核用戶是否為郵局戶 or 板農戶
  // & 暫存 信託契約換約聲明書 (version)
  // & 線上契約聲明書
  // & BC 股
  // & 簽署期信基金查詢
  // & 法人戶
  // & KYC
  StockApiService.prototype.FetchGetFundCustAndKycInfo = function (idNo, branchCode, searchType) {
    var $d = jq.Deferred();
    yuantaApp.Request.Adapter(
      'workCode=getFundCustAndKycInfo',
      {
        workCode: 'getFundCustAndKycInfo',
        idNo: idNo,
        branchCode: branchCode,
        searchType: searchType, //1:客戶資料查詢 2:簽署期信基金查詢 3:簽署高收益債券風險預告書
        fundCode: '',
        isThreshold: true
      },
      function (data) {
        if (data.status === 'OK' && data.RsData) {
          $d.resolve(data.RsData);
        } else {
          showError(data);
          $d.reject(data);
        }
      },
      function (error) {
        showError(error);
        $d.reject(error);
      },
      { start: true, end: false }
    );
    return $d.promise();
  };

  //是否為基金營業時間
  StockApiService.prototype.FetchIsFundBuyBusinessdate = function () {
    var $d = jq.Deferred();
    yuantaApp.Request.Adapter(
      'workCode=isFundBuyBusinessdate',
      { workCode: 'isFundBuyBusinessdate' },
      function (data) {
        if (data && data.status === 'OK' && data.RsData) {
          $d.resolve(data.RsData);
        } else {
          showError(data);
          $d.reject(data);
        }
      },
      '',
      { start: true, end: false }
    );
    return $d.promise();
  };

  //是否為股票營業時間
  //0:可交易
  //1:不可交易
  StockApiService.prototype.FetchIsStockBuyBuzDate = function () {
    var $d = jq.Deferred();
    yuantaApp.Request.Adapter(
      'workCode=isStockBuyBuzDate',
      { workCode: 'isStockBuyBuzDate' },
      function (data) {
        if (data && data.status === 'OK' && data.RsData) {
          $d.resolve(data.RsData);
        } else {
          showError(data);
          $d.reject(data);
        }
      },
      function (error) {
        showError(error);
        $d.reject(error);
      },
      { start: true, end: false }
    );
    return $d.promise();
  };

  return StockApiService;
})();