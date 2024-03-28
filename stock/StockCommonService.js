var StockCommonService = (function () {
  var This,
    StockCommonService = function () {
      This = this;
      This.closeCommonPopup();
    };

  StockCommonService.prototype.closeCommonPopup = function () {
    jq('#mainPage').removeClass('blur');
    jq('.commonPopup').remove();
  };

  StockCommonService.prototype.ToASCIIfunction = function (chars) {
    var ascii = '';
    for (var i = 0, l = chars.length; i < l; i++) {
      var c = chars[i].charCodeAt(0);
      if (c >= 0xff00 && c <= 0xffef) {
        c = 0xff & (c + 0x20);
      }
      ascii += String.fromCharCode(c);
    }
    return ascii;
  };

  StockCommonService.prototype.ToASCIIAndUpper = function (str) {
    return str ? This.ToASCIIfunction(str).toLocaleUpperCase() : '';
  };

  StockCommonService.prototype.FuzzySearch = function (resArr, value, objectName) {
    if (!resArr || (resArr && resArr.length <= 0)) {
      return [];
    }
    if (!value) {
      return [];
    }
    value = This.ToASCIIAndUpper(value);
    var regex = new RegExp('(' + value + ')', 'i');
    var arr = [];
    for (var i = 0; (data = resArr[i]); i++) {
      if (objectName) {
        if (data.hasOwnProperty(objectName) && This.ToASCIIAndUpper(data[objectName]).match(regex)) {
          arr.push(data);
        }
      } else if (data.match(regex)) {
        arr.push(data);
      }
    }
    return arr;
  };

  StockCommonService.prototype.ToggleLoading = function (status) {
    if (status) {
      jq.blockUI({
        message: "<div id='block_ui_loader'></div>",
        css: { border: 'none', backgroundColor: 'transparent' }
      });
    } else {
      jq.unblockUI();
    }
  };

  StockCommonService.prototype.GetPageId = function () {
    return jq('#funcPageContent').data('pageid');
  };

  StockCommonService.prototype.ID = function () {
    return CryptoJS.lib.WordArray.random(16).toString();
  };

  StockCommonService.prototype.CheckID = function (list, objectName, id) {
    if (list.length > 0) {
      var result = false;
      for (var i = 0; (data = list[i]); i++) {
        if (data.hasOwnProperty(objectName) && data[objectName] == id) {
          result = true;
          break;
        }
      }
      if (result) {
        This.CheckID(list, id, This.ID());
      } else {
        return id;
      }
    } else {
      return id;
    }
  };

  StockCommonService.prototype.ReplaceInputOnlyAlphaNumberAndChinese = (function () {
    var timer = null;
    var alphaNumberAndChinese = /[^\u4e00-\u9fa5\u3105-\u3129\u02CA\u02C7\u02CB\u02D9\u02c9A-Za-zＡ-Ｚａ-ｚ０-９\w\d]/g;
    return function (ele, event) {
      if (event.inputType == 'insertCompositionText') {
        return;
      }
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function () {
        ele.value = ele.value.replace(alphaNumberAndChinese, '');
        jq(ele).val(ele.value);
      }, 300);
    };
  })();

  StockCommonService.prototype.Throttle = function (fn, gapTime) {
    var _lastTime = null;

    return function () {
      var _nowTime = +new Date();
      if (_nowTime - _lastTime > gapTime || !_lastTime) {
        fn();
        _lastTime = _nowTime;
      }
    };
  };

  StockCommonService.prototype.Debounce = function (fn, wait) {
    var timer = null;
    return function () {
      var context = this;
      var args = arguments;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, wait);
    };
  };

  //是否有留存email及手機
  StockCommonService.prototype.HasUserInfo = function () {
    return !(!HeaderObject.GetLoginObject().custInfo.email && !HeaderObject.GetLoginObject().custInfo.phoneNo);
  };

  //開啟URL
  StockCommonService.prototype.OpenURL = function (url) {
    if (!url) {
      return;
    }
    window.open(url);
    if (jq.isFunction(yuantaApp.openURL)) {
      yuantaApp.openURL(url);
    }
  };

  //filter invType 1&3
  StockCommonService.prototype.FilterOneTime = function (list) {
    if (list && list.length > 0) {
      return list.filter(function (data) {
        return ['1', '3'].indexOf(data.invType) > -1;
      });
    }
    return [];
  };

  //filter invType 2&3
  StockCommonService.prototype.FilterDollarCostAveraging = function (list) {
    if (list && list.length > 0) {
      return list.filter(function (data) {
        return ['2', '3'].indexOf(data.invType) > -1;
      });
    }
    return [];
  };

  //取得國旗圖片前面文字(找不到對應的就顯示帶入的參數值)
  StockCommonService.prototype.GetMarketFlagInfo = function (marketNo) {
    var marketInfo = {
      marketText: '',
      flagPath: ''
    };
    switch (marketNo) {
      case 'USA':
        marketInfo.marketText = '美股';
        marketInfo.flagPath = yuantaApp.newBlock._getCurrencyFlagPath('USD');
        break;
      case 'HKG':
        marketInfo.marketText = '港股';
        marketInfo.flagPath = yuantaApp.newBlock._getCurrencyFlagPath('HKD');
        break;
      case 'HKS':
        marketInfo.marketText = '滬股';
        marketInfo.flagPath = yuantaApp.newBlock._getCurrencyFlagPath('CNY');
        break;
      case 'AUS':
        marketInfo.marketText = '澳股';
        marketInfo.flagPath = yuantaApp.newBlock._getCurrencyFlagPath('AUD');
        break;
      case 'JPN':
        marketInfo.marketText = 'JPN';
        marketInfo.flagPath = yuantaApp.newBlock._getCurrencyFlagPath('JPY');
        break;
      default:
        marketInfo.marketText = 'marketNo';
        marketInfo.flagPath = '';
    }
    return marketInfo;
  };

  //數字四捨五入後，若尾數為0則刪除，並加上千分位
  StockCommonService.prototype.FormatNum = function (num, toFixedNum) {
    var formatNum = +Number(num).toFixed(toFixedNum);
    formatNum = formatNum.toString();
    if (formatNum === '0') {
      return formatNum;
    }
    if (formatNum.indexOf('.') === -1) {
      if (formatNum.slice(0, 1) === '-') {
        return '-' + yuantaApp.Format.ToAmt(formatNum.slice(1, formatNum.length), 0, false);
      } else {
        return yuantaApp.Format.ToAmt(formatNum, 0, false);
      }
    } else {
      var arr = formatNum.split('.');
      if (arr && arr.length > 0) {
        var formatNum1 = arr[0];
        var formatNum2 = arr[1];
        if (formatNum1.slice(0, 1) === '-') {
          return '-' + yuantaApp.Format.ToAmt(formatNum1.slice(1, formatNum1.length), 0, false) + '.' + formatNum2;
        } else {
          return yuantaApp.Format.ToAmt(formatNum1, 0, false) + '.' + formatNum2;
        }
      }
    }
  };

  //暫存使用者搜尋紀錄
  StockCommonService.prototype.CacheStockSearchRecodeService = {
    set: function (value, callback, failCallback) {
      return ytaJsonStore.setItem('stockSearchRecode', value, callback, failCallback);
    },
    get: function () {
      return ytaJsonStore.getItem('stockSearchRecode');
    }
  };

  return StockCommonService;
})();