var StockSubscriptionComponent = (function () {
  var This,
    StockSubscriptionComponent = function (apiService, dispCacheService, commonService, validateRules) {
      This = this;
      This.apiService = apiService;
      This.dispCacheService = dispCacheService;
      This.commonService = commonService;
      This.validateRules = validateRules;
    };

  //_A0434_01境外股票/ETF申購選單
  StockSubscriptionComponent.prototype.TableItem = function () {
    var html =
      '<div>\
          <ul class="transaction">\
                <li>\
                    <div></div>\
                    <div class="fundCateegory">單筆申購\
                        <div style="font-size: 13px; color: #B6B6B6; margin: 14px 0 0 0;">當日有效單、長效單</div>\
                    </div>\
                    <a href="javascript:void(0)" data-key="oneTime"></a>\
                </li>\
            </ul>\
      </div>';
    var $html = jq(html);
    var event = {
      clickStockType: function () {}
    };
    var setEvent = function () {
      var $a = $html.find('.transaction li a');
      $a.off().on('click', function (e) {
        e.stopPropagation();
        var $this = jq(this);
        var key = $this.data('key');
        event.clickStockType(key);
      });
    };
    var interface = {
      mounted: function (cb) {
        if (cb && jq.isFunction(cb)) {
          cb();
        }
      }
    };
    var buildInterface = {
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        $html.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        interface.mounted(setEvent);
        return interface;
      }
    };
    return buildInterface;
  };

  //_A0435_01選擇標的
  StockSubscriptionComponent.prototype.newStockSelect = function () {
    var html =
      '<div class="wrapper">\
                  <div div class="inside">\
                      <div class="content">\
                          <section id="filter_set" class="filter_set"></section>\
                          <section id="tags"></section>\
                          <section id="select_box" class="centerSet featured"></section>\
                          <section id="result_count" class="m10"></section>\
                          <section id="list_stock"></section>\
                      </div>\
                  </div>\
              </div>';
    var $html = jq(html);

    var getChildSelector = function (name) {
      if (set.selector) {
        return set.selector + ' ' + name;
      }
    };

    //上方流程列
    var renderProcess = function () {
      var steps = [
        {
          name: '標的申購',
          key: '1',
          status: 'on' // on, done or ''
        },
        {
          name: '交易確認',
          key: '2',
          status: ''
        },
        {
          name: '交易完成',
          key: '3',
          status: ''
        }
      ];
      var selector = getChildSelector('.content');
      This.Process().set('steps', steps).appendTo(selector, 'prepend').build();
    };

    //搜尋input bar
    var inputFilter;
    var renderFilterInput = function (disableInput) {
      var selector = getChildSelector('#filter_set');
      inputFilter = This.InputFilter()
        .set('disableInput', disableInput)
        .event('inputChange', function (type, value) {
          removeStockSelect();
          if (type == 'del' || !value) {
            var defaultStockList = jq.extend(true, [], set.defaultStockList);
            renderStockList(defaultStockList);
            renderTags(set.tags);
          } else {
            var stocksListAll = jq.extend(true, [], set.stocksListAll);
            renderFilterResultList(This.commonService.FuzzySearch(stocksListAll, value, 'completeStockName'), value);
            renderTags(set.tags);
          }
        })
        .event('clickFilterBtn', function () {
          event.clickFilterBtn();
          removeStockSelect();
          renderTags(set.tags);
        })
        .appendTo(selector)
        .build();
    };

    //標籤
    var renderTags = function (tags) {
      if (tags && tags.length > 0) {
        var selector = getChildSelector('#tags');
        jq(selector).empty();
        This.Tags()
          .set('tags', tags)
          .event('click', function (isActive, key) {
            removeStockSelect();
            inputFilter.clearVal();
            event.clickTags(isActive, key);
          })
          .appendTo(selector)
          .build();
      }
    };

    //搜尋結果數量
    var renderStockListCount = function (conut) {
      var selector = getChildSelector('#result_count');
      var $selector = jq(selector);
      $selector.empty();
      if (!conut) {
        $selector.append('<p class="s_result">共0筆結果</p>');
        return;
      }
      $selector.append('<p class="s_result">共' + conut + '筆結果</p>');
    };

    //搜尋結果列表
    var renderStockList = function (stockList) {
      var selector = getChildSelector('#list_stock');
      jq(selector).empty();
      if (stockList && stockList.length > 0) {
        This.List().set('list', stockList).event('click', event.clickStockList).appendTo(selector).build();
      }
      renderStockListCount(stockList.length);
    };

    //搜尋結果列表-搜尋
    var renderFilterResultList = function (stockList, searchValue) {
      var selector = getChildSelector('#list_stock');
      jq(selector).empty();
      if (stockList && stockList.length > 0) {
        This.FilterResultList().set('searchValue', searchValue).set('list', stockList).event('click', event.clickStockList).appendTo(selector).build();
      }
      renderStockListCount(stockList.length);
    };

    var removeStockSelect = function () {
      var selector = getChildSelector('#select_box');
      jq(selector).empty();
    };

    var setData = function () {
      if (set.stocksListAll && set.stocksListAll.length > 0) {
        set.stocksListAll = set.stocksListAll.map(function (data) {
          var bondDesc = data.bondDesc || '';
          data.completeStockName = This.commonService.ToASCIIAndUpper(
            '(' + data.trustNo + ')-(' + data.tradeCommCode + ')-' + data.chtShortName + '-' + bondDesc + '-(' + data.currency + ')-(RR' + data.risk + ')'
          );
          return data;
        });
      }
      if (set.defaultStockList && set.defaultStockList.length > 0) {
        set.defaultStockList = set.defaultStockList.map(function (data) {
          var bondDesc = data.bondDesc || '';
          data.completeStockName = This.commonService.ToASCIIAndUpper(
            '(' + data.trustNo + ')-(' + data.tradeCommCode + ')-' + data.chtShortName + '-' + bondDesc + '-(' + data.currency + ')-(RR' + data.risk + ')'
          );
          return data;
        });
      }
      var render = function () {
        renderProcess();
        renderFilterInput(set.disableInput);
        renderTags(set.tags);
        renderStockList(set.defaultStockList);
        setEvent();
      };
      render();
    };

    var setEvent = function () {};

    var set = {
      selector: '',
      tags: [],
      stocksListAll: [],
      defaultStockList: [],
      process: [],
      disableInput: false
    };

    var event = {
      clickTags: function () {},
      clickStockList: function () {},
      clickFilterBtn: function () {}
    };

    var interface = {
      updateStockList: function (stockList) {
        if (stockList && stockList.length > 0) {
          set.defaultStockList = stockList.map(function (data) {
            var bondDesc = data.bondDesc || '';
            data.completeStockName = This.commonService.ToASCIIAndUpper(
              '(' + data.trustNo + ')-(' + data.tradeCommCode + ')-' + data.chtShortName + '-' + bondDesc + '-(' + data.currency + ')-(RR' + data.risk + ')'
            );
            return data;
          });
          renderStockList(set.defaultStockList);
        } else {
          renderStockList([]);
        }
      }
    };

    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $html.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };

    return buildInterface;
  };

  //選擇標的頁標籤
  StockSubscriptionComponent.prototype.Tags = function () {
    var html = '<ul class="tags ty5"></ul>';
    var $ul = jq(html);
    var setData = function () {
      if (set && set.tags.length > 0) {
        var liDom = '';
        for (var i = 0; (tag = set.tags[i]); i++) {
          var classList = tag.active ? 'on' : '';
          liDom += '<li class="' + classList + '" data-key="' + tag.key + '" ><a href="javascript:void(0)"></a>' + tag.name + '</li>';
        }
        $ul.append(liDom);
        $ul.appendTo(set.selector);
        setEvent();
      }
    };
    var setEvent = function () {
      var $selector = jq(set.selector);
      var $li = $selector.find('li');
      if ($li.length > 1) {
        $li.off().on('click', function (e) {
          e.stopPropagation();
          var $this = jq(this);
          var key = $this.data('key');
          var hasOnClass = $this.hasClass('on');
          if (hasOnClass) {
            $li.removeClass('on');
            event.click(false, key);
          } else {
            $li.removeClass('on');
            $this.addClass('on');
            event.click(true, key);
          }
        });
      }
    };
    var set = {
      selector: '',
      tags: []
    };
    var event = {
      click: function () {}
    };
    var interface = {};
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        return buildInterface;
      },
      build: function () {
        setData();
        setEvent();
        return interface;
      }
    };
    return buildInterface;
  };

  //上方流程圖
  StockSubscriptionComponent.prototype.Process = function () {
    var html = '<div class="process"></div>';
    var $html = jq(html);
    var setData = function () {
      if (set && set.steps.length > 0) {
        var $step = '';
        for (var i = 0; (step = set.steps[i]); i++) {
          $step += '<div data-key="' + step.key + '" class="' + step.status + '">' + step.name + '</div>';
        }
        $html.append($step);

        if (jq(set.selector) && jq(set.selector)[set.appendToApi]) {
          jq(set.selector)[set.appendToApi]($html);
        }
      }
    };
    var set = {
      steps: '',
      selector: '',
      appendToApi: 'appendTo'
    };
    var interface = {};
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      appendTo: function (selector, appendToApi) {
        if (selector) {
          set.selector = selector;
        }
        if (appendToApi) {
          set.appendToApi = appendToApi;
        }
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };

    return buildInterface;
  };

  //搜尋input bar
  StockSubscriptionComponent.prototype.InputFilter = function () {
    var html =
      '<div>\
          <div class="searchSet noBot">\
              <input id="searchInput" type="text" oninput="yuantaApp.newBlock._replaceInputOnlyAlphaNumberAndChinese(this, event)" inputmode="text" placeholder="請輸入關鍵字或國際代號" inputmode="text" autocorrect="off" spellcheck="false" autocapitalize="characters" style="text-transform:uppercase">\
              <div class="btn_search"><a href="javascript:void(0)"></a></div>\
              <a class="btn_delete none" href="javascript:void(0)"></a>\
          </div>\
      </div>\
      <div id="btn_filter">\
          <a href="javascript:void(0)" class="btn_filter">篩選</a>\
      </div>';
    var $html = jq(html);

    var set = {
      selector: '',
      searchValue: '',
      disableInput: false
    };

    var event = {
      inputChange: function () {},
      clickFilterBtn: function () {}
    };
    var disableInput = function () {
      var $selector = jq(set.selector);
      var $searchInput = $selector.find('#searchInput');
      var $searchSet = $selector.find('.searchSet');
      var $searchBtn = $selector.find('.btn_search');
      var $btnFilter = $selector.find('#btn_filter');
      if (set.disableInput) {
        $searchSet.css({ background: '#D2D2D2' });
        $searchInput.css({ background: '#D2D2D2' });
        $searchBtn.addClass('btn_search-second');
        $searchInput.addClass('disableInoutPlaceholder');
        $searchInput.prop('disabled', true);
        $btnFilter.addClass('none');
      }
    };
    var setData = function () {
      disableInput();
      setEvent();
    };

    var setEvent = function () {
      var $selector = jq(set.selector);
      var $searchInput = $selector.find('#searchInput');
      var $searchBtn = $selector.find('.btn_search');
      var $delBtn = $selector.find('.btn_delete');
      var $filterBtn = $selector.find('.btn_filter');

      $searchInput
        .on('input', function (e) {
          e.stopPropagation();
          if (set.disableInput) {
            return;
          }
          var $this = jq(this);
          var value = $this.val();
          if (value) {
            value = This.commonService.ToASCIIAndUpper(value);
          }
          if (!value) {
            $searchBtn.removeClass('none');
            $delBtn.addClass('none');
          }
          if (set.searchValue && set.searchValue != value) {
            $searchBtn.removeClass('none');
            $delBtn.addClass('none');
          } else {
            $this.val(value);
          }
          set.searchValue = value;
          if (!set.searchValue) {
            event.inputChange('keyup', set.searchValue);
          }
        })
        .on('keypress', function (e) {
          e.stopPropagation();
          if (set.disableInput) {
            return;
          }
          var $this = jq(this);
          var value = $this.val();
          if (value) {
            value = This.commonService.ToASCIIAndUpper(value);
          }
          set.searchValue = value;
          if (e.keyCode == 13) {
            $searchBtn.addClass('none');
            $delBtn.removeClass('none');
            $this.trigger('blur');
            event.inputChange('keypress', set.searchValue);
          }
        });

      $searchBtn.on('click', function () {
        if (set.disableInput) {
          return;
        }
        if (!$searchInput.val()) {
          return;
        }
        $searchBtn.addClass('none');
        $delBtn.removeClass('none');
        event.inputChange('keyup', set.searchValue);
      });

      $delBtn.on('click', function () {
        if (set.disableInput) {
          return;
        }
        $searchBtn.removeClass('none');
        $delBtn.addClass('none');
        $searchInput.val('');
        set.searchValue = '';
        event.inputChange('del', set.searchValue);
      });

      $filterBtn.on('click', function () {
        event.clickFilterBtn();
      });
    };

    var interface = {
      clearVal: function () {
        var $searchInput = $html.find('#searchInput');
        $searchInput.val('');
      }
    };

    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $html.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };

    return buildInterface;
  };

  //搜尋結果清單
  StockSubscriptionComponent.prototype.List = function () {
    var html = '<ul class="list_fund"></ul>';
    var $ul = jq(html);
    var setData = function () {
      if (set && set.list.length > 0) {
        for (var i = 0; (list = set.list[i]); i++) {
          var li = '<li><a href="javascript:void(0)"></a>' + list.completeStockName + '</li>';
          var $li = jq(li);
          $li.attr('data-trustNo', list.trustNo);
          $li.appendTo($ul);
        }
        $ul.appendTo(set.selector);
        setEvent();
      }
    };
    var setEvent = function () {
      var $selector = jq(set.selector);
      var $li = $selector.find('li');
      $li.off().on('click', function () {
        var $this = jq(this);
        var data = $this.data('trustno');
        event.click(data);
      });
    };
    var set = {
      selector: '',
      list: []
    };
    var event = {
      click: function () {}
    };
    var interface = {};
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //搜尋結果清單-搜尋
  StockSubscriptionComponent.prototype.FilterResultList = function () {
    var html = '<ul class="list_fund"></ul>';
    var $ul = jq(html);
    var setData = function () {
      if (set && set.list.length > 0 && set.searchValue) {
        var replacment = '<span class="key">$1</span>';
        var regex = new RegExp('(' + This.commonService.ToASCIIAndUpper(set.searchValue) + ')', 'i');
        for (var i = 0; (list = set.list[i]); i++) {
          list.completeStockName = list.completeStockName.replace(regex, replacment);
          var li = '<li><a href="javascript:void(0)"></a>' + list.completeStockName + '</li>';
          var $li = jq(li);
          $li.attr('data-trustNo', list.trustNo);
          $li.appendTo($ul);
        }
        $ul.appendTo(set.selector);
        setEvent();
      }
    };
    var setEvent = function () {
      var $selector = jq(set.selector);
      var $li = $selector.find('li');
      $li.off().on('click', function () {
        var $this = jq(this);
        var data = $this.data('trustno');
        event.click(data);
      });
    };
    var set = {
      selector: '',
      list: [],
      searchValue: ''
    };
    var event = {
      click: function () {}
    };
    var interface = {};
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //_A0435_01篩選條件頁
  StockSubscriptionComponent.prototype.FilterSearchPopup = function () {
    var html =
      '<div class="popup newBlock">\
          <div class="popup_close" tabindex="0" data-aria="cancel">\
              <img src="images/menu_back.png" role="button" alt="" />\
          </div>\
          <div class="popup_title background_base bg_blue">\
              <span>篩選條件</span>\
          </div>\
          <div class="popup_content">\
              <div class="wrapper">\
                  <div class="inside">\
                      <div class="content noSpace" style="padding-bottom:30px;">\
                          <div class="conditionBox">\
                              <div class="condition_set">\
                                  <div class="tt_2">市場</div>\
                                  <div id="area" class="option_box">\
                                      <label><input id="allMarket" type="checkbox" name="market" value="allMarket" checked="true"><span>全部</span></label><br>\
                                      <label><input id="US" type="checkbox" name="market" value="US"><span class="marketSpan checkedButton">美股</span></label>\
                                      <label><input id="HK" type="checkbox" name="market" value="HK"><span class="marketSpan checkedButton">港股</span></label>\
                                      <label><input id="HS" type="checkbox" name="market" value="HS"><span class="marketSpan checkedButton">滬股</span></label>\
                                  </div>\
                              </div>\
                              <div class="condition_set">\
                                  <div class="tt_2">風險報酬等級</div>\
                                  <div class="option_box">\
                                      <label><input type="checkbox" name="risk" value="1"><span>RR1</span></label><br>\
                                      <label><input type="checkbox" name="risk" value="2"><span>RR2</span></label><br>\
                                      <label><input type="checkbox" name="risk" value="3"><span>RR3</span></label><br>\
                                      <label><input type="checkbox" name="risk" value="4"><span>RR4</span></label>\
                                      <label><input type="checkbox" name="risk" value="5"><span>RR5</span></label>\
                                  </div>\
                              </div>\
                              <div class="condition_set">\
                                  <div class="tt_1">商品計價幣別<div class="num"></div><a href="javascript:void(0)" class="btn_more nth2"></a></div>\
                                  <div class="expand nth2">\
                                      <div id="currency" class="option_box typ_3set">\
                                        <label><input type="checkbox" name="currency" value="USD"><span>美元</span></label>\
                                        <label><input type="checkbox" name="currency" value="HKD"><span>港幣</span></label>\
                                        <label><input type="checkbox" name="currency" value="CNY"><span>人民幣</span></label>\
                                      </div>\
                                  </div>\
                              </div>\
                          </div>\
                          <div class="bot_btn_set">\
                              <div class="reset"><a href="javascript:void(0)"></a>清除條件</div>\
                              <div class="confirm on"><a href="javascript:void(0)"></a>確定</div>\
                          </div>\
                      </div>\
                  </div>\
              </div>\
          </div>\
      </div>';
    var $popup = jq(html);

    //計價幣別
    var reudnerCurrency = function () {
      $btnMoreNthSeconed = jq('a.btn_more.nth2');
      $expandNthSeconed = jq('.expand.nth2');
      $btnMoreNthSeconed.off().on('click', function () {
        $expandNthSeconed.slideToggle();
        $btnMoreNthSeconed.toggleClass('active');
        yuantaApp.popupResize(set.selector.replace('#', ''));
      });
    };

    var renderDefault = function () {
      if (set.defaultData && Object.keys(set.defaultData).length > 0) {
        //市場
        set.currentMarket = set.defaultData.currentMarket;
        if (set.currentMarket.length > 0) {
          jq.each($popup.find('input[name="market"]'), function (index, elm) {
            var $this = jq(elm);
            var value = $this.val();
            if (value == set.currentMarket) {
              $this.prop('checked', true);
            } else {
              $this.prop('checked', false);
            }
          });
        }
        //風險等級
        set.currentSelectRisk = set.defaultData.currentSelectRisk;
        if (set.currentSelectRisk.length > 0) {
          jq.each($popup.find('input[name="risk"]'), function (index, elm) {
            var $this = jq(elm);
            var value = $this.val();
            if (set.currentSelectRisk.includes(value)) {
              $this.prop('checked', true);
            } else {
              $this.prop('checked', false);
            }
          });
        }
        //商品計價幣別
        set.currentSelectCCyList = set.defaultData.currentSelectCCyList;
        if (set.currentSelectCCyList.length > 0) {
          jq.each($popup.find('input[name="currency"]'), function (index, elm) {
            var $this = jq(elm);
            var value = $this.val();
            if (set.currentSelectCCyList.includes(value)) {
              $this.prop('checked', true);
            } else {
              $this.prop('checked', false);
            }
          });
          jq('a.btn_more.nth2').click();
        }
      }
    };

    var setData = function () {
      reudnerCurrency();
      renderDefault();
      setEvent();
    };
    var $currency, $btnMoreNthSeconed, $expandNthSeconed, $popupClose, $popupConfirm, $popupReset;
    var setEvent = function () {
      //市場
      $popup
        .find('input[name="market"]')
        .off()
        .on('click', function () {
          var $this = jq(this);
          var $marketSpan = $popup.find('.marketSpan');
          if ($this.val() == 'allMarket') {
            $marketSpan.addClass('checkedButton');
          } else {
            $marketSpan.removeClass('checkedButton');
          }
          if ($this.val() == set.currentMarket) {
            $this.prop('checked', true);
          } else {
            $popup.find('input[name="market"]').prop('checked', false);
            $this.prop('checked', true);
            set.currentMarket = $this.val();
          }
        });
      //風險報酬等級
      $popup
        .find('input[name="risk"]')
        .off()
        .on('click', function () {
          var $this = jq(this);
          var value = jq(this).val();
          var isChecked = $this.prop('checked');
          if (set.currentSelectRisk && set.currentSelectRisk.length > 0) {
            if (!set.currentSelectRisk.includes(value) && isChecked) {
              set.currentSelectRisk.push(value);
            } else if (set.currentSelectRisk.includes(value) && !isChecked) {
              set.currentSelectRisk = set.currentSelectRisk.filter(function (item) {
                return item != value;
              });
            }
          } else {
            if (isChecked) {
              set.currentSelectRisk.push(value);
            }
          }
        });
      //商品計價幣別
      $popup
        .find('input[name="currency"]')
        .off()
        .on('click', function () {
          var $this = jq(this);
          var value = $this.val();
          var isChecked = $this.prop('checked');
          if (set.currentSelectCCyList && set.currentSelectCCyList.length > 0) {
            if (!set.currentSelectCCyList.includes(value) && isChecked) {
              set.currentSelectCCyList.push(value);
            } else if (set.currentSelectCCyList.includes(value) && !isChecked) {
              set.currentSelectCCyList = set.currentSelectCCyList.filter(function (item) {
                return item != value;
              });
            }
          } else {
            if (isChecked) {
              set.currentSelectCCyList.push(value);
            }
          }
        });

      //關閉
      $popupClose = $popup.find('.popup_close');
      $popupClose.on('click', function () {
        interface.close();
        event.popupClose();
      });

      //確定
      $popupConfirm = $popup.find('.confirm');
      $popupConfirm.on('click', function () {
        event.popupConfirm(set);
      });

      //清除條件
      $popupReset = $popup.find('.reset');
      $popupReset.on('click', function () {
        //市場
        var $allMarket = $popup.find('#allMarket');
        var $US = $popup.find('#US');
        var $HK = $popup.find('#HK');
        var $HS = $popup.find('#HS');
        var $marketSpan = $popup.find('.marketSpan');
        $allMarket.prop('checked', true);
        $US.prop('checked', false);
        $HK.prop('checked', false);
        $HS.prop('checked', false);
        $marketSpan.addClass('checkedButton');
        set.currentMarket = 'allMarket';
        //風險報酬等級
        var $risk = $popup.find('input[name="risk"]');
        $risk.prop('checked', false);
        set.currentSelectRisk = [];
        //商品計價幣別
        $currency = $popup.find('input[name="currency"]');
        $currency.prop('checked', false);
        set.currentSelectCCyList = [];
      });
    };
    var set = {
      selector: '',
      currentMarket: 'allMarket',
      currentSelectRisk: [],
      currentSelectCCyList: [],
      defaultData: {}
    };
    var event = {
      popupClose: function () {},
      popupConfirm: function () {}
    };
    var interface = {
      open: function () {
        location.replace(set.selector);
        yuantaApp.gettransarr();
        yuantaApp.popupResize(set.selector.replace('#', ''));
        return interface;
      },
      close: function () {
        jq(set.selector).empty();
        location.replace('#');
        yuantaApp.gettransarr();
        return interface;
      }
    };

    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $popup.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };

    return buildInterface;
  };

  //_A0435_01篩選結果頁
  StockSubscriptionComponent.prototype.SearchResultPopup = function () {
    var html =
      '<div class="popup newBlock">\
          <div class="popup_close" tabindex="0" data-aria="cancel">\
              <img src="images/menu_back.png" role="button" alt="" />\
          </div>\
          <div class="popup_title background_base bg_blue">\
              <span>條件篩選結果</span>\
          </div>\
          <div class="popup_content\
              <div class="wrapper">\
                  <div class="inside">\
                      <div class="content">\
                          <section>\
                              <ul id="queryBean" class="tags ty3">\
                              </ul>\
                          </section>\
                          <section id="result_count" class="twoSet">\
                              <p class="s_result"></p>\
                          </section>\
                          <ul class="list"></ul>\
                          <div class="s_result_Box none">\
                              <p class="noRecord"><span>無符合條件的結果</span></p>\
                          </div>\
                      </div>\
                  </div>\
              </div>\
          </div>\
      </div>';

    var $popup = jq(html);
    var filter = function (stocksList, query) {
      var currentMarket = query.currentMarket || '';
      var currentSelectRisk = query.currentSelectRisk || [];
      var currentSelectCCyList = query.currentSelectCCyList || [];

      //市場
      var filtersMarket = function (arr) {
        if (arr && arr.length > 0) {
          return arr.filter(function (data) {
            return data.marketArea == currentMarket || data.tradeCode == currentMarket;
          });
        } else {
          return [];
        }
      };
      //風險等級
      var filtersRiskLevel = function (arr) {
        if (arr && arr.length > 0) {
          return arr.filter(function (data) {
            return currentSelectRisk.includes(data.risk);
          });
        } else {
          return [];
        }
      };
      //計價幣別
      var filterCurrency = function (arr) {
        if (arr && arr.length > 0) {
          var ccyList = currentSelectCCyList;
          return arr.filter(function (data) {
            return ccyList.includes(data.currency);
          });
        } else {
          return [];
        }
      };

      if (currentMarket !== 'allMarket') {
        stocksList = filtersMarket(stocksList);
      }
      if (currentSelectRisk && currentSelectRisk.length > 0) {
        stocksList = filtersRiskLevel(stocksList);
      }
      if (currentSelectCCyList && currentSelectCCyList.length > 0) {
        stocksList = filterCurrency(stocksList);
      }
      return stocksList && stocksList.length > 0 ? stocksList : [];
    };

    //顯示選擇的篩選條件tag
    var renderTags = function (query) {
      var $queryBean = $popup.find('#queryBean');
      var html = '';
      $queryBean.empty();
      //市場
      if (query.currentMarket === 'allMarket') {
        html += '<li style="padding:0px 25px;">全部</li>';
      } else if (query.currentMarket === 'US') {
        html += '<li style="padding:0px 25px;">美股</li>';
      } else if (query.currentMarket === 'HK') {
        html += '<li style="padding:0px 25px;">港股</li>';
      } else if (query.currentMarket === 'HS') {
        html += '<li style="padding:0px 25px;">滬股</li>';
      }
      //風險報酬等級
      if (query.currentSelectRisk && query.currentSelectRisk.length > 0) {
        for (var i = 0; (risk = query.currentSelectRisk[i]); i++) {
          html += ' <li><a href="javascript:void(0)" class="risk delete" data-risk="' + risk + '"></a>' + 'RR' + risk + '</li>';
        }
      }
      //商品計價幣別
      if (query.currentSelectCCyList && query.currentSelectCCyList.length > 0) {
        for (var i = 0; (cc = query.currentSelectCCyList[i]); i++) {
          html += ' <li><span class="txt" data-txt="' + cc + '" ></span><a href="javascript:void(0)" class="cc delete" data-cc="' + cc + '"></a></li>';
        }
      }
      $queryBean.append(html);

      //按計價幣別X
      var $cc = $queryBean.find('.cc');
      $cc.off().on('click', function (e) {
        e.stopPropagation();
        var $this = jq(this);
        var cc = $this.data('cc');
        set.query.currentSelectCCyList = set.query.currentSelectCCyList.filter(function (data) {
          return data != cc;
        });
        setData();
      });
      //按風險等級X
      $risk = $queryBean.find('.risk');
      $risk.off().on('click', function (e) {
        e.stopPropagation();
        var $this = jq(this);
        var risk = $this.data('risk');
        set.query.currentSelectRisk = set.query.currentSelectRisk.filter(function (data) {
          return data != risk;
        });
        setData();
      });
    };

    //幾筆結果
    var renderStockListCount = function (conut) {
      var $resultCount = $popup.find('#result_count');
      var $sresult_Box = $popup.find('.s_result_Box');
      $resultCount.empty();
      if (!conut) {
        $resultCount.addClass('none');
        $sresult_Box.removeClass('none');
        return;
      }
      $resultCount.removeClass('none');
      $sresult_Box.addClass('none');
      $resultCount.append('<p class="s_result">共' + conut + '筆結果</p>');
    };

    //結果清單
    var renderStockList = function (stocksList) {
      var selector = set.selector + ' .list';
      jq(selector).empty();
      if (stocksList && stocksList.length > 0) {
        This.List().set('list', stocksList).event('click', event.clickStockList).appendTo(selector).build();
      }
      renderStockListCount(stocksList.length);
    };

    var setData = function () {
      renderTags(set.query);
      renderStockList(filter(set.stocksList, set.query));
      setEvent();
      yuantaApp.gettransarr();
    };
    var $popupClose;
    var setEvent = function () {
      $popupClose = $popup.find('.popup_close');
      $popupClose.off().on('click', function () {
        event.popupClose(set.query);
      });
    };
    var set = {
      selector: '',
      stocksList: [],
      query: []
    };

    var event = {
      popupClose: function () {},
      clickStockList: function () {}
    };

    var interface = {
      open: function () {
        location.replace(set.selector);
        yuantaApp.gettransarr();
        yuantaApp.popupResize(set.selector.replace('#', ''));
        return interface;
      },
      close: function () {
        location.replace('#');
        yuantaApp.gettransarr();
        jq(set.selector).empty();
        return interface;
      }
    };

    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $popup.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };

    return buildInterface;
  };

  //_A0436_01申購主頁
  StockSubscriptionComponent.prototype.SubscriptionPopup = function () {
    var html =
      '<div class="wrapper">\
          <div class="inside">\
              <div class="content">\
                  <div class="process">\
                      <div class="on">資料填寫</div>\
                      <div>同意簽署</div>\
                      <div>交易確認</div>\
                  </div>\
                  <section>\
                      <div id="risk_info" class="risk_info"></div>\
                  </section>\
                  <section id="risk_detail_info"></section>\
                  <div class="info_input_area">\
                      <section id="investing_methods"></section>\
                      <section id="investment_currency"></section>\
                      <section id="debit_stock_by_investing_methods"></section>\
                      <section id="debit_amount_by_investing_methods"></section>\
                      <section id="debit_period_by_investing_methods"></section>\
                      <section id="debit_date_by_long_period_methods"></section>\
                      <section id="debit_account"></section>\
                      <section id="recommender_code"></section>\
                  </div>\
                  <! -- invalid -->\
                  <div class="bot_btn_set">\
                      <div id="submit" class="single"><a href="javascript:void(0)"></a>下一步</div>\
                  </div>\
              </div>\
          </div>\
        </div>';
    var $popup = jq(html);
    var getChildSelector = function (name) {
      if (set.selector && name) {
        return set.selector + ' ' + name;
      }
    };
    var tool = {
      disableAllInput: function () {
        var $selector = jq('#funcPageContent');
        var $inputBox = $selector.find('.input_box');
        var $input = $selector.find('input');
        var $accountShow = $selector.find('.account_show');
        var $iAgree = $selector.find('.iAgree');
        var $select = $selector.find('select');
        var $redeemLink = $selector.find('#redeemLink');
        $inputBox.addClass('disabled');
        $input.prop('checked', false).attr('disabled', true).val('');
        $input.siblings('span').addClass('disabled');
        $accountShow.text('請選擇扣款帳號');
        $iAgree.removeClass('none');
        $select.attr('disabled', true);
        $redeemLink.addClass('disabled');
      },
      unDisableAllInput: function () {
        var $selector = jq('#funcPageContent');
        var $inputBox = $selector.find('.input_box');
        var $input = $selector.find('input');
        var $accountShow = $selector.find('.account_show');
        var $iAgree = $selector.find('.iAgree');
        var $select = $selector.find('select');
        var $redeemLink = $selector.find('#redeemLink');
        $inputBox.removeClass('disabled');
        $input.prop('checked', false).attr('disabled', false);
        $input.siblings('span').removeClass('disabled');
        $accountShow.text('請選擇扣款帳號');
        $iAgree.removeClass('none');
        $select.attr('disabled', false);
        $redeemLink.removeClass('disabled');
      },
      removeEvent: function () {
        var $selector = jq('#funcPageContent');
        var $submit = $selector.find('#submit');
        var $openDatePicker = $selector.find('#open_date_picker');
        $submit.off().parent().addClass('invalid');
        jq('#startDateInput').mobiscroll('destroy');
        jq('#endDateInput').mobiscroll('destroy');
        $openDatePicker.off();
      }
    };

    //風險等級
    var setRiskInfo = function () {
      var selector = getChildSelector('#risk_info');
      jq(selector).empty();
      var data = subscriptionStockService.getSubscriptionStockServiceData();
      This.RiskInfo()
        .set('data', data)
        .event('clickRickLevel', function () {
          subscriptionStockService.handleKYC();
        })
        .appendTo(selector)
        .build();
    };

    //小卡
    var setRiskDetailInfo = function () {
      var selector = getChildSelector('#risk_detail_info');
      jq(selector).empty();
      var data = subscriptionStockService.getSubscriptionStockServiceData();
      This.RiskDetailInfo().set('data', data).appendTo(selector).build();
    };

    //投資方式
    var setInvestingMethods = function () {
      var selector = getChildSelector('#investing_methods');
      jq(selector).empty();
      var invType = subscriptionStockService.getInvType();
      var stockData = subscriptionStockService.getStockData();
      var currency = (stockData && stockData.currency) || '';
      This.InvestingMethods()
        .set('invType', invType)
        .set('isLoading', set.isLoading)
        .set('stockData', stockData)
        .event('change', function (data) {
          set.invType = data.value;
          subscriptionStockService.data.invType = data.value;
          set.buyAmount = '';
          set.buyStock = '';
          setInvestmentCurrency(); //投資幣別
          setDebitAccount(currency); //預設帳號、選擇帳號、餘額
        })
        .appendTo(selector)
        .build();
    };

    //投資幣別
    var setInvestmentCurrency = function () {
      var selector = getChildSelector('#investment_currency');
      jq(selector).empty();
      var data = subscriptionStockService.getSubscriptionStockServiceData();
      var stockData = subscriptionStockService.getStockData();
      var currency = (stockData && stockData.currency) || '';
      This.InvestmentCurrency()
        .set('isLoading', set.isLoading)
        .set('data', data)
        .set('currency', currency)
        .service('hasFceAccountAndFceAcctList', subscriptionStockService.hasFceAccountAndFceAcctList)
        .service('hasFceAccountAndNotFceAcctList', subscriptionStockService.hasFceAccountAndNotFceAcctList)
        .service('setDisableInput', subscriptionStockService.setDisableInput)
        .service('disableAllInput', tool.disableAllInput)
        .event('change', function (currentCurrency) {
          set.invCcy = currentCurrency;
          setDebitAccount(set.invCcy);
        })
        .appendTo(selector)
        .build();
    };

    //預設帳號、選擇帳號、餘額
    var setFirstAccount = true;
    var setDebitAccount = function (currey) {
      var selector = getChildSelector('#debit_account');
      jq(selector).empty();
      var accountList = [];
      var data = subscriptionStockService.getSubscriptionStockServiceData();
      var getDebitAccount = subscriptionStockService.getDebitAccount();
      var cacheDebitAccount = (getDebitAccount && getDebitAccount.certNo) || '';
      if (data.fceAcctList && data.fceAcctList.length > 0) {
        accountList = data.fceAcctList;
      }
      This.DebitAccount()
        .set('currey', currey)
        .set('cacheDebitAccount', cacheDebitAccount)
        .set('accountList', accountList)
        .service('setDisableInput', subscriptionStockService.setDisableInput)
        .service('getDisableInput', subscriptionStockService.getDisableInput)
        .event('changeAccount', function (currentAccount) {
          var $selector = jq(set.selector);
          var $submit = $selector.find('#submit');
          $submit.parent().removeClass('invalid');
          set.account = currentAccount.acctNo;
          if (setFirstAccount) {
            setDebitStockByInvestingMethods(set.invType); //委託股數
            setDebitAmountByInvestingMethods(set.invType, currentAccount); //委託價格
            setDebitPeriodByInvestingMethods(set.invType); //訂單有效期間
            setRecommender(); //介紹人編號
            setFirstAccount = false;
          }
        })
        .event('changeAccountFail', function () {
          var $selector = jq(set.selector);
          var $submit = $selector.find('#submit');
          $submit.parent().addClass('invalid');
          setDebitStockByInvestingMethods(set.invType); //委託股數
          setDebitAmountByInvestingMethods(set.invType, ''); //委託價格
          setDebitPeriodByInvestingMethods(set.invType); //訂單有效期間
          setRecommender(); //介紹人編號
        })
        .event('settingDebitAccount', function (value) {
          subscriptionStockService.updateDebitAccountStatus(value);
        })
        .appendTo(selector)
        .build();
    };

    //委託股數
    var debitStockByInvestingMethods;
    var setDebitStockByInvestingMethods = function (investingMethods) {
      var selector = getChildSelector('#debit_stock_by_investing_methods');
      jq(selector).empty();
      var data = subscriptionStockService.getSubscriptionStockServiceData();
      debitStockByInvestingMethods = This.DebitStockByInvestingMethods()
        .set('data', data)
        .service('setDisableInput', subscriptionStockService.setDisableInput)
        .service('getDisableInput', subscriptionStockService.getDisableInput)
        .event('inputChange', function (data) {
          set.buyStock = data.value;
        })
        .appendTo(selector, investingMethods)
        .build();
    };

    //委託價格
    var debitAmountByInvestingMethods;
    var setDebitAmountByInvestingMethods = function (investingMethods, currentAccount) {
      var selector = getChildSelector('#debit_amount_by_investing_methods');
      jq(selector).empty();
      var data = subscriptionStockService.getSubscriptionStockServiceData();
      debitAmountByInvestingMethods = This.DebitAmountByInvestingMethods()
        .set('isFundBuyBusinessdate', subscriptionStockService.getFundBuyBusinessdate())
        .set('currentAccount', currentAccount)
        .set('data', data)
        .service('setDisableInput', subscriptionStockService.setDisableInput)
        .service('getDisableInput', subscriptionStockService.getDisableInput)
        .event('inputChange', function (data) {
          set.buyAmount = data.value;
        })
        .appendTo(selector, investingMethods)
        .build();
    };

    //訂單有效期間
    var debitPeriodByInvestingMethods;
    var setDebitPeriodByInvestingMethods = function (investingMethods) {
      var selector = getChildSelector('#debit_period_by_investing_methods');
      var $debitDateByLongPeriod = jq('#debit_date_by_long_period_methods');
      jq(selector).empty();
      debitPeriodByInvestingMethods = This.DebitPeriodByInvestingMethods()
        .set('isLoading', set.isLoading)
        .event('changePeriodMethods', function (method) {
          if (method === 'oneDayPeriod') {
            //當日有效
            set.period = 'oneDayPeriod';
            $debitDateByLongPeriod.empty();
          } else {
            //長效單
            set.period = 'longPeriod';
            $debitDateByLongPeriod.empty();
            setDebitDateByLongPeriodMethods();
          }
        })
        .appendTo(selector, investingMethods)
        .build();
    };

    //長效單委託迄日
    var debitDateByLongPeriodMethods;
    var setDebitDateByLongPeriodMethods = function () {
      var selector = getChildSelector('#debit_date_by_long_period_methods');
      jq(selector).empty();
      var data = subscriptionStockService.getSubscriptionStockServiceData();
      debitDateByLongPeriodMethods = This.DebitDateByLongPeriodMethods()
        .set('data', data)
        .service('setDisableInput', subscriptionStockService.setDisableInput)
        .service('getDisableInput', subscriptionStockService.getDisableInput)
        .event('updateLongPeriodDate', function (longPeriodDate) {
          if (longPeriodDate) {
            set.longPeriodDate = longPeriodDate;
          }
        })
        .appendTo(selector)
        .build();
    };

    //介紹人編號
    var debitRecommender;
    var setRecommender = function () {
      var selector = getChildSelector('#recommender_code');
      jq(selector).empty();
      debitRecommender = This.Recommender()
        .service('setDisableInput', subscriptionStockService.setDisableInput)
        .service('getDisableInput', subscriptionStockService.getDisableInput)
        .event('inputChange', function (value) {
          set.recommenderValue = value;
        })
        .appendTo(selector)
        .build();
    };

    var handleFormValid = function () {
      var result = true;
      var scrollTo = function (id) {
        document.getElementById(id.replace('#', '')).scrollIntoView();
      };
      var scrollToId = '';
      var validByInvType = {
        1: function () {
          var result = true;
          //長效單委託迄日
          if (set.period === 'longPeriod' && debitDateByLongPeriodMethods && !debitDateByLongPeriodMethods.valid()) {
            if (!scrollToId) {
              scrollToId = '#debit_date_by_long_period_methods';
              scrollTo(scrollToId);
            }
            result = false;
          }
          return result;
        }
      };
      //投資方式
      if (!set.invType) {
        if (!scrollToId) {
          scrollToId = '#investing_methods';
          scrollTo(scrollToId);
        }
        result = false;
      }
      //投資幣別
      if (!set.invCcy) {
        if (!scrollToId) {
          scrollToId = '#investment_currency';
          scrollTo(scrollToId);
        }
        result = false;
      }
      //扣款帳號
      if (!set.account) {
        if (!scrollToId) {
          scrollToId = '#debit_account';
          scrollTo(scrollToId);
        }
        result = false;
      }
      //委託股數
      if (!set.buyStock) {
        debitStockByInvestingMethods && !debitStockByInvestingMethods.valid();
        if (!scrollToId) {
          scrollToId = '#debit_stock_by_investing_methods';
          scrollTo(scrollToId);
        }
        result = false;
      } else if (debitStockByInvestingMethods && !debitStockByInvestingMethods.valid()) {
        if (!scrollToId) {
          scrollToId = '#debit_stock_by_investing_methods';
          scrollTo(scrollToId);
        }
        result = false;
      }
      //委託價格
      if (!set.buyAmount) {
        debitAmountByInvestingMethods && !debitAmountByInvestingMethods.valid();
        if (!scrollToId) {
          scrollToId = '#debit_amount_by_investing_methods';
          scrollTo(scrollToId);
        }
        result = false;
      } else if (debitAmountByInvestingMethods && !debitAmountByInvestingMethods.valid()) {
        if (!scrollToId) {
          scrollToId = '#debit_amount_by_investing_methods';
          scrollTo(scrollToId);
        }
        result = false;
      }
      //介紹人編號
      if (!set.recommenderValue) {
        debitRecommender && !debitRecommender.valid();
        if (!scrollToId) {
          scrollToId = '#recommender_code';
          scrollTo(scrollToId);
        }
        result = false;
      } else if (debitRecommender && !debitRecommender.valid()) {
        if (!scrollToId) {
          scrollToId = '#recommender_code';
          scrollTo(scrollToId);
        }
        result = false;
      }
      if (!validByInvType[set.invType]()) {
        result = false;
      }
      return result;
    };

    var subscriptionStockService;

    var render = function () {
      setRiskInfo();
      setRiskDetailInfo();
      setInvestingMethods();
      setEvent();
    };

    var setData = function () {
      subscriptionStockService = service.subscriptionStockService;
      set.isLoading = true;
      render();
      tool.disableAllInput();
      if (set.trustNo) {
        subscriptionStockService
          .fetchInit(set.trustNo)
          .then(function () {
            set.isLoading = false;
            render();
          })
          .catch(function () {
            set.isLoading = false;
            render();
            tool.disableAllInput();
            tool.removeEvent();
          })
          .always(function () {
            yuantaApp.pageContentResizeCustom();
            yuantaApp.gettransarr();
          });
      } else {
        set.isLoading = false;
        tool.disableAllInput();
      }
    };

    //股票委託單傳輸(首段)
    var submitOrderOverseasStocks = function (params) {
      yuantaApp.goFunctionPage(
        jq('#funcPageContent').data('pageid'),
        '01',
        '',
        function () {
          subscriptionStockService
            .fetchOrderOverseasStocks(params)
            .then(function () {
              subscriptionStockService.openSubscriptionStockPopup();
            })
            .catch(function () {
              yuantaApp.goFunctionPage(jq('#funcPageContent').data('pageid'), '', '', function () {}, { start: false, end: false });
            });
        },
        { start: false, end: false }
      );
    };

    var setEvent = function () {
      var $selector = jq(set.selector);
      var $submit = $selector.find('#submit');

      //委託期間
      var getOrderPeriod = function (period) {
        switch (period) {
          case 'oneDayPeriod':
            return '0';
          case 'longPeriod':
            return '1';
          default:
            return '';
        }
      };

      $submit.off().on('click', function (e) {
        e.stopPropagation();
        if ($submit.parent().hasClass('invalid')) {
          return;
        }
        if (!handleFormValid()) {
          return;
        }

        var stockData = subscriptionStockService.getStockData();
        /* 申購資料 workCode=orderOverseasStocks
         * @param
         * {
         *   transNature: "交易性質  01:新單 04:刪除",
         *   branchCode: "分行代號",
         *   stockExchangeCode: "交易所代號",
         *   trustNo: "商品代號",
         *   commQuantity: "委託數量",
         *   commPrice: "委託價格",
         *   orderType: "委託方式 2: LMT(限價單LiMiT order)",
         *   orderPeriod: "委託期間 0:當日有效單(Day order) 1: GTC(長效單Good Till Cancelled order)",
         *   transType: "買賣記號 B:買 S:賣",
         *   orderPlacementMethod: "下單方式  3:網路",
         *   idCardNumber: "身份證ID",
         *   trustAcc: "信託帳號",
         *   buType: "DBU/OBU D:境內分行 O:境外分行"
         *   trustBuzType: "信託業務別 Y:外幣 N:台幣",
         *   custBranchCode: "客戶分行代號 9999",
         *   depWithdrawalBankCode: "入扣款銀行代號",
         *   depWithdrawalAccount: "入扣款帳號",
         *   custRiskProfile: "客戶風險屬性",
         *   productRiskProfile: "客戶最新風險等級",
         *   execCode: "執行型態碼 CK:檢核 BL:交易(買需圈存)",
         *   entrustExprDate: "委託有效截止日期 YYYYMMDD (長效單截止日)"
         *   refAgentCode: "轉介人員代號",
         *   custEDUBackground: "客戶學歷",
         *   seriousIllenss: "重大傷病 Y:重大傷病 N:非重大傷病",
         *   kycValustionDate: "KYC評估日期 YYYYMMDD",
         *   custCommissionProjCode: "客戶手續費專案代碼",
         *   currency: "商品交割幣別"
         * }
         */
        set.subscriptionStockData = {
          transNature: '01',
          branchCode: subscriptionStockService.getBranchCode(),
          stockExchangeCode: stockData.tradeCode,
          trustNo: stockData.trustNo,
          commQuantity: set.buyStock,
          commPrice: set.buyAmount,
          orderType: '2',
          orderPeriod: getOrderPeriod(set.period),
          transType: 'B',
          orderPlacementMethod: '3',
          idCardNumber: HeaderObject.GetIDNo(),
          trustAcc: subscriptionStockService.getTrustAccount(),
          buType: !subscriptionStockService.isOBU() ? 'D' : 'O',
          trustBuzType: 'Y',
          custBranchCode: '9999',
          depWithdrawalBankCode: '806',
          depWithdrawalAccount: set.account,
          custRiskProfile: subscriptionStockService.getKYCLevel(),
          productRiskProfile: stockData.risk,
          custID: HeaderObject.GetIDNo(),
          custLatestRiskRating: subscriptionStockService.getKYCLevel(),
          entrustExprDate: getOrderPeriod(set.period) === '1' ? set.longPeriodDate.replace('/', '').replace('/', '') : '',
          refAgentCode: set.recommenderValue,
          custEDUBackground: subscriptionStockService.getKYCEducationLevel(),
          seriousIllenss: subscriptionStockService.getKYCInstroDept(),
          kycValustionDate: subscriptionStockService.getKYCLastKYCDate().replace('/', '').replace('/', ''),
          custCommissionProjCode: subscriptionStockService.getFeeCode(),
          currency: stockData.currency
        };

        var commPrice = set.subscriptionStockData.commPrice; //委託金額
        var commQuantity = set.subscriptionStockData.commQuantity; //委託數量
        var rate = subscriptionStockService.getRate(); //匯率
        var buyAmount = +commPrice * +commQuantity; //交易金額
        var buyAmountTWD = +commPrice * +commQuantity * +rate; //交易金額換算台幣

        var isMoreThanSixMillion = function (cb) {
          if (buyAmountTWD >= 6000000) {
            yuantaApp.newBlock
              ._commonPopupModule()
              .set('modal', {
                showCloseBtn: true,
                showConfirmBtn: true,
                showCancelBtn: false,
                confirmAddOnClass: true,
                cancelAddOnClass: false,
                confirmText: '我知道了'
              })
              .set('modalTitle', '交易提醒')
              .set('modalContent', '單筆買進委託金額不得超過等值新臺幣6,000,000元，請客戶拆單分次買進。')
              .appendTo()
              .build()
              .open();
          } else {
            if (cb && jq.isFunction(cb)) {
              cb();
            }
          }
        };

        if (buyAmount < +stockData.minBuyTrustdep) {
          yuantaApp.newBlock
            ._commonPopupModule()
            .set('modal', {
              showCloseBtn: true,
              showConfirmBtn: true,
              showCancelBtn: false,
              confirmAddOnClass: true,
              cancelAddOnClass: false,
              confirmText: '我知道了'
            })
            .set('modalTitle', '交易提醒')
            .set('modalContent', '本檔股票最少交易金額為' + stockData.currency + ' ' + stockData.minBuyTrustdep + '<br/>(委託股數*委託價格)')
            .appendTo()
            .build()
            .open();
          return;
        } else if (
          subscriptionStockService.isOneTimeStock(set.invType) &&
          (subscriptionStockService.getFundBuyBusinessdate() == '1' || subscriptionStockService.getFundBuyBusinessdate() == '2') &&
          set.subscriptionStockData.depWithdrawalAccount &&
          subscriptionStockService.isInsufficientBalance(set.subscriptionStockData, set.invCcy)
        ) {
          //營業日09:10-21:00(可換匯)
          isMoreThanSixMillion(function () {
            var modalOption = {
              showCloseBtn: true,
              showConfirmBtn: true,
              showCancelBtn: true,
              confirmAddOnClass: false,
              TransactionConfirmationByOneTimePopup: true,
              confirmText: '修改金額',
              cancelText: '去換匯'
            };
            var modalContent =
              '<div class="remind_content">\
                    <p>申購金額大於您的外幣帳戶餘額，請先換匯後再繼續。\
                      <span class="c_org">申購境外股票/ETF線上換匯可享美元優惠唷！</span>\
                    </p>\
                </div>';

            yuantaApp.newBlock
              ._commonPopupModule()
              .set('modal', modalOption)
              .set('modalTitle', '外幣餘額不足，先進行換匯')
              .set('modalContent', modalContent)
              .event('popupConfirm', function () {
                setTimeout(function () {
                  jq('#debitAmount').focus().click();
                }, 0);
              })
              .event('popupCancel', function () {
                if (
                  yuantaApp.checkLogin('_A0303', function () {
                    location.replace('#');
                  })
                ) {
                  yuantaApp.loadpage('_A0303_01');
                }
              })
              .appendTo()
              .build()
              .open();
          });
          return;
        } else if (
          subscriptionStockService.isOneTimeStock(set.invType) &&
          subscriptionStockService.getFundBuyBusinessdate() == '0' &&
          set.subscriptionStockData.depWithdrawalAccount &&
          subscriptionStockService.isInsufficientBalance(set.subscriptionStockData, set.invCcy)
        ) {
          //營業日21:01-09:09&非營業日(不可換匯)
          isMoreThanSixMillion(function () {
            var modalOption = {
              showCloseBtn: true,
              showConfirmBtn: true,
              showCancelBtn: false,
              confirmAddOnClass: true,
              cancelAddOnClass: false,
              confirmText: '我知道了'
            };
            var modalContent =
              '<div class="remind_content">\
                  <p>申購金額大於您的外幣帳戶餘額，請先換匯後再繼續申購境外股票/ETF。</p>\
              </div>';

            yuantaApp.newBlock
              ._commonPopupModule()
              .set('modal', modalOption)
              .set('modalTitle', '很抱歉您的外幣餘額不足，無法進行圈存下單')
              .set('modalContent', modalContent)
              .event('popupConfirm', function () {
                setTimeout(function () {
                  jq('#debitStock').val('');
                  jq('#debitAmount').val('');
                  jq('#debitAmount').focus().click();
                }, 0);
              })
              .appendTo()
              .build()
              .open();
          });
          return;
        } else if (buyAmountTWD >= 6000000) {
          yuantaApp.newBlock
            ._commonPopupModule()
            .set('modal', {
              showCloseBtn: true,
              showConfirmBtn: true,
              showCancelBtn: false,
              confirmAddOnClass: true,
              cancelAddOnClass: false,
              confirmText: '我知道了'
            })
            .set('modalTitle', '交易提醒')
            .set('modalContent', '單筆買進委託金額不得超過等值新臺幣6,000,000元，請客戶拆單分次買進。')
            .appendTo()
            .build()
            .open();
          return;
        } else {
          submitOrderOverseasStocks(set.subscriptionStockData);
        }
      });
    };

    var set = {
      selector: '',
      trustNo: '',
      invType: '', //投資方式
      invCcy: '', //投資幣別
      account: '', //扣款帳號
      buyStock: '', //委託股數
      buyAmount: '', //委託價格
      period: '', //訂單有效期間(單筆申購)
      longPeriodDate: '', //長效單委託迄日
      recommenderValue: 'B000000000', //介紹人編號
      isLoading: true,
      subscriptionStockData: {
        transNature: '',
        orderFormDate: '',
        branchCode: '',
        stockExchangeCode: '',
        trustNo: '',
        commQuantity: '',
        commPrice: '',
        orderType: '',
        orderPeriod: '',
        transType: '',
        orderPlacementMethod: '',
        idCardNumber: '',
        trustAcc: '',
        buType: '',
        trustBuzType: '',
        custBranchCode: '',
        depWithdrawalBankCode: '',
        depWithdrawalAccount: '',
        custRiskProfile: '',
        productRiskProfile: '',
        custID: '',
        custLatestRiskRating: '',
        entrustExprDate: '',
        refAgentCode: '',
        custEDUBackground: '',
        seriousIllenss: '',
        kycValustionDate: '',
        custCommissionProjCode: '',
        currency: ''
      }
    };
    var service = {
      subscriptionStockService: null
    };
    var event = {};

    var interface = {};
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      service: function (name, value) {
        service[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $popup.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //風險等級
  StockSubscriptionComponent.prototype.RiskInfo = function () {
    var html =
      '<div class="twoSet">\
          <p>您的風險等級：<span id="rickLevel" class="key_blue">--</span></p>\
          <div id="rickLevelBtn"><a href="javascript:void(0)" class="btn_blueRouded_2">我要變更</a></div>\
      </div>\
      <div id="riskLevelDetailOneToFour">適合投資風險等級為 <span id="riskLevelDetailText" class="key_blue"></span> 之商品</div>\
      <div id="riskLevelDetailFive" class="none">適合投資風險等級為 <span class="key_blue">適合投資本行上架之所有理財商品</span></div>';
    var $html = jq(html);

    var $rickLevel, $riskLevelDetailText, $rickLevelBtn, $riskLevelDetailOneToFour, $riskLevelDetailFive;
    var rickLevelList = ['riskLevelOne', 'riskLevelTwo', 'riskLevelThree', 'riskLevelFour', 'riskLevelFive'];
    var riskLevelDetailList = ['riskLevelDetailOne', 'riskLevelDetailTwo', 'riskLevelDetailThree', 'riskLevelDetailFour', 'riskLevelDetailFive'];

    var setData = function () {
      $rickLevel = $html.find('#rickLevel'); //您的風險等級(型)
      $riskLevelDetailText = $html.find('#riskLevelDetailText'); //適合投資風險等級
      $riskLevelDetailOneToFour = $html.find('#riskLevelDetailOneToFour'); //4以下風險等級id
      $riskLevelDetailFive = $html.find('#riskLevelDetailFive'); //5風險等級id
      $rickLevelBtn = $html.find('#rickLevelBtn'); //我要變更
      if (set.data && set.data.fundCustAndKycInfo) {
        $rickLevelBtn.removeClass('none');
        var riskLevel = +set.data.fundCustAndKycInfo.custKyc;
        if (riskLevel == '5') {
          $riskLevelDetailOneToFour.addClass('none');
          $riskLevelDetailFive.removeClass('none');
        } else {
          $riskLevelDetailOneToFour.removeClass('none');
          $riskLevelDetailFive.addClass('none');
        }
        if (rickLevelList[riskLevel - 1]) {
          $rickLevel.addClass('txt').attr('data-txt', rickLevelList[riskLevel - 1]);
          $riskLevelDetailText.addClass('txt').attr('data-txt', riskLevelDetailList[riskLevel - 1]);
        }
      } else {
        $rickLevel.text('--');
        $riskLevelDetailText.text('--');
        $rickLevelBtn.addClass('none');
      }
      yuantaApp.gettransarr();
      setEvent();
    };

    var setEvent = function () {
      $rickLevelBtn = $html.find('#rickLevelBtn');
      $rickLevelBtn.off().on('click', function () {
        event.clickRickLevel();
      });
    };

    var set = {
      data: null
    };

    var event = {
      clickRickLevel: function () {}
    };

    var interface = {};
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        $html.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //小卡
  StockSubscriptionComponent.prototype.RiskDetailInfo = function () {
    var html =
      '<div class="detail_box">\
          <div class="con">\
              <section>\
                  <div class="heading">--</div>\
              </section>\
          </div>\
          <div class="con bot">\
              <section class="risk_info detail_info">\
                  <div class="info stock_info">\
                      <div>股票代號</div>\
                      <div id="stockTrustNo" class="key_gray">--</div>\
                  </div>\
                  <div class="info stock_info">\
                      <div>投資市場</div>\
                      <div id="marketArea" class="key_blue">--</div>\
                  </div>\
              </section>\
          </div>\
      </div>';
    var $html = jq(html);

    var switchMarketArea = function (marketArea) {
      switch (marketArea) {
        case 'US':
          return '美股';
        case 'HK':
          return '港股';
        case 'HS':
          return '滬股';
        default:
          return '';
      }
    };

    var handleHeadText = function () {
      var $selector = jq(set.selector);
      var stockData = set.data.stockData;
      var bondDesc = stockData.bondDesc || '';
      //股票title
      $selector.find('.heading').text(This.commonService.ToASCIIAndUpper('(' + stockData.tradeCommCode + ') ' + stockData.chtShortName + ' ' + bondDesc));
      //股票代號
      $selector.find('#stockTrustNo').text(This.commonService.ToASCIIAndUpper(stockData.trustNo));
      //投資市場
      $selector.find('#marketArea').text(This.commonService.ToASCIIAndUpper(switchMarketArea(stockData.marketArea)));
    };

    var setData = function () {
      if (set.data) {
        var data = set.data;
        if (data && data.stockData) {
          handleHeadText();
        }
      }
      setEvent();
    };

    var setEvent = function () {};
    var set = {
      selector: '',
      data: null
    };

    var event = {};
    var interface = {};
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $html.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //投資方式
  StockSubscriptionComponent.prototype.InvestingMethods = function () {
    var html =
      '<div class="title_blk_2 tB">投資方式</div>\
        <div class="option_box">\
          <label><input type="radio" name="way" value="1" data-type="oneTime"><span>單筆申購</span></label>\
        </div>';

    var $html = jq(html);

    var handelInvestingMethodsShow = function () {
      var $selector = jq(set.selector);
      var $radio = $selector.find('input');
      var invType = '1'; //目前只有單筆申購

      //單筆申購
      if (invType && invType == '1') {
        jq.each($radio, function (index, elm) {
          var $this = jq(elm);
          var val = $this.val();
          if (val == invType) {
            set.invType = invType;
            $this.attr('disabled', false);
          } else {
            $this.attr('disabled', true);
            $this.siblings('span').addClass('disabled');
          }
        });
      }
    };

    var defaultClick = function () {
      var $selector = jq(set.selector);
      var $radio = $selector.find('input');
      jq.each($radio, function (index, elm) {
        var $this = jq(elm);
        var val = $this.val();
        if (val == set.invType) {
          $this.click();
        }
      });
    };

    var setData = function () {
      var $selector = jq(set.selector);
      var $radio = $selector.find('input');
      var disableInput = false;

      if (!set.invType || !set.stockData) {
        disableInput = true;
      } else {
        disableInput = false;
      }
      jq.each($radio, function (index, elm) {
        var $this = jq(elm);
        $this.attr('disabled', disableInput);
        $this.prop('disabled', disableInput);
      });

      $radio.off().on('click', function () {
        var $this = jq(this);
        var value = $this.val();
        var type = $this.data('type');
        event.change({ value: value, type: type });
        var functype = '';
        switch (value) {
          case '1':
            functype = 'a';
            break;
        }
        if (!set.isLoading) {
          yuantaApp.goFunctionPage(
            jq('#funcPageContent').data('pageid'),
            '',
            functype,
            function () {
              if (window.location && window.location.hash && window.location.hash == '#announce_popup_mini') {
                location.replace('#');
              }
            },
            { start: false, end: false }
          );
        }
      });
      handelInvestingMethodsShow();
      defaultClick();
      setEvent();
    };

    var setEvent = function () {};
    var set = {
      selector: '',
      invType: '',
      stockData: '',
      isLoading: true
    };
    var event = {
      change: function () {}
    };
    var interface = {};
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $html.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //投資幣別
  StockSubscriptionComponent.prototype.InvestmentCurrency = function () {
    var html =
      '<div class="title_blk_2 tB">投資幣別</div>\
        <div id="optionBox" class="option_box"></div>\
        <div id="investmentCurrencyWarnMessage" class="addition none"></div>';
    var $html = jq(html);

    var disableInput = function () {
      var $selector = jq('#funcPageContent');
      var $agree01 = $selector.find('.iAgree');
      var $inputBox = $selector.find('.input_box');
      var $supplement = $selector.find('.supplement');
      $agree01.addClass('none');
      $supplement.addClass('none');
      $inputBox.addClass('unit');
      $inputBox.addClass('disabled');
    };
    var unDisableInput = function () {
      var $selector = jq('#funcPageContent');
      var $agree01 = $selector.find('.iAgree');
      var $inputBox = $selector.find('.input_box');
      var $supplement = $selector.find('.supplement');
      $agree01.removeClass('none');
      $supplement.removeClass('none');
      $inputBox.removeClass('unit');
      $inputBox.removeClass('disabled');
    };

    //將股票幣別存入currencyList
    var renderCurrencyOption = function (currency) {
      if (set.currencyList.indexOf(currency) <= -1) {
        set.currencyList.push(currency);
      }

      var optionElm = '';
      for (var i = 0; (c = set.currencyList[i]); i++) {
        optionElm += '<label><input type="radio" name="currency" value="' + c + '" /><span class="txt" data-txt="' + c + '"></span></label>';
      }
      jq(set.selector).find('#optionBox').append(optionElm);
      regRadio();
    };

    //產生幣別radio
    var regRadio = function () {
      var $radio = jq(set.selector).find('#optionBox').find('input');
      $radio.off().on('click', function () {
        unDisableInput();
        service.setDisableInput(false);
        var $this = jq(this);
        var value = $this.val();
        set.investmentCurrencyWarnMessage = '';

        var modalOption = {
          showCloseBtn: false,
          showConfirmBtn: true,
          showCancelBtn: false,
          confirmAddOnClass: true,
          cancelAddOnClass: false,
          confirmText: '我知道了'
        };

        if (service.hasFceAccountAndFceAcctList(value)) {
          set.investmentCurrencyWarnMessage =
            '<p class="key_org">您的外幣帳戶尚未持有\
              <span class="txt" data-txt="' +
            value.toLocaleUpperCase() +
            '"></span>，請先進行\
              <a id="jumpToExchange" href="javascript:void(0)">外幣換匯</a>\
            </p>';
          service.setDisableInput(true);
        } else if (service.hasFceAccountAndNotFceAcctList(value)) {
          This.commonService.closeCommonPopup();
          var modalOption = {
            showCloseBtn: false,
            showConfirmBtn: true,
            showCancelBtn: true,
            confirmAddOnClass: false,
            cancelAddOnClass: true,
            confirmText: '關閉',
            cancelText: '去開戶'
          };
          yuantaApp.newBlock
            ._commonPopupModule()
            .set('modal', modalOption)
            .set('modalTitle', '請先開立外幣帳戶')
            .set(
              'modalContent',
              '您尚無本行外幣存款帳戶，請先至線上申辦平台開戶。如您已持有本行外幣存款帳戶，請至個人網銀設定本人帳戶間互轉或約定帳號轉出功能。'
            )
            .event('popupConfirm', function () {
              yuantaApp.loadpage('grid');
            })
            .event('popupCancel', function () {
              stockSubscriptionModule.commonService.OpenURL('https://ebank.yuantabank.com.tw/ecntr/tx/openacct?p=c_yacct');
            })
            .appendTo()
            .build()
            .open();
          service.setDisableInput(true);
        }
        handleInvestmentCurrencyWarnMessage();
        event.change(value, set.currencyList);
      });

      //預設按鈕
      jq.each($radio, function (index, elm) {
        var $this = jq(elm);
        var value = $this.val();

        if (set.currency == value) {
          $this.prop('checked', true);
          $this.click();
        }
      });
    };

    //錯誤訊息
    var handleInvestmentCurrencyWarnMessage = function () {
      var $selector = jq(set.selector);
      var $investmentCurrencyWarnMessage = $selector.find('#investmentCurrencyWarnMessage');
      $investmentCurrencyWarnMessage.html('').addClass('none');

      if (set.investmentCurrencyWarnMessage) {
        set.data.investmentCurrencyWarnMessage = '';
        $investmentCurrencyWarnMessage.html(set.investmentCurrencyWarnMessage);
        $investmentCurrencyWarnMessage.removeClass('none');
      }
      if (set.data && set.data.investmentCurrencyWarnMessage) {
        $investmentCurrencyWarnMessage.html(set.data.investmentCurrencyWarnMessage);
        $investmentCurrencyWarnMessage.removeClass('none');
      }
      setEvent();
      yuantaApp.gettransarr();
    };

    var setData = function () {
      handleInvestmentCurrencyWarnMessage();
      renderCurrencyOption(set.currency);
      setEvent();
      yuantaApp.gettransarr();
    };
    var setEvent = function () {
      var $selector = jq(set.selector);
      var $openYuantaWebBank = $selector.find('#openYuantaWebBank');
      var $jumpToExchange = $selector.find('#jumpToExchange');
      $openYuantaWebBank.off().on('click', function () {
        This.commonService.OpenURL('https://ebank.yuantabank.com.tw/ib/');
      });
      $jumpToExchange.off().on('click', function () {
        if (
          yuantaApp.checkLogin('_A0303', function () {
            location.replace('#');
          })
        ) {
          yuantaApp.loadpage('_A0303_01');
        }
      });
    };
    var set = {
      selector: '',
      data: null,
      currency: null,
      isLoading: false,
      investmentCurrencyWarnMessage: '',
      currencyList: []
    };
    var event = {
      change: function () {}
    };
    var service = {
      disableAllInput: function () {},
      hasFceAccountAndFceAcctList: function () {},
      hasFceAccountAndNotFceAcctList: function () {},
      setDisableInput: function () {}
    };
    var interface = {};
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      service: function (name, value) {
        service[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $html.appendTo(set.selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //預設帳號、選擇帳號、餘額
  StockSubscriptionComponent.prototype.DebitAccount = function () {
    var html =
      '<div class="title_blk_2 tB">扣款帳號</div>\
        <div class="iAgree">\
            <input type="checkbox" id="settingDebitAccount" />\
            <label for="settingDebitAccount"><span></span>設定為預設扣款帳號</label>\
        </div>\
        <div class="input_box" style="height: 48px;">\
            <div class="account_show">請選擇扣款帳戶<a href="javascript:void(0)"></a>\
            </div>\
        </div>\
        <p class="supplement c_lake"><span id="lcyBalanceCurrency"></span><span id="lcyBalance" class="f_ty1" style="margin-left: 5px"></span></p>';
    var $html = jq(html);
    var lcyBalanceCurrency = '可用餘額';

    var disableInput = function () {
      var $selector = jq(set.selector);
      var $input = $selector.find('input');
      var $inputBox = $selector.find('.input_box');
      var $iAgree = $selector.find('.iAgree');

      $input.prop('checked', false).attr('disabled', true).val('');
      $input.siblings('span').addClass('disabled');
      $inputBox.addClass('disabled');
      $iAgree.removeClass('none');
    };

    var unDisableInput = function () {
      var $selector = jq(set.selector);
      var $input = $selector.find('input');
      var $inputBox = $selector.find('.input_box');
      var $iAgree = $selector.find('.iAgree');

      $input.siblings('span').removeClass('disabled');
      $inputBox.removeClass('disabled');
      $iAgree.removeClass('none');
    };

    var changeAccount = function (account) {
      var $accountShow = $html.find('.account_show');
      var $lcyBalance = $html.find('#lcyBalance');
      var $lcyBalanceCurrency = $html.find('#lcyBalanceCurrency');
      $accountShow.text(account.branchName + '-' + account.acctNo + ' ' + account.ccy);
      $lcyBalance.text(yuantaApp.newBlock._currencyToAmt(account.lcyBalance, account.ccy));
      $lcyBalanceCurrency.text(lcyBalanceCurrency + ' ' + account.ccy);
      set.currentAccount = account;
      set.currentAccount.type = 'account';
      event.changeAccount(set.currentAccount);
    };

    var setData = function () {
      if (set.currey && set.accountList && set.accountList.length > 0) {
        var account = set.accountList.filter(function (data) {
          return data.ccy == set.currey;
        });
        if (account && account.length > 0) {
          service.setDisableInput(false);
          if (set.cacheDebitAccount) {
            var data;
            for (var i = 0; (a = account[i]); i++) {
              if (a.acctNo == set.cacheDebitAccount) {
                data = a;
                break;
              }
            }
            if (data) {
              set.hasDebitAccount = true;
              changeAccount(data);
            } else {
              changeAccount(account[0]);
            }
          } else {
            changeAccount(account[0]);
          }
        } else {
          service.setDisableInput(true);
          event.changeAccountFail();
        }
      } else {
        service.setDisableInput(true);
        event.changeAccountFail();
        disableInput();
      }
      setEvent();
      if (service.getDisableInput()) {
        disableInput();
      } else {
        unDisableInput();
      }
    };

    var setEvent = function () {
      var $selector = jq(set.selector);
      var $inputBox = $selector.find('.input_box');
      var $settingDebitAccount = $selector.find('#settingDebitAccount');

      $inputBox.off().on('click', function () {
        var $this = jq(this);
        if ($this.hasClass('disabled')) {
          return;
        }
        var accountList = [];
        for (var i = 0; (account = set.accountList[i]); i++) {
          if (set.currey == account.ccy) {
            account.on = account.acctNo == set.currentAccount.acctNo && account.ccy == set.currentAccount.ccy;
            account.value = account.branchName + '-' + account.acctNo + ' ' + account.ccy;
            accountList.push(account);
          }
        }
        yuantaApp.popupNewMenuList('請選擇扣款帳戶', accountList, null, null, function (data) {
          for (var i = 0; (account = set.accountList[i]); i++) {
            if (account.acctNo == data.acctNo && account.ccy == data.ccy) {
              if (data.acctNo == set.cacheDebitAccount) {
                $settingDebitAccount.prop('checked', true);
                event.settingDebitAccount(true);
              } else {
                $settingDebitAccount.prop('checked', false);
                event.settingDebitAccount(false);
              }
              changeAccount(data);
              break;
            }
          }
        });
      });

      $settingDebitAccount.off().on('click', function () {
        var $this = jq(this);
        var isChecked = $this.prop('checked');
        event.settingDebitAccount(isChecked);
      });
      if (set.hasDebitAccount) {
        $settingDebitAccount.click();
      }
    };

    var set = {
      selector: '',
      currey: '',
      accountList: [],
      currentAccount: null,
      cacheDebitAccount: '',
      hasDebitAccount: false
    };

    var service = {
      setDisableInput: function () {},
      getDisableInput: function () {}
    };

    var event = {
      changeAccount: function () {},
      settingDebitAccount: function () {},
      changeAccountFail: function () {}
    };
    var interface = {};
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      service: function (name, value) {
        service[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $html.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };

    return buildInterface;
  };

  //委託股數
  StockSubscriptionComponent.prototype.DebitStockByInvestingMethods = function () {
    var htmlStrategy = {
      1: function () {
        return '<div class="title_blk_2 tB">委託股數</div>\
                  <div class="input_box input_box_flex">\
                      <input id="debitStock" type="text" autocomplete="off" spellcheck="false" placeholder="請輸入投資股數"/>\
                      <span id="debitStockNumber">股</span>\
                  </div>\
                  <p id="warnStockMessage" class="supplement c_org none"></p>\
                  <p id="lessStockNumber" class="supplement" style="text-align: right;"></p>\
                  <p id="warnStockMessageSecond" class="supplement none"></p>';
      }
    };
    var html, $html;

    var disableInput = function () {
      var $selector = jq(set.selector);
      var $input = $selector.find('input');
      var $inputBox = $selector.find('.input_box');

      $inputBox.addClass('disabled');
      $input.prop('checked', false).attr('disabled', true).val('');
      $input.siblings('span').addClass('disabled');
    };

    var unDisableInput = function () {
      var $selector = jq(set.selector);
      var $input = $selector.find('input');
      var $inputBox = $selector.find('.input_box');

      $inputBox.removeClass('disabled');
      $input.prop('checked', false).attr('disabled', false);
      $input.siblings('span').removeClass('disabled');
    };

    var checkHtmlStrategy = function (investingMethods) {
      return htmlStrategy.hasOwnProperty(investingMethods);
    };

    var handleValid = function (value) {
      var stockData = set.data.stockData;
      var $debitAmount = jq('#debitAmount');

      if (!stockSubscriptionModule.validateRules.require.func(value)) {
        set.inputValid = false;
        set.inputValidMessage = '尚未填寫委託股數';
      } else if (!value.match(stockSubscriptionModule.validateRules.positiveinteger.regex)) {
        set.inputValid = false;
        set.inputValidMessage = '委託股數僅可輸入整數數字';
      } else if (value < +stockData.minBuyAmount) {
        set.inputValid = false;
        set.inputValidMessage = '最少交易股數為' + stockData.minBuyAmount + '股';
      } else if (String((value - +stockData.minBuyAmount) / +stockData.minBuySumAmount).indexOf('.') !== -1) {
        set.inputValid = false;
        set.inputValidMessage = '累加股數單位為' + stockData.minBuySumAmount + '股';
      } else if (value === 0) {
        set.inputValid = false;
        set.inputValidMessage = '委託股數不可為0';
      } else {
        if ($debitAmount.val()) {
          $debitAmount.trigger('change');
        }
        set.inputValid = true;
        set.inputValidMessage = '';
      }
      handleWarnMessage(set.inputValid, set.inputValidMessage);
    };

    var handleWarnMessage = function (inputValid, inputValidMessage) {
      var $selector = jq(set.selector);
      var $inputBox = $selector.find('.input_box');
      var $warnMessage = $selector.find('#warnStockMessage');
      var $warnMessageSecond = $selector.find('#warnStockMessageSecond');

      if (inputValid && inputValidMessage) {
        $warnMessage.addClass('none');
        $inputBox.removeClass('warn');
        $warnMessage.text('');
        $warnMessageSecond.removeClass('none').html(inputValidMessage);
      } else if (inputValid) {
        $warnMessage.addClass('none');
        $inputBox.removeClass('warn');
        $warnMessage.text('');
        $warnMessageSecond.addClass('none');
      } else {
        $warnMessage.removeClass('none');
        $warnMessage.text(inputValidMessage);
        $inputBox.addClass('warn');
      }
    };

    var handleKeyBoardType = function () {
      var $selector = jq(set.selector);
      $selector.find('#debitStock').attr('type', 'tel');
    };

    var setData = function () {
      var $selector = jq(set.selector);
      var $lessStockNumber = $selector.find('#lessStockNumber');
      var stockData = set.data.stockData;

      if (set.data && set.data.stockData) {
        $lessStockNumber.html('最少請輸入' + stockData.minBuyAmount + '股');
        handleKeyBoardType();
        setEvent();
      }
      if (service.getDisableInput()) {
        disableInput();
      } else {
        unDisableInput();
      }
    };

    var setEvent = function () {
      var $selector = jq(set.selector);
      var $input = $selector.find('#debitStock');
      $input.off().on('change input', function (e) {
        e.stopPropagation();
        var $this = jq(this);
        var value = $this.val();
        if (!value) {
          handleValid(value);
          event.inputChange({ value: value, inputValid: set.inputValid });
          return;
        }
        handleValid(value);
        event.inputChange({ value: value, inputValid: set.inputValid });
      });
    };

    var set = {
      selector: '',
      investingMethods: '',
      data: null,
      inputValid: true,
      inputValidMessage: ''
    };

    var event = {
      inputChange: function () {}
    };

    var service = {
      setDisableInput: function () {},
      getDisableInput: function () {}
    };

    var interface = {
      valid: function () {
        var $selector = jq(set.selector);
        var $input = $selector.find('#debitStock');
        var value = $input.val();
        handleValid(value);
        return set.inputValid;
      }
    };
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      service: function (name, value) {
        service[name] = value;
        return buildInterface;
      },
      appendTo: function (selector, investingMethods) {
        set.selector = selector;
        set.investingMethods = investingMethods;
        if (checkHtmlStrategy(investingMethods)) {
          html = htmlStrategy[set.investingMethods]();
          $html = jq(html);
          jq(html).appendTo(selector);
        }
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //委託價格
  StockSubscriptionComponent.prototype.DebitAmountByInvestingMethods = function () {
    var htmlStrategy = {
      1: function () {
        return '<div class="title_blk_2 tB">委託價格<a href="javascript:void(0)" class="direction_2"></a></div>\
                  <div class="input_box input_box_flex">\
                    <input id="debitAmount" type="text" autocomplete="off" spellcheck="false" placeholder="請輸入委託價格"/>\
                    <span id="debitAmountCountry"></span>\
                  </div>\
                  <p id="warnMessage" class="supplement c_org none"></p>\
                  <p id="referencePrice" class="supplement" style="color: #005bac;"></p>\
                  <div class="redeemPrice">\
                    <span id="redeemLink" class="redeem_link">價格走勢</span>\
                    <span class="key_red">(落後15分鐘)</span>\
                  </div>\
                  <p id="warnMessageSecond" class="supplement none"></p>';
      }
    };
    var html, $html;

    var disableInput = function () {
      var $selector = jq(set.selector);
      var $input = $selector.find('input');
      var $inputBox = $selector.find('.input_box');
      var $redeemLink = $selector.find('#redeemLink');

      $inputBox.addClass('disabled');
      $input.prop('checked', false).attr('disabled', true).val('');
      $input.siblings('span').addClass('disabled');
      $redeemLink.addClass('disabled');
    };

    var unDisableInput = function () {
      var $selector = jq(set.selector);
      var $input = $selector.find('input');
      var $inputBox = $selector.find('.input_box');
      var $redeemLink = $selector.find('#redeemLink');

      $inputBox.removeClass('disabled');
      $input.prop('checked', false).attr('disabled', false);
      $input.siblings('span').removeClass('disabled');
      $redeemLink.removeClass('disabled');
    };

    var checkHtmlStrategy = function (investingMethods) {
      return htmlStrategy.hasOwnProperty(investingMethods);
    };

    var setDebitAmountCountry = function () {
      var $selector = jq(set.selector);
      var $debitAmountCountry = $selector.find('#debitAmountCountry');
      var currentAccount = set.currentAccount;
      var currency = currentAccount.ccy;
      $debitAmountCountry.empty();
      $debitAmountCountry.html(currency);
    };

    var handleReferencePriceText = function () {
      var $selector = jq(set.selector);
      var $referencePrice = $selector.find('#referencePrice');
      if (set.data.stockData && set.currentAccount) {
        var stockData = set.data.stockData;
        $referencePrice.empty();
        switch (set.investingMethods) {
          case '1':
            $referencePrice.html('參考盤價 ' + stockData.redeemPrice + ' (' + stockData.priceRefDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3') + ')');
            break;
        }
      }
    };

    var handleValid = function (value) {
      var currentAccount = set.currentAccount;
      var lcyBalance = currentAccount.lcyBalance; //帳戶餘額
      var investingMethods = set.investingMethods;
      var stock = jq('#debitStock').val() || 0; //委託股數
      var buyAmount = value * stock; //委託股數*委託價格

      switch (investingMethods) {
        case '1':
          if (!stockSubscriptionModule.validateRules.require.func(value)) {
            set.inputValid = false;
            set.inputValidMessage = '尚未填寫委託價格';
          } else if (!value.match(stockSubscriptionModule.validateRules.positivefloat.regex)) {
            set.inputValid = false;
            set.inputValidMessage = '委託價格僅可輸入數字';
          } else if (!value.match(stockSubscriptionModule.validateRules.decimalsTwo.regex)) {
            set.inputValid = false;
            set.inputValidMessage = '輸入金額格式錯誤，委託價格最多小數點後2位';
          } else if ((set.isFundBuyBusinessdate == '1' || set.isFundBuyBusinessdate == '2') && stock && lcyBalance * 1 < buyAmount * 1) {
            set.inputValid = true;
            set.inputValidMessage =
              "<span class='key_blue'>提醒您！您的外幣可用餘額不足，請於下一步驟先進行換匯，方可繼續申購！<br/><span class='c_org'>申購境外股票/ETF線上換匯可享美元優惠唷！</span></span>";
          } else if (set.isFundBuyBusinessdate == '0' && stock && lcyBalance * 1 < buyAmount * 1) {
            set.inputValid = true;
            set.inputValidMessage =
              "<span class='key_blue'>提醒您！可用餘額小於您的投資金額，無法進行圈存下單。<br/><span class='c_org'>申購境外股票/ETF線上換匯可享美元優惠唷！</span></span>";
          } else {
            set.inputValid = true;
            set.inputValidMessage = '';
          }
          break;
      }
      handleWarnMessage(set.inputValid, set.inputValidMessage);
    };

    var handleWarnMessage = function (inputValid, inputValidMessage) {
      var $selector = jq(set.selector);
      var $inputBox = $selector.find('.input_box');
      var $warnMessage = $selector.find('#warnMessage');
      var $warnMessageSecond = $selector.find('#warnMessageSecond');

      if (inputValid && inputValidMessage) {
        $warnMessage.addClass('none');
        $inputBox.removeClass('warn');
        $warnMessage.html('');
        $warnMessageSecond.removeClass('none').html(inputValidMessage);
      } else if (inputValid) {
        $warnMessage.addClass('none');
        $inputBox.removeClass('warn');
        $warnMessage.html('');
        $warnMessageSecond.addClass('none');
      } else {
        $warnMessage.removeClass('none');
        $warnMessage.html(inputValidMessage);
        $inputBox.addClass('warn');
      }
    };

    var handleRedeemPrice = function (value) {
      var $selector = jq(set.selector);
      var $debitAmount = $selector.find('#debitAmount');
      var stockData = set.data.stockData;
      var redeemPrice = +stockData.redeemPrice; //參考盤價

      if (value > redeemPrice * 1.25 || value < redeemPrice * 0.75) {
        var modalOption = {
          showCloseBtn: true,
          showConfirmBtn: true,
          showCancelBtn: true,
          confirmAddOnClass: false,
          cancelAddOnClass: true,
          confirmText: '繼續執行',
          cancelText: '放棄執行'
        };
        var modalContent =
          '<div class="remind_content">\
                <p>此筆交易之委託價格已逾越市場合理範圍，委託交易送出後\
                  <span class="c_org">〝極可能〞</span>\
                  會被交易所或交易券商\
                  <span class="c_org">〝拒單〞</span>\
                  ！如仍決定繼續執行委託，委託完成後請務必於「境外股票/ETF查詢」確認委託是否成功。\
                </p>\
            </div>';

        yuantaApp.newBlock
          ._commonPopupModule()
          .set('modal', modalOption)
          .set('modalTitle', '交易提醒')
          .set('modalContent', modalContent)
          .event('popupCancel', function () {
            $debitAmount.val('');
            $debitAmount.focus().click();
          })
          .appendTo()
          .build()
          .open();
      }
    };

    var handleKeyBoardType = function () {
      var $selector = jq(set.selector);
      var $input = $selector.find('#debitAmount');
      $input.attr('type', 'number');
      $input.attr('pattern', 'number');
    };

    var setData = function () {
      if (set.data && set.data.stockData) {
        setDebitAmountCountry();
        handleKeyBoardType();
        handleReferencePriceText();
        setEvent();
      }
      if (service.getDisableInput()) {
        disableInput();
      } else {
        unDisableInput();
      }
    };

    var setEvent = function () {
      var $selector = jq(set.selector);
      var $input = $selector.find('#debitAmount');
      var $direction = $selector.find('.direction_2');
      var $redeemLink = $selector.find('#redeemLink');
      var stockData = set.data.stockData;
      var trustNo = stockData.trustNo;
      $input
        .off()
        .on('click', function (e) {
          e.stopPropagation();
          var $this = jq(this);
          var innerHeight = window.innerHeight;
          var top = jq('#debit_amount_by_investing_methods').offset().top;
          if (top > innerHeight / 2) {
            jq('#funcPageContent').animate({ scrollTop: top });
          }
          $this.focus();
        })
        .on('blur', function (e) {
          e.stopPropagation();
          var $this = jq(this);
          var value = $this.val();
          if (value) {
            handleRedeemPrice(value);
          }
        })
        .on('change input', function (e) {
          e.stopPropagation();
          var $this = jq(this);
          var value = $this.val();
          if (!value) {
            handleValid(value);
            event.inputChange({ value: value, inputValid: set.inputValid });
            return;
          }
          handleValid(value);
          event.inputChange({ value: value, inputValid: set.inputValid });
        });

      //委託價格(!)
      $direction.off().on('click', function () {
        var text =
          '<div class="remind_content"><span class="tB">境外股票及ETF(單筆買進、單筆及定期定額投資賣出)僅接受限價價格申請</span>，實際交易時，投資標的價格高於申購委託之限價價格或低於賣出委託之限價價格或因市場因素無法全部成交(例：交易量不足…等)時，則可能產生部分成交或全部不成交。</div>';
        This.DebitAmountByInvestingMethodsDirectionsPopup(text);
      });

      //價格走勢
      $redeemLink.off().on('click', function () {
        var url =
          'https://yuantabank.moneydj.com/ETFData/html/CustStockIDMap.djhtm?AspID=Yuantabank&A=' + trustNo + '&W=' + screen.width + '&H=' + screen.height;
        yuantaApp.openURL(url);
      });
    };

    var set = {
      selector: '',
      investingMethods: '',
      data: null,
      inputValid: true,
      inputValidMessage: '',
      currentAccount: '',
      isFundBuyBusinessdate: false
    };

    var event = {
      inputChange: function () {}
    };

    var service = {
      setDisableInput: function () {},
      getDisableInput: function () {}
    };

    var interface = {
      valid: function () {
        var $selector = jq(set.selector);
        var $input = $selector.find('#debitAmount');
        var value = $input.val();
        handleValid(value);
        return set.inputValid;
      }
    };
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      service: function (name, value) {
        service[name] = value;
        return buildInterface;
      },
      appendTo: function (selector, investingMethods) {
        set.selector = selector;
        set.investingMethods = investingMethods;
        if (checkHtmlStrategy(investingMethods)) {
          html = htmlStrategy[set.investingMethods]();
          $html = jq(html);
          jq(html).appendTo(selector);
        }
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //委託價格(!)
  StockSubscriptionComponent.prototype.DebitAmountByInvestingMethodsDirectionsPopup = function (popContent) {
    if (!popContent) {
      return;
    }
    var popup = yuantaApp.newBlock
      ._commonPopupModule()
      .set('modal', {
        showCloseBtn: true,
        showConfirmBtn: false,
        showCancelBtn: false,
        confirmAddOnClass: false,
        cancelAddOnClass: false
      })
      .set('modalTitle', '委託價格')
      .set('modalContent', popContent)
      .appendTo()
      .build();
    popup.open();
  };

  //訂單有效期間
  StockSubscriptionComponent.prototype.DebitPeriodByInvestingMethods = function () {
    var html = {
      1: function () {
        return '<div class="title_blk_2 tB">訂單有效期間<a href="javascript:void(0)" class="direction_2"></a></div>\
                <div class="option_box">\
                  <label><input type="radio" name="period" value="oneDayPeriod"><span>當日有效</span></label>\
                  <label><input type="radio" name="period" value="longPeriod"><span>長效單</span></label>\
                </div>';
      }
    };
    var $html = jq(html);

    var defaultClick = function () {
      var $selector = jq(set.selector);
      var $radio = $selector.find('input');
      jq.each($radio, function (index, elm) {
        var $this = jq(elm);
        var val = $this.val();
        if (val == 'oneDayPeriod') {
          $this.click();
        }
      });
    };
    var setData = function () {
      var $selector = jq(set.selector);
      var $radio = $selector.find('input');

      $radio.off().on('click', function () {
        var $this = jq(this);
        var value = $this.val();
        event.changePeriodMethods(value);
      });
      defaultClick();
      setEvent();
    };

    var setEvent = function () {
      //訂單有效期間(!)
      var $selector = jq(set.selector);
      var $direction = $selector.find('.direction_2');
      $direction.off().on('click', function () {
        var text =
          '<div class="remind_content">1.「當日有效單」之委託，僅限該投資標的交易執行日所處交易市場當日有效，該交易市場營業日若未成交則自動失效。<br>2.「長效單」為指定日期(含)前，該委託持續有效，惟委託期間須為台灣且當地市場有效營業日始執行委託下單。長效單之交易若有部分成交、委託失敗、長效到期時，即終止該長效單之交易；如遇到商品有分割、反分割、清算下市、合併、減資換發新股等股數異動之情形，長效單委託將自動終止。</div>';
        This.DebitPeriodByInvestingMethodsPopup(text);
      });
    };
    var set = {
      selector: '',
      investingMethods: '',
      isLoading: true
    };
    var event = {
      changePeriodMethods: function () {}
    };
    var interface = {};
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector, investingMethods) {
        set.selector = selector;
        set.investingMethods = investingMethods;
        if (html.hasOwnProperty(set.investingMethods)) {
          $html = jq(html[set.investingMethods]());
          $html.appendTo(selector);
        }
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //訂單有效期間(!)
  StockSubscriptionComponent.prototype.DebitPeriodByInvestingMethodsPopup = function (popContent) {
    if (!popContent) {
      return;
    }
    var popup = yuantaApp.newBlock
      ._commonPopupModule()
      .set('modal', {
        showCloseBtn: true,
        showConfirmBtn: false,
        showCancelBtn: false,
        confirmAddOnClass: false,
        cancelAddOnClass: false
      })
      .set('modalTitle', '訂單有效期間')
      .set('modalContent', popContent)
      .appendTo()
      .build();
    popup.open();
  };

  //長效單委託迄日
  StockSubscriptionComponent.prototype.DebitDateByLongPeriodMethods = function () {
    var html =
      '<div class="title_blk_2 tB">長效單委託迄日</div>\
        <div id="longPeriodDate" class="longPeriodDateInput_input_box input_box datePick">\
            <input id="longPeriodDateInput" type="text" placeholder="請選擇委託迄日" readonly style="width:100%"/>\
            <a href="javascript:void(0)" class="datePick"></a>\
            <a href="javascript:void(0)" class="none btn_delete"></a>\
        </div>\
        <p id="longPeriodDateInputWarnMessage" class="supplement c_org none"></p>';
    var $html = jq(html);
    var orderDate = '';
    var orderDateArr = [];

    var toggleInputDisable = function () {
      var $selector = jq(set.selector);
      var $input = $selector.find('input');
      var $inputBox = $selector.find('.input_box');

      if (set.disabled || service.getDisableInput()) {
        $inputBox.addClass('disabled');
        $input.attr('disabled', true);
      } else {
        $input.attr('disabled', false);
        $inputBox.removeClass('disabled');
      }
    };

    var setData = function () {
      orderDate = set.data.longTermOrderDate.selectedDeadlineDate || '';
      if (orderDate.indexOf(',') !== -1) {
        orderDateArr = orderDate.split(',');
      }

      setEvent();
      toggleInputDisable();
    };

    var handleValid = function () {
      var $selector = jq(set.selector);
      // dataPicker
      var $longPeriodDateInput = $selector.find('#longPeriodDateInput');
      var longPeriodDateInputValue = $longPeriodDateInput.val();
      var longPeriodDateInputValueFormat = longPeriodDateInputValue.replace('/', '').replace('/', '');
      var $longPeriodDateInputInputBox = $selector.find('.longPeriodDateInput_input_box');
      var $longPeriodDateInputWarnMessage = $selector.find('#longPeriodDateInputWarnMessage');
      set.inputValid = true;

      if (!longPeriodDateInputValue) {
        set.inputValid = false;
        $longPeriodDateInputInputBox.addClass('warn');
        $longPeriodDateInputWarnMessage.removeClass('none').text('尚未選擇長效單有效日期');
        set.longPeriodDate = '';
      } else if (orderDateArr.indexOf(longPeriodDateInputValueFormat) === -1) {
        set.inputValid = false;
        $longPeriodDateInputInputBox.addClass('warn');
        $longPeriodDateInputWarnMessage.removeClass('none').html('此日期不可承作長效單，請重新選擇有效日期<br>委託期間須為台灣且當地市場有效營業日');
        set.longPeriodDate = '';
        jq('#longPeriodDateInput').val('');
        jq('#longPeriodDate').find('.datePick').removeClass('none');
        jq('#longPeriodDate').find('.btn_delete').addClass('none');
      } else {
        $longPeriodDateInputInputBox.removeClass('warn');
        $longPeriodDateInputWarnMessage.addClass('none').text('');
        set.longPeriodDate = longPeriodDateInputValue;
      }

      event.updateLongPeriodDate(set.longPeriodDate);
    };

    var setEvent = function () {
      //委託迄日
      var $longPeriodDateInput = $html.find('#longPeriodDateInput');
      var orderMinDate = HeaderObject.GetServerDate().format('yyyy/mm/dd');
      var orderMaxDate = HeaderObject.GetServerDate().addYear(10).format('yyyy/mm/dd');
      if (orderDate && orderDateArr && orderDateArr.length > 0) {
        orderMinDate = orderDateArr[0].replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');
        orderMaxDate = orderDateArr[orderDateArr.length - 1].replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');
      }
      $longPeriodDateInput.off();
      $longPeriodDateInput
        .mobiscroll()
        .date({
          lang: 'zh',
          theme: 'android-holo-light',
          display: 'bottom',
          animate: 'none',
          dateFormat: 'yy/mm/dd',
          dateOrder: 'yymmdd',
          minDate: new Date(orderMinDate),
          maxDate: new Date(orderMaxDate),
          showOnTap: false
        })
        .val('');
      $longPeriodDateInput.mobiscroll('option', { showOnTap: true });
      $longPeriodDateInput.on('change', function () {
        var $this = jq(this);
        var value = $this.val();
        if (value) {
          jq('#longPeriodDate').find('.datePick').addClass('none');
          jq('#longPeriodDate').find('.btn_delete').removeClass('none');
        } else {
          jq('#longPeriodDate').find('.datePick').removeClass('none');
          jq('#longPeriodDate').find('.btn_delete').addClass('none');
        }
        handleValid();
      });

      var $longPeriodDate = jq('#longPeriodDate');
      $longPeriodDate
        .find('.datePick')
        .off()
        .on('click', function (e) {
          e.stopPropagation();
          jq('#longPeriodDateInput').mobiscroll('show');
          handleValid();
        });

      $longPeriodDate
        .find('.btn_delete')
        .off()
        .on('click', function (e) {
          e.stopPropagation();
          jq('#longPeriodDateInput').val('');
          jq('#longPeriodDate').find('.datePick').removeClass('none');
          jq('#longPeriodDate').find('.btn_delete').addClass('none');
          handleValid();
        });
    };
    var set = {
      selector: '',
      data: null,
      disabled: false,
      longPeriodDate: '',
      inputValid: true
    };

    var service = {
      setDisableInput: function () {},
      getDisableInput: function () {}
    };

    var event = {
      updateLongPeriodDate: function () {}
    };

    var interface = {
      valid: function () {
        handleValid();
        return set.inputValid;
      }
    };
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      service: function (name, value) {
        service[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $html.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //介紹人編號
  StockSubscriptionComponent.prototype.Recommender = function () {
    var html =
      '<div class="title_blk_2">介紹人編號<span class="c_gray">(選填)</span><a id="recommenderTips" href="javascript:void(0)" class="direction_2"></a></div>\
        <div class="input_box">\
            <input id="recommender" type="search" placeholder="請輸入介紹人編號" maxlength="10" value="B000000000" style="width:100%;"/>\
        </div>\
        <p id="recommenderWarnMessage" class="supplement c_org none"></p>';
    var $html = jq(html);

    var disableInput = function () {
      var $selector = jq(set.selector);
      var $inputBox = $selector.find('.input_box');
      var $input = $selector.find('input');
      $inputBox.addClass('disabled');
      $input.prop('checked', false).attr('disabled', true).val('');
    };

    var unDisableInput = function () {
      var $selector = jq(set.selector);
      var $inputBox = $selector.find('.input_box');
      var $input = $selector.find('input');
      $inputBox.removeClass('disabled');
      $input.prop('checked', false).attr('disabled', false);
    };

    var setData = function () {
      setEvent();
      if (service.getDisableInput()) {
        disableInput();
      } else {
        unDisableInput();
      }
    };

    var handleValid = function () {
      var result = true;
      var $selector = jq(set.selector);
      var $recommender = $selector.find('#recommender');
      var value = $recommender.val();
      var parent = $recommender.parent();
      var $recommenderWarnMessage = jq('#recommenderWarnMessage');
      if (!value || value.length < 10) {
        set.inputValid = false;
        parent.addClass('warn');
        $recommenderWarnMessage.text('介紹人編號長度必須為10碼').removeClass('none');
        result = false;
      } else {
        set.inputValid = true;
        parent.removeClass('warn');
        $recommenderWarnMessage.text('').addClass('none');
        result = true;
      }
      return result;
    };

    var setEvent = function () {
      var $selector = jq(set.selector);
      var $recommender = $selector.find('#recommender');
      var $recommenderTips = $selector.find('#recommenderTips');

      //介紹人編號(!)
      $recommenderTips.on('click', function (e) {
        e.stopPropagation();
        This.RecommenderPopup();
      });

      $recommender
        .off()
        .on('click', function (e) {
          e.stopPropagation();
          var $this = jq(this);
          jq('#recommender_code').css({ 'margin-bottom': '400px' });
          var innerHeight = window.innerHeight;
          var top = jq('#recommender_code').offset().top + 300;
          if (top > innerHeight / 2) {
            jq('#funcPageContent').animate({ scrollTop: top });
          }
          $this.focus();
        })
        .on('focus', function (e) {
          e.stopPropagation();
          var $this = jq(this);
          var value = $this.val();
          if (value === 'B000000000') {
            $recommender.val('');
          }
        })
        .on('blur', function (e) {
          e.stopPropagation();
          var $this = jq(this);
          var value = $this.val();
          jq('#recommender_code').removeAttr('style');
          if (value === '') {
            $recommender.val('B000000000');
          } else {
            if (handleValid()) {
              event.inputChange(value);
            }
          }
        })
        .on('input change blur', function (e) {
          e.stopPropagation();
          var $this = jq(this);
          var value = $this.val();
          if (handleValid()) {
            event.inputChange(value);
          }
        });
    };
    var set = {
      selector: '',
      inputValid: true
    };

    var event = {
      inputChange: function () {}
    };

    var interface = {
      valid: function () {
        var $selector = jq(set.selector);
        var $input = $selector.find('#recommender');
        var value = $input.val();
        handleValid(value);
        return set.inputValid;
      }
    };

    var service = {
      setDisableInput: function () {},
      getDisableInput: function () {}
    };

    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      service: function (name, value) {
        service[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $html.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //介紹人編號(!)
  StockSubscriptionComponent.prototype.RecommenderPopup = function () {
    var render = function () {
      var html =
        '<div class="remind_content">\
                    <section class="m10">有效位數10碼：</section>\
                    <section class="m10">1.第1碼為介紹人「公司別代號」: A金控；B銀行；C證券；D證金；E投信；F投顧；G期貨</section>\
                    <section class="m10">2.第2及第3碼為「00」</section>\
                    <section class="m10">3.後7碼為介紹人「7碼員編」，員編不足7碼者前補0<br>例如：介紹人為銀行員工（7碼員編0061116）時，介紹人編號應輸入B000061116。</section>\
                  </div>';
      var modalData = {
        showCloseBtn: false,
        showConfirmBtn: true,
        showCancelBtn: false,
        confirmAddOnClass: true,
        cancelAddOnClass: false,
        confirmText: '我知道了',
        cancelText: ''
      };
      yuantaApp.newBlock
        ._commonPopupModule()
        .set('modal', modalData)
        .set('modalTitle', '介紹人編號輸入規則')
        .set('modalContent', html)
        .appendTo()
        .build()
        .open();
    };
    if (window && window.requestAnimationFrame) {
      requestAnimationFrame(function () {
        render();
      });
    } else {
      render();
    }
  };

  //特別約定事項
  StockSubscriptionComponent.prototype.StockTradedSubscriptionPopup = function () {
    var pageid = jq('#funcPageContent').data('pageid');
    var pageTitleName = pageid === '_A0438_01' ? '個股賣出' : '個股申購';
    var html =
      '<div class="popup newBlock">\
          <div class="popup_close" tabindex="0" data-aria="cancel">\
              <img src="images/menu_back.png" role="button" alt="" />\
          </div>\
          <div class="popup_title background_base bg_blue">\
              <span>' +
      pageTitleName +
      '</span>\
          </div>\
          <div id="contractContent" class="popup_content">\
              <div class="wrapper">\
                  <div class="inside">\
                      <div class="content">\
                          <div class="process">\
                              <div class="done">資料填寫</div>\
                              <div class="on">同意簽署</div>\
                              <div class="">交易確認</div>\
                          </div>\
                          <div class="line_area">\
                              <section>\
                                  <div class="document_area">\
                                    <div class="document_tt">特別約定事項\
                                        <div class="deco">\
                                            <div></div>\
                                            <div></div>\
                                            <div></div>\
                                            <div></div>\
                                            <div></div>\
                                        </div>\
                                    </div>\
                                    <div class="document_in">\
                                        <div class="stage">\
                                            <div class="title_blk_3">特別約定事項：</div>\
                                            <p>一、委託人確實瞭解投資境外ETF、境外股票及特別股非屬存款保險條例或其他相關保障機制之保障範圍，且具投資風險，最大可能損失為全部之信託本金。</p>\
                                            <p>二、委託人瞭解若不具貴行專業投資人身分，不得買進限專業投資人買進之理財商品。法人專業投資人與貴行交易屬專業投資人之商品時，除憑信託原留印鑑之外，並需由經授權辦理交易之人親簽後，始生效力。</p>\
                                            <p>三、貴行即受託人應盡善良管理人之注意義務處理信託事務，但不擔保委託人申請之投資必定成交，委託人已充分瞭解本交易有無法成交之風險，若遇無法成交之情形，委託人同意最遲於約定買進日(包括當日有效單或長效單之最後有效日)次二個營業日內，受託人得逕行撤銷該交易委託，並於委託人圈存之存款帳戶執行解圈交易。</p>\
                                            <p>四、受託人按一般作業流程將交易指示輸入系統，並經確認委託成功後，委託申請始生效，非依據委託人申請提出之時點；ETF、境外股票及特別股商品之委託申請將即時於已開盤之交易所營業時間內，或隨後即將開盤之交易所營業時間開始時送達；本申請書所填列之當日有效單或長效單之指定交易期間，僅限於臺灣及投資標的掛牌之外國交易所營業日有效。委託有效期間內，一旦部分成交或全部成交，則該筆交易即委託完成；若於該營業日未成交，則該日之委託自動失效。</p>\
                                            <p>五、如遇商品發行機構有分割、反分割、清算下市、合併、減資換發新股等股數異動之情形，長效單委託將自動終止。</p>\
                                            <p>六、ETF、境外股票定期定額投資約定條款</p>\
                                            <div class="level2">\
                                              <p>(一)委託人若於每月定期買進日期（即每月2、8、12、18、22、28日）當日至受託人分行臨櫃申請定期投資，第一次圈存投資交易將自動順延至下一營業日生效。</p>\
                                              <p>(二)委託人同意若因約定帳戶相關問題（例如：客戶就該帳戶來電掛失印鑑、掛失存摺，或該帳戶應依法院執行命令扣押等），而無法於交易日次一營業日自上述約定帳戶扣款，委託人必須於確定成交後當日臺灣時間下午3：00前至受託人分行臨櫃辦理扣款事宜。若無法完成扣款，委託人同意貴行取消此該筆交易，且所需之一切成本及相關費用，委託人同意貴行得逕自委託人於貴行開立之任一存款帳戶中扣抵。</p>\
                                              <p>(三)定期定額投資信託資金之扣帳</p>\
                                              <ul class="doc_num">\
                                                <li>委託人同意貴行於委託人指定之買進日期全權處理電腦圈存作業，包括圈存時點、順序、方式。委託人之指定帳戶應於指定買進日期之前一銀行營業日留存足夠圈存金額，否則視為該月份未予信託投資，倘同時有數筆圈存投資金額而存戶上述之指定帳戶存款餘額不足時，以貴行圈存作業處理之先後順序為準，委託人不得指定或異議。若遇電腦系統故障或其他不可抗力事故，致貴行未能於委託人指定買進日期進行圈存作業時，委託人同意順延至障礙事由排除後之次一銀行營業日進行扣帳。</li>\
                                                <li>委託人指定之買進日期如遇例假日，將自動順延至次一銀行營業日。同一定期定額投資委託序號指定之數筆買進（扣款）日期，因遇例假日而自動順延至同一營業日時，系統將依不同買進（扣款）日期各自產生數筆圈存扣款交易。</li>\
                                                <li>委託人未依第1目約定於指定買進日期之前一銀行營業日，於指定帳戶留存足夠圈存金額，致同一投資標的於指定買進日期無法圈存連續達三十次者，視同委託人暫停該投資標的於該指定買進日期繼續圈存交易之意思表示，且本申請書有關定期定額投資之約定停止適用；俟收到客戶恢復扣款之書面或雙方約定方式之申請後，始恢復投資並自動圈存扣款。</li>\
                                                <li>委託人有權隨時以書面或雙方約定方式通知 貴行終止定期定額圈存交易投資。</li>\
                                                <li>委託人須於指定圈存交易日之前一日（即指定圈存交易日當日臺灣時間00:00前）完成定期定額申購委託及約定條件異動，相關委託及約定條件異動方能於指定圈存交易日生效。於臺灣時間00:00後完成之定期定額申購委託及約定條件異動則將於次一營業日生效。</li>\
                                              </ul>\
                                              <p>(四)定期定額投資信託資金扣帳金額之計算</p>\
                                              <ul class="doc_num">\
                                                <li>委託人同意貴行以「（投資標的於該次圈存交易日前一營業日收盤價 × 買進股數＋預估手續費） × 圈存匯率 × 限價110% 」計算之金額辦理圈存（如委託人以外幣信託投資，圈存匯率為1），委託人同意貴行保留調整圈存倍數及圈存匯率之權利；若有調整，貴行得逕於官方網站公告，不需另行通知委託人。委託人瞭解已圈存之款項不得動支，並同意受託人於交易日次一營業日自上述約定帳戶中逕行扣款。</li>\
                                                <li>貴行將依「約定預估信託金額」與投資標的於該次圈存交易日之前一營業日收盤價，以下列公式試算可買進股數：<br>買進股數＝約定預估信託金額/ 圈存匯率/（投資標的於該次圈存交易日前一營業日收盤價 × 限價110%）/(1＋手續費率%)，買進股數取至整數位。</li>\
                                              </ul>\
                                            </div>\
                                        </div>\
                                    </div>\
                                  </div>\
                              </section>\
                          </div>\
                      </div>\
                  </div>\
                  <div class="fixBot">\
                      <div class="scroll_plz"><a href="javascript:void(0);" id="goBot"></a>請滑動頁面至底部詳閱本條款完整內容</div>\
                      <p class="supplement_tc">我已閱讀並了解以上所載之內容</p>\
                      <div id="confirm" class="bot_btn_set invalid">\
                          <div class="single"><a href="javascript:void(0)"></a>同意</div>\
                      </div>\
                  </div>\
              </div>\
          </div>\
      </div>';
    var $popup = jq(html);
    var hideScrollToBottomTips = function () {
      var $selector = jq(set.selector);
      $selector.find('.fixBot .bot_btn_set').removeClass('invalid');
      $selector.find('.scroll_plz').addClass('pass');
    };

    var setData = function () {
      if (set.isSign) {
        set.isScrollToBottom = true;
        hideScrollToBottomTips();
      }
      setEvent();
    };

    var setEvent = function () {
      var $selector = jq(set.selector);
      var $confirm = $selector.find('#confirm a');
      var $goBot = $selector.find('#goBot');
      var $contractContent = $selector.find('#contractContent');
      var $popupClose = $selector.find('.popup_close');

      $goBot.off().on('click', function (e) {
        e.stopPropagation();
        set.isScrollToBottom = true;
        var height = document.getElementById('contractContent').scrollHeight;
        $contractContent.animate({ scrollTop: height }, 1000);
      });

      $contractContent.off().on('scroll', function () {
        var cHeight = document.getElementById('contractContent').clientHeight;
        var sHeight = document.getElementById('contractContent').scrollHeight;
        var sTop = document.getElementById('contractContent').scrollTop;

        if (cHeight + sTop >= sHeight - 50) {
          set.isScrollToBottom = true;
          hideScrollToBottomTips();
        }
      });

      $confirm.off().on('click', function (e) {
        e.stopPropagation();
        if (!set.isScrollToBottom) {
          return;
        }
        event.confirm();
        interface.close();
      });

      $popupClose.off().on('click', function (e) {
        e.stopPropagation();
        event.popupClose();
        interface.close();
      });
    };

    var set = {
      selector: '',
      isSign: false,
      isScrollToBottom: false
    };
    var event = {
      confirm: function () {},
      popupClose: function () {}
    };
    var interface = {
      open: function () {
        location.replace(set.selector);
        yuantaApp.gettransarr();
        yuantaApp.popupResize(set.selector.replace('#', ''));
        return interface;
      },
      close: function () {
        jq(set.selector).empty();
        location.replace('#');
        yuantaApp.gettransarr();
        return interface;
      }
    };
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $popup.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //授權圈存/扣款約定條款
  StockSubscriptionComponent.prototype.StockAgreementOnDepositAndDebitPopup = function () {
    var html =
      '<div class="popup newBlock">\
        <div class="popup_close" tabindex="0" data-aria="cancel">\
            <img src="images/menu_back.png" role="button" alt="" />\
        </div>\
        <div class="popup_title background_base bg_blue">\
            <span>個股申購</span>\
        </div>\
        <div id="contractContent" class="popup_content">\
            <div class="wrapper">\
                <div class="inside">\
                    <div class="content">\
                        <div class="process">\
                            <div class="done">資料填寫</div>\
                            <div class="on">同意簽署</div>\
                            <div class="">交易確認</div>\
                        </div>\
                        <div class="document_area checkbox_bottom">\
                            <div class="document_tt">授權圈存/扣款約定條款\
                                <div class="deco">\
                                  <div></div>\
                                  <div></div>\
                                  <div></div>\
                                  <div></div>\
                                  <div></div>\
                                </div>\
                            </div>\
                            <div class="document_in">\
                              <div class="stage">\
                                  <div class="title_blk_3">委託人授權貴行於申請日(含)起至成交確認日(含)止，依上述欄位所載，逕自委託人指定之本人存款帳戶，圈存委託人依約應繳之折合信託資金總額、申購手續費及各項費用(如有)，圈存中之存款帳戶資金仍予計息，惟無法動用；授權貴行於成交確認日扣除該實際成交款項，不另開具取款憑條，且對所扣繳之一切扣減帳項完全承認，絕無異議。</div>\
                              </div>\
                            </div>\
                        </div>\
                        <div class="check_rule checkbox_bottom">\
                          <div class="iAgree">\
                            <input type="checkbox" id="depositInfo"/>\
                            <label for="depositInfo"><span></span>我已閱讀並了解已上所載之內容</label>\
                            <div class="check_plz">請勾選已審閱授權圈存/扣款約定條款</div>\
                          </div>\
                        </div>\
                    </div>\
                </div>\
                <div class="fixBot">\
                    <p class="supplement_tc">我已閱讀並了解以上所載之內容</p>\
                    <div id="confirm" class="bot_btn_set invalid">\
                        <div class="single"><a href="javascript:void(0)"></a>同意</div>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>';
    var $popup = jq(html);

    var hideScrollToBottomTips = function () {
      var $selector = jq(set.selector);
      $selector.find('.fixBot .bot_btn_set').removeClass('invalid');
      $selector.find('.scroll_plz').addClass('pass');
    };

    var setData = function () {
      set.isScrollToBottom = true;
      hideScrollToBottomTips();
      setEvent();
    };

    var setEvent = function () {
      var $selector = jq(set.selector);
      var $confirm = $selector.find('#confirm a');
      var $popupClose = $selector.find('.popup_close');
      var $depositInfo = $selector.find('#depositInfo');

      $depositInfo.off().on('click', function (e) {
        e.stopPropagation();
        var $this = jq(this);
        var isChecked = $this.prop('checked');
        set.depositInfoCheckStatus = isChecked;
        $this.parent().removeClass('org_warn');
      });
      if (set.isSign) {
        $depositInfo.click();
      }

      var valid = function () {
        var result = true;
        if (!set.isScrollToBottom) {
          result = false;
        }
        if (!set.depositInfoCheckStatus) {
          $depositInfo.parent().addClass('org_warn');
          result = false;
        }
        return result;
      };

      $confirm.off().on('click', function (e) {
        e.stopPropagation();
        if (!valid()) {
          var $popupContent = $selector.find('.popup_content');
          $popupContent.animate({ scrollTop: 0 }, 100);
          return;
        }

        interface.close();
        event.confirm(set);
      });

      $popupClose.off().on('click', function (e) {
        e.stopPropagation();
        interface.close();
        event.popupClose();
      });
    };

    var set = {
      selector: '',
      isSign: false,
      isScrollToBottom: false,
      depositInfoCheckStatus: false
    };
    var event = {
      confirm: function () {},
      popupClose: function () {}
    };
    var interface = {
      open: function () {
        location.replace(set.selector);
        yuantaApp.gettransarr();
        yuantaApp.popupResize(set.selector.replace('#', ''));
        return interface;
      },
      close: function () {
        jq(set.selector).empty();
        location.replace('#');
        yuantaApp.gettransarr();
        return interface;
      }
    };
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $popup.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //信託報酬及投資風險告知
  StockSubscriptionComponent.prototype.StockTrustRemunerationPopup = function () {
    var html =
      '<div class="popup newBlock">\
        <div class="popup_close" tabindex="0" data-aria="cancel">\
            <img src="images/menu_back.png" role="button" alt="" />\
        </div>\
        <div class="popup_title background_base bg_blue">\
            <span>個股申購</span>\
        </div>\
        <div id="contractContent" class="popup_content">\
            <div class="wrapper">\
                <div class="inside">\
                    <div class="content">\
                        <div class="process">\
                            <div class="done">資料填寫</div>\
                            <div class="on">同意簽署</div>\
                            <div class="">交易確認</div>\
                        </div>\
                        <div class="document_area checkbox_bottom">\
                            <div class="document_tt">信託報酬及投資風險告知\
                                <div class="deco">\
                                  <div></div>\
                                  <div></div>\
                                  <div></div>\
                                  <div></div>\
                                  <div></div>\
                                </div>\
                            </div>\
                            <div class="document_in">\
                                <div class="stage">\
                                    <div class="title_blk_3">壹、信託費用之計收</div>\
                                    <p>一、貴行辦理特定金錢信託投資於國內外有價證券及其他投資標的時，除雙方另有約定外，應依下列規定收取報酬：</p>\
                                    <div class="level2">\
                                        <p>(一)申購手續費：依信託本金按費率0%至6.5%計算，或依交易標的之公開說明書/產品說明書規定之收費標準，於客戶每次委託申購或贖回時計（扣）收。</p><br>\
                                        <p>(二)信託管理費：</p>\
                                        <ul class="doc_num">\
                                            <li>單筆信託投資：自申購日起，每年按信託本金0.2%計算。基金及ETF商品每筆於貴行撥付贖回款項時扣收，最低為等值新臺幣200元整，其他商品於配息、投資人提前贖回或到期時，自撥付金額中扣除，或依各商品公開說明書/產品說明書規定之收費標準扣收。</li>\
                                            <li>定期定額/不定額信託投資：自申購日起，依先進先出原則，按信託本金0.2%(年利率)逐日計算，每筆於貴行撥付贖回款項時扣收；最低扣收金額為等值新臺幣200元整。</li>\
                                        </ul>\
                                        <p>(三)轉換手續費：國內基金每筆轉換費用為新臺幣100元整，境外基金為新臺幣500元整，於每次客戶申請轉換時計收；國內外發行機構如對轉換交易另訂有轉換手續費之費率或收取方式者，另從其計費規定收取</p><br>\
                                        <p>(四)贖回手續費：依贖回成交金額或發行機構買回金額按費率0%至3%計算，或依交易標的之公開說明書/產品說明書規定之收費標準，於客戶每次贖回或發行機構買回分配款中扣收。</p>\
                                    </div><br>\
                                    <p>二、客戶瞭解並同意下列費用由交易對象（又稱交易對手）支付貴行，係作為貴行收取之信託報酬：</p>\
                                    <div class="level2">\
                                        <p>(一)持有期間之通路服務費：由貴行之交易對手或基金公司給付予貴行，以貴行於交易對手或基金公司之淨資產價值乘上費率計算之，費率為0%~1.5%(年費率)，支付方式依各交易對手或基金公司而有所不同，可能採取月、季、半年、年度支付方式為之；此服務費係已包含於交易對手或基金公開說明書所規定之費用，如為基金，由基金公司逕自各基金之每日淨資產價值中扣除。</p><br>\
                                        <p>(二)申購時之分銷費用或通路服務費：由交易對手或基金公司給付予貴行，於申購時一次給付。以信託本金乘上費率計算之，費率0%至10%，視市場情形而定。此費用如係已包含於交易對手或基金公開說明書所規定之費用，如為基金，將由基金公司逕自各基金之每日淨資產價值中扣除。</p>\
                                    </div><br>\
                                    <p>三、貴行理財優惠活動期間，如另有約載申購手續費折扣優惠者，從其規定辦理。</p><br>\
                                    <p>四、客戶瞭解並同意貴行辦理本項信託業務（特定金錢信託）之相關交易時，可能得自交易對象之任何費用，均係作為貴行收取之信託報酬。</p><br>\
                                    <p>五、其他有關投資於投資標的所發生之費用，依慣例應由客戶負擔者，或貴行為維護客戶之權益，因而與第三人涉訟、提付仲裁或其他交涉所產生之費用，均由客戶負擔。</p><br>\
                                    <p>六、前述各項應由客戶負擔之費用，於實際發生時，貴行有權自客戶指定之存款帳戶扣收，倘因故無法收取或由貴行累計墊款者，貴行有權自客戶之信託資金收益、贖回款中先行扣收，或處分部分信託財產，以支付相關費用或貴行之累計墊款。</p><br>\
                                    <p>七、客戶向貴行請求閱覽或影印其信託財產相關資料時，貴行得依其收費規定酌收工本費，收費項目與收費標準於附錄中載明，並於貴行營業場所及網站公告，各項手續費用如有調整，貴行應於生效日六十日前於營業場所及網站公告，但上述相關條款有利於客戶者，一經公告即生效力。</p>\
                                </div>\
                                <div class="stage">\
                                    <div class="title_blk_3">貳、特定金錢信託投資國內外有價證券及其他投資標的特約條款及風險預告書</div>\
                                    <p>一、本特約條款及風險預告書(以下稱本特約條款)係委託人以特定金錢信託方式指示 貴行(以下稱受託人)以受託人名義運用投資國內外投資標的及其相關事宜；本特約條款係補充委託人與受託人原所簽訂相關特定金錢信託契約或「信託服務約定書」(以下稱原信託契約書)之約定。</p><br>\
                                    <p>二、委託人將信託資金交付受託人為投資標的之指示運用前，應確實詳閱投資標的之相關資料及其規定並瞭解其投資風險，包括但不限於可能發生之投資標的跌價、匯兌損失所導致之本金虧損，或投資標的暫時贖回及解散清算等風險。且各項投資標的之公開說明書/產品說明書或風險預告書等資料並無法揭露所有風險及其他重要事項，委託人在從事相關交易前應詳細瞭解有關的金融知識，並基於獨立審慎之投資判斷後，憑以決定各項投資指示。</p><br>\
                                    <p>三、本信託資金運用管理所生之資本利得及其孳息等收益，悉數歸委託人所享有；其投資所生之風險、費用及稅捐亦悉數由委託人負擔，受託人不為信託本金及投資收益之保證。投資標的為基金時，基金以往之績效不代表未來之表現，亦不保證基金之最低收益。</p><br>\
                                    <p>四、投資國外有價證券除具有前述二、三項之風險外，並附有下列較常見之風險與事項，委託人應就受託人逐案交付之投資標的產品說明書詳加閱讀及充分明瞭投資標的之交易特性及風險後慎選投資標的。</p>\
                                    <div class="level2">\
                                        <p>(一)國外投資標的係於國外證券市場交易，應遵照當地國家之法令及交易市場之規定辦理，其或與我國法規不同。</p><br>\
                                        <p>(二)投資標的於募集期間內未達募集金額致無法發行，或因市場波動劇烈致交易對象無法依產品說明書所述條件發行投資標的時，交易對象得不發行投資標的，由受託人無息退還委託人原信託金額及手續費。</p><br>\
                                        <p>(三)投資標的發行內容以交易對象出版之英文版公開說明書、產品說明書為主要參考之依據，委託人應詳加閱讀及充分暸解，自行決定是否投資並自行承擔風險。因投資標的交易特性或市場波動等因素，公開說明書、產品說明書內所列舉之發行日、評價日，付息日、參與率、付息計算公式及提前贖回等發行條件於交易日後由交易對象正式確認。</p><br>\
                                        <p>(四)除發行條件另有規定外，投資標的之起息日為該投資標的之發行日。</p><br>\
                                        <p>(五)交易對象及標的資產組合內各股票之發行公司可能發生併購、下市、國有化、重整及破產等情形，故即使該等機構及標的資產目前評等極高，不保證未來不可能發生價格或信用等風險。</p><br>\
                                        <p>(六)委託人投資期間提前贖回或出售所可能衍生之不利益，包括但不限於因市場波動或其他因素而發生本金折價之風險，且有無法或即時贖回委託人所有投資之流動性風險存在，委託人應審慎全面考量本身風險承擔能力後，決定是否提前贖回或出售交易，以減少該不利益情形。</p><br>\
                                        <p>(七)所投資標的若以外幣計價，申購與贖回具有匯兌風險，尤其匯率波動時刻須謹慎處理，且所投資標的不得辦理轉換。</p><br>\
                                        <p>(八)受託人不擔保交易對象及投資標的之債信評等及承擔其一切風險(包括但不限於交易對象於到期前或到期時投資標的財產價值之一定交付)。所投資標的之本金及利息由交易對象支付，受託人僅為受託投資機構並不保本保息，委託人於指示受託人投資前應自行審慎評估。</p>\
                                    </div><br>\
                                    <p class="undLine">五、委託人應瞭解，投資衍生性金融商品交易除具有前述二至四項之風險外，並附有下列較常見之風險，委託人應就受託人逐案交付之投資標的產品說明書詳加閱讀及充分明瞭投資標的之交易特性及風險後基於本身判斷慎選投資標的。</p>\
                                    <div class="level2">\
                                        <p>(一)辦理衍生性金融商品交易，均會帶來某種程度的風險。因此，委託人於從事衍生性金融商品交易前，應根據自己的實際經驗、交易之目的來了解從事該商品交易對其財務狀況可能產生之影響及其適切性。從事衍生性金融商品交易之風險將會因其商品性質及個別客戶之屬性而有所差異。</p><br>\
                                        <p>(二)委託人之投資標的可能因匯率、利率水準、市場價格或波動率反向變動而產生市場風險，或因市場流動不佳導致買賣價差擴大而產生流動性風險，而使進行的衍生性金融商品交易發生損失。</p><br>\
                                        <p>(三)衍生性金融商品交易尚有可能因交易對象未能履行交割義務或因風險控管系統、流程失誤、交易交割程序差錯或報表系統有誤而產生交易損失。</p>\
                                    </div><br>\
                                    <p class="undLine">六、委辦理本項業務時，如投資標的涉及國外有價證券或衍生性金融商品時另應注意下列事項:</p>\
                                    <div class="level2">\
                                        <p>(一)委託人聲明其本人(委託人如為公司時則包括該公司之實質控制股東)並非投資標的之公開說明書、產品說明書所載限制特定國家不得投資之人，且不會轉讓投資標的之相關權利予前述不得投資之人並願遵守公開說明書、產品說明書之相關規定。受託人並得要求該投資標的之委託人簽署未具有該國公民/居民身分或未擁有該國永久居留權之聲明書。委託人於投資後具有上開身分時，應主動立即以書面通知受託人，並應同時依該國相關稅法規定出具及提供所需文件予受託人，如未遵守該約定，委託人同意如下:</p>\
                                        <ul class="doc_num">\
                                            <li>賠償受託人因為遵守該國相關稅賦法令規定而遭受/支付之任何支出、損失、罰款或其他相關款項。</li>\
                                            <li>受託人得逕行終止該項投資，並贖回委託人所持有之全數債券或單位數。</li>\
                                        </ul>\
                                        <p>(二)委託人之投資標的如涉及衍生性金融商品交易者，受託人依法令或主管機關或受託人之規定，得要求委託人簽署國際標準化之ISDA(International Swaps & Derivatives Association)合約。</p><br>\
                                    </div>\
                                    <p>七、投資標的因公開說明書、產品說明書等明定交易對象有提前買回權或因投資標的之規定或其他事由而強制贖回時，委託人無條件同意辦理，不得以本信託契約未屆期為由而拒絕贖回，若委託人逾期仍不為贖回時，由受託人逕自贖回。</p><br>\
                                    <p>八、其他應注意之事項</p>\
                                    <div class="level2">\
                                        <p class="undLine">(一)銀行辦理信託業務，應盡善良管理人之注意義務及忠實義務，惟不擔保委託人於本項投資之本金、收益、管理或運用績效，委託人應自負盈虧。本項信託資金非屬銀行存款，故不受存款保險之保障。</p><br>\
                                        <p>(二)委託人自交付信託資金後至產品發行日止不得以任何理由要求取消或返還，惟自產品發行日至到期日前之期間，委託人若要求終止信託時，應依提前贖回之規定辦理。</p><br>\
                                        <p>(三)受託人於投資標的到期或提前贖回時，在扣除相關必要費用及稅捐後，將依委託人原始投資幣別存入委託人於受託銀行開立之存款帳戶。</p><br>\
                                        <p>(四)信託手續費係受託人受託開辦本信託之事務處理費，並已由受託人於信託資金交付或委託人另行支付後計收，委託人明白且同意該筆費用不論是否有提前贖回之情形，均不予退還或折扣。</p><br>\
                                        <p>(五)為提供信託服務，受託人依委託人之指示運用本信託資金，委託人瞭解並同意受託人得依市場行情與本項投資交易對手間之約定，自交易對手取得銀行通路銷售服務費。</p><br>\
                                        <p>(六)由於投資市場變動之不確定性，受託人不擔保委託人之投資標的於產品發行日前一定成交，若停止或取消本投資標的時，委託人同意受託人無息退還委託人信託原始金額及手續費。</p><br>\
                                        <p class="undLine">(七)產品說明書乃因特定投資人之要求而提供，並不表示任何銷售建議或邀約說明。委託人應充分了解本投資商品之內容、交易條件等，基於自主獨立判斷決定後，自行決定投資指示並完全承受任何可能產生之投資損失及風險。</p>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="check_rule checkbox_bottom">\
                          <div class="iAgree">\
                            <input type="checkbox" id="trustInfo"/>\
                            <label for="trustInfo"><span></span>我已閱讀並了解已上所載之內容</label>\
                            <div class="check_plz">請勾選已審閱信託報酬及投資風險告知</div>\
                          </div>\
                        </div>\
                    </div>\
                </div>\
                <div class="fixBot">\
                    <div class="scroll_plz"><a href="javascript:void(0);" id="goBot"></a>請滑動頁面至底部詳閱本條款完整內容</div>\
                    <p class="supplement_tc">我已閱讀並了解以上所載之內容</p>\
                    <div id="confirm" class="bot_btn_set invalid">\
                        <div class="single"><a href="javascript:void(0)"></a>同意</div>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>';
    var $popup = jq(html);

    var hideScrollToBottomTips = function () {
      var $selector = jq(set.selector);
      $selector.find('.fixBot .bot_btn_set').removeClass('invalid');
      $selector.find('.scroll_plz').addClass('pass');
    };

    var setData = function () {
      if (set.isSign) {
        set.isScrollToBottom = true;
        hideScrollToBottomTips();
      }
      setEvent();
    };

    var setEvent = function () {
      var $selector = jq(set.selector);
      var $goBot = $selector.find('#goBot');
      var $contractContent = $selector.find('#contractContent');
      var $confirm = $selector.find('#confirm a');
      var $popupClose = $selector.find('.popup_close');
      var $trustInfo = $selector.find('#trustInfo');

      $goBot.off().on('click', function (e) {
        e.stopPropagation();
        set.isScrollToBottom = true;
        var height = document.getElementById('contractContent').scrollHeight;
        $contractContent.animate({ scrollTop: height }, 1000);
      });

      $contractContent.off().on('scroll', function () {
        var cHeight = document.getElementById('contractContent').clientHeight;
        var sHeight = document.getElementById('contractContent').scrollHeight;
        var sTop = document.getElementById('contractContent').scrollTop;

        if (cHeight + sTop >= sHeight - 50) {
          set.isScrollToBottom = true;
          hideScrollToBottomTips();
        }
      });

      $trustInfo.off().on('click', function (e) {
        e.stopPropagation();
        var $this = jq(this);
        var isChecked = $this.prop('checked');
        set.trustInfoCheckStatus = isChecked;
        $this.parent().removeClass('org_warn');
      });
      if (set.isSign) {
        $trustInfo.click();
      }

      var valid = function () {
        var result = true;
        if (!set.isScrollToBottom) {
          result = false;
        }
        if (!set.trustInfoCheckStatus) {
          $trustInfo.parent().addClass('org_warn');
          result = false;
        }
        return result;
      };

      $confirm.off().on('click', function (e) {
        e.stopPropagation();
        if (!valid()) {
          var $popupContent = $selector.find('.popup_content');
          var $checkRule = $selector.find('.check_rule');
          $popupContent.animate({ scrollTop: $checkRule.offset().top - ($popupContent.offset().top - $popupContent.scrollTop()) }, 500);
          return;
        }

        interface.close();
        event.confirm(set);
      });

      $popupClose.off().on('click', function (e) {
        e.stopPropagation();
        interface.close();
        event.popupClose();
      });
    };

    var set = {
      selector: '',
      isSign: false,
      isScrollToBottom: false,
      trustInfoCheckStatus: false
    };
    var event = {
      confirm: function () {},
      popupClose: function () {}
    };
    var interface = {
      open: function () {
        location.replace(set.selector);
        yuantaApp.gettransarr();
        yuantaApp.popupResize(set.selector.replace('#', ''));
        return interface;
      },
      close: function () {
        jq(set.selector).empty();
        location.replace('#');
        yuantaApp.gettransarr();
        return interface;
      }
    };
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $popup.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //特定金錢信託投資境外指數股票型基金(ETF)/ 境外股票(含特別股)特約事項暨風險預告書
  StockSubscriptionComponent.prototype.StockETFRiskPopup = function () {
    var pageid = jq('#funcPageContent').data('pageid');
    var pageTitleName = pageid === '_A0438_01' ? '個股賣出' : '個股申購';
    var html =
      '<div class="popup newBlock">\
        <div class="popup_close" tabindex="0" data-aria="cancel">\
            <img src="images/menu_back.png" role="button" alt="" />\
        </div>\
        <div class="popup_title background_base bg_blue">\
            <span>' +
      pageTitleName +
      '</span>\
        </div>\
        <div id="contractContent" class="popup_content">\
            <div class="wrapper">\
                <div class="inside">\
                    <div class="content">\
                        <div class="process">\
                            <div class="done">資料填寫</div>\
                            <div class="on">同意簽署</div>\
                            <div class="">交易確認</div>\
                        </div>\
                        <div class="document_area checkbox_bottom">\
                            <div class="document_tt">特定金錢信託投資境外指數股票型基金(ETF)/ 境外股票(含特別股)特約事項暨風險預告書\
                                <div class="deco">\
                                  <div></div>\
                                  <div></div>\
                                  <div></div>\
                                  <div></div>\
                                  <div></div>\
                                </div>\
                            </div>\
                            <div class="document_in">\
                                <div class="stage">\
                                    <div class="title_blk_3">一、	特約條款</div>\
                                    <p class="tB">(一)	<span class="undLine">交易注意事項：</span></p>\
                                    <div class="level2">\
                                      <ul class="doc_num">\
                                        <li>境外指數股票型基金(ETF)(下稱「ETF」)及境外股票(含特別股)限以外幣信託資金辦理。</li>\
                                        <li>受理委託人為交易指示時間：<br>(1)	分行臨櫃下單：委託人應於受託人之營業日為之，且營業日之受理時間悉依當時受託人之規定辦理。<br>(2)	電子通路平台：24小時受理交易(系統維護時間除外)，惟各市場之交易日依各證券交易所公告營業日為準，如遇投資標的交易市場假日或未開盤，則遞延至次一市場營業日。</li>\
                                        <li>\
                                          ETF及境外股票(含特別股)於美國交易所、香港交易所或其他國家交易所之交易執行，以當地交易所規定之貨幣計價，並須符合各相關交易所及受託人<span class="undLine">最低買進、賣出委託單位、累加單位及金額</span>之規定：<br>\
                                          <table width="100%" cellpadding="0" cellspacing="0" border="0" class="tab_blueLine">\
                                            <tr>\
                                                <th class="tB" colspan="2">最低<span class="undLine">買進、賣出委託</span>及累加單位</th>\
                                            </tr>\
                                            <tr>\
                                                <td class="tB">交易所</td>\
                                                <td class="tB">單位</td>\
                                            </tr>\
                                            <tr>\
                                                <td>美國交易所</td>\
                                                <td>1股</td>\
                                            </tr>\
                                            <tr>\
                                                <td>大陸地區交易所</td>\
                                                <td>1手</td>\
                                            </tr>\
                                            <tr>\
                                                <td>香港交易所</td>\
                                                <td>1手</td>\
                                            </tr>\
                                          </table><br>\
                                          <table width="100%" cellpadding="0" cellspacing="0" border="0" class="tab_blueLine">\
                                            <tr>\
                                                <th class="tB" colspan="3">最低<span class="undLine">買進</span>及<span class="undLine">賣出委託</span>金額</th>\
                                            </tr>\
                                            <tr>\
                                                <td class="tB">計價幣別</td>\
                                                <td class="tB">DBU</td>\
                                                <td class="tB">OBU</td>\
                                            </tr>\
                                            <tr>\
                                                <td>美元</td>\
                                                <td>5,000</td>\
                                                <td>20,000</td>\
                                            </tr>\
                                            <tr>\
                                                <td>人民幣</td>\
                                                <td>40,000</td>\
                                                <td>160,000</td>\
                                            </tr>\
                                            <tr>\
                                                <td>港幣</td>\
                                                <td>50,000</td>\
                                                <td>200,000</td>\
                                            </tr>\
                                          </table>\
                                        </li>\
                                        <li>ETF及境外股票(含特別股)之交易執行，以國外市場當地交易時間為主，由於時差關係，成交價格可能至交易執行後之次一營業日方可確定。</li>\
                                        <li><span class="undLine tB">ETF及境外股票(含特別股)單筆買進、賣出僅接受限價價格申請</span>，實際交易時，投資標的價格高於買進委託之限價價格，或低於賣出委託之限價價格，或因市場因素無法全部成交(例：交易量不足等)時，則可能發生部分成交或全部不成交。</li>\
                                        <li>ETF及境外股票(含特別股)於交易所交易執行受限於委託之限價價格，成交價格為申請日投資標的所在市場之<span class="tB">當日及<span class="undLine">當日之市場價格(Market Price)</span></span>為準，且<span class="undLine tB">成交價格並不以開盤價、收盤價、最高價或最低價為準</span>。</li>\
                                        <li><span class="undLine tB">ETF及境外股票(含特別股)於股票交易所(特別是香港交易所)交易之買進及賣出申請存在限制，限價價格申請不得高於或低於市場價格之一定區間，詳細區間規定依各交易所最新規定為準。若買進或賣出限價價格未介於一定區間內以致於無法在交易所掛單，此筆交易將直接由證券商撤單，且受託人將不再次進行下單作業。</span></li>\
                                        <li>若申請日或交易執行日非相關交易所營業日或非國內營業日，致該筆交易無法依市場慣例交易或執行時，受託人有權拒絕接受買進或賣出交易申請；或將該筆交易順延至次一營業日辦理。如為「當日有效單」之委託，僅限該投資標的所在交易市場於指定交易執行日當日有效，當日若未成交則自動失效。「長效單」為指定日期(含)前，該委託持續有效，惟委託期間須為臺灣及投資標的所在交易市場營業日始執行委託下單。長效單之交易若遇部分成交、委託失敗、委託到期時，即終止該長效單之交易。</li>\
                                        <li>如遇商品發行機構有分割、反分割、清算下市、合併、減資換發新股等股數異動之情形，長效單委託將自動終止。</li>\
                                        <li>受託人將於次月提供之對帳單載明委託人所買進或賣出商品之價格及單位數。</li>\
                                      </ul>\
                                    </div>\
                                    <p class="tB">(二)	<span class="undLine">各項手續費率：</span></p>\
                                    <div class="level2">\
                                      <ul class="doc_num">\
                                        <li><span class="undLine tB">買進手續費：ETF、境外股票為2%，特別股為3%，於委託人委託買進時按買進成交金額計收。</span></li>\
                                        <li><span class="undLine tB">信託管理費：自申購(買進)日起，每年按原始信託金額0.2%計算，每筆於受託人撥付贖回(賣出)款項時計收，最低為等值新臺幣200元整。如為有固定配息週期之特別股商品，於受託人撥付配息分配、發行機構買回、投資人(委託人)提前賣出或到期分配款項時，自支付金額中扣除。</span></li>\
                                        <li><span class="undLine tB">賣出手續費：ETF、境外股票為1%，特別股為0.3%，於委託人委託賣出時按賣出成交金額計收。</span></li>\
                                      </ul>\
                                    </div>\
                                    <p class="tB">(三)	<span class="undLine">買進委託限制：</span></p>\
                                    <div class="level2">\
                                      <ul class="doc_num">\
                                        <li>ETF及境外股票(含特別股)圈存之金額為<span class="undLine tB">限價價格乘以股數</span>，加計<span class="undLine tB">買進手續費</span>，由受託人自約定存款帳戶中圈存，並於成交後自帳戶中扣除實際交割款項，圈存中之存款帳戶之資金仍予計息，惟無法動用。</li>\
                                        <li>受託人應盡善良管理人之注意義務處理信託事務，但不擔保委託人申請之投資必定成交，若遇無法成交之情形，受託人將自動解除圈存，委託人得動用約定存款帳戶之資金，委託人並同意由受託人信託部逕行自系統中撤銷此筆交易。</li>\
                                        <li><span class="undLine tB">單筆買進金額限額：最高等值新臺幣6,000,000元，以限價價格乘以股數，再以本行牌告即期買進匯率換算為等值新臺幣。</span></li>\
                                      </ul>\
                                    </div>\
                                    <p class="tB">(四)	<span class="undLine">賣出委託限制：</span></p>\
                                    <div class="level2">\
                                      <ul class="doc_num">\
                                        <li><span class="undLine tB">原買進委託交易於國外交易所確認成交且於受託人之系統完成股數分配後</span>，始接受委託人之賣出委託申請。</li>\
                                        <li><span class="undLine tB">委託人可辦理全部或部分股數賣出委託，惟賣出股數或累增股數不得低於該商品或市場規定之最小交易股數。委託人持有庫存股數如已低於該商品或市場規定之最小交易股數(零股)，賣出委託限臨櫃詢價後始可申請。另委託人同意受託人以「先進先出」方式處理賣出有價證券股數。</span></li>\
                                      </ul>\
                                    </div>\
                                    <p class="tB">(五)	<span class="undLine">撤銷交易限制：</span></p>\
                                    <div class="level2">\
                                      <ul class="doc_num">\
                                        <li><span class="undLine tB">委託人撤銷買進或賣出申請僅限該筆交易之全部股數，不得僅撤銷買進或賣出之部分股數。</span></li>\
                                        <li><span class="undLine tB">撤銷交易之申請需視系統回覆確定刪除後始得生效，不以申請撤銷提出之時點為準，亦不保證委託人之撤銷交易委託一定成功。</li>\
                                        <li>受託人對委託人之撤銷交易申請，保留接受與否之權利，且委託人瞭解因交易市場及相關交易系統(包括受託人、證券商、交易所之交易系統)回傳之時間差，委託人於申請撤銷交易時，該筆交易可能已經成交或有其他事由致無法撤銷，故撤銷交易之申請並不保證該筆交易得全部成功撤銷，倘委託人申請撤銷交易時，該項交易已確定一部或全部成交致無法撤銷者，受託人仍按實際成交之交易內容執行後續之交割及匯款等相關事宜，委託人絕無異議。</li>\
                                      </ul>\
                                    </div>\
                                    <p class="tB">(六)	<span class="undLine">注意事項：</span></p>\
                                    <div class="level2">\
                                      <ul class="doc_num">\
                                        <li><span class="undLine tB">本交易可能委託元大證券股份有限公司(以下稱「元大證券」)以複委託方式進行交易。元大證券為受託人之利害關係人。</span></li>\
                                        <li>ETF及境外股票(含特別股)受限於個別交易市場之法規限制，美國公民、居民、法人、合夥事業、依據美國法律創立機構、團體或有美國永久居留權者不得申購。委託人承諾於取得美國公民或居民身分後，應立即通知受託人並賣出已投資之境外指數股票型基金(ETF)及境外股票(含特別股)部位。</li>\
                                        <li>當地稅賦法規限制：ETF及境外股票(含特別股)受限於個別交易市場之稅賦法規限制，若以美國交易市場之稅賦法規限制，係根據美國稅法之相關規定，非美國籍之個人於美國境內之美國來源收入(諸如現金股利等)皆須扣除30%之稅額。<span class="undLine tB">若股利配發屬於大陸地區來源所得者，須先扣除10%大陸地區稅額、券商處理費用，且需併入台灣地區個人所得申報，亦屬二代健保補充保費扣繳範圍。如法令有變動，依變動後規定辦理。</span></li>\
                                        <li>本交易不參與現金認股。</li>\
                                        <li>若投資標的發生包含但不限於配發股票股利(即發生除權交易)、減資換發新股、發放非投資標的之股票、經轉換為非投資標的之股票、經分割或反分割後發生非整數單位之ETF及境外股票、配發認股權證、收購、下市、解散清算或破產時可分得之剩餘財產、或因股數低於證券交易所之最低交易單位致流動性降低時，委託人同意受託人得逕為所有相關之一切行為，並於處理完成後，扣除因交易衍生之證券交易所或證券商等中介機構等相關費用及稅賦後，以現金形式給付委託人。但若前述之現金不足以支付因交易衍生之證券交易所或證券商等中介機構等相關費用及稅賦；或前述現金、股票、ETF、認股權證或其他權利等於分配後，委託券商或海外保管行始通知應支付相關費用或稅賦者，委託人同意授權受託人得免憑委託人開立之取款憑條，逕自委託人於貴行之任一帳戶扣除該等款項以補足差額。若前述帳戶餘額不足支付相關交易費用或稅賦時(包括但不限於已無信託財產、信託財產不足或既有信託財產均為庫存無現金可供扣取等)，委託人同意受託人得自前述存款帳戶分次扣款，直至扣足差額為止；或通知委託人於指定時間前匯入該等費用或稅賦至委託人帳戶，由受託人依前述授權逕自委託人帳戶扣款；或受託人亦得於委託人在受託人處之信託財產(包括但不限於產生該筆費用或稅賦之信託財產、委託人於受託人處之其他信託財產等)賣出或有其他所得款項分配時，從賣出/分配款項中扣除該等費用或稅賦，再將剩餘賣出/分配款存入委託人帳戶。</li>\
                                        <li>委託人瞭解受託人接獲投資標的有上述情事之訊息及分配相關之權益資產需要時間，委託人同意待相關權益資產處理與分配完畢後，始可進行權益資產之運用，受託人不得在權益資產未處理與分配完畢前，即接受委託人指示權益資產運用。</li>\
                                        <li>證券表決權之行使，除法規另有規定，或另經委託人事前書面指示，且應依委託人及受託人雙方同意之條件、補償及支付費用成本外，受託人無義務就委託人投資之投資標的行使相關表決權或其他選擇權。受託人就股權委託書或其他相關文件無任何責任或義務，亦無庸就該項事宜通知委託人。</li>\
                                        <li>委託人了解並同意，倘因資訊系統故障或線路中斷而無法立即修復時，受託人得暫停受理委託服務。委託人對於非因受託人之故意或重大過失所產生之相關風險所造成之損失(包括但不限於電腦系統故障或斷線)，委託人不得對受託人主張任何權利或要求損害賠償或負連帶責任。</li>\
                                        <li><span class="undLine tB">受託人按一般作業流程將交易指示輸入系統，並經確認委託成功後，委託申請始得生效，不以申請提出之時點為準，委託申請將即時於已開盤之交易所營業時間內或隨後即將開盤之交易所營業時間開始時送達。</span>若因(1)辦理交割、(2)匯率、(3)利率變動、或(4)其他市場環境因素而產生之一切損失，或因發行公司、交易所或相關機構(如國內外保管機構、投資顧問、證券商、簽證機構、會計師、律師等)一切作為或不作為(包括但不限於電腦系統故障或斷線)所致之損失，受託人不負任何責任。</li>\
                                        <li>委託人不得因ETF及境外股票(含特別股)之掛牌交易所休市，或命令停止交易，或相關機構所在地之放假日或被命令暫停營業等情事，致委託人指示之投資或買賣等交易無法立即執行，而對受託人主張任何權利或要求損害賠償或負連帶責任。</li>\
                                        <li>對於因天災、事變、戰爭、暴動或外國政府、權力機構或政治團體之扣押、徵收、沒收、毀損或其他行為，或該地區法令變更、解釋、適用或其他不可歸責於受託人之不可抗力事由所致信託財產之損失、滅失或凍結等，受託人不須負任何責任。</li>\
                                        <li>因受託人受託買賣ETF及境外股票(含特別股)為在外國交易所公開交易之標的，個別商品之公開資訊可由公開資訊網站上獲得，委託人應自行瞭解擬投資或已投資商品及其發行機構之相關資訊。委託人同意並了解，縱受託人通知委託人所投資之ETF及境外股票(含特別股)相關變動資訊，亦不得視為受託人即負有監督及通知ETF及境外股票(含特別股)交易變動資訊予委託人之義務。</li>\
                                        <li>本特約條款變更，<span class="undLine tB">委託人同意受託人得以營業場所公告、網站公告、電話通知、書面通知、電子郵件、帳單列印寄送、自動櫃員機螢幕顯示或報紙公告等任一方式通知，委託人如對通知內容有所異議，請於通知後七日內向受託人為之。委託人於通知後七日內，如未終止合約並繼續與受託人為業務往來者，即視為同意並願遵守變更後之特約條款。</span></li>\
                                        <li>本特約條款約定事項係委託人與受託人簽訂之帳戶往來暨相關服務總約定書或相關特定金錢信託契約特別約定條款；本特約條款未約定事項，則依帳戶往來暨相關服務總約定書或相關特定金錢信託契約、或其他相關約定辦理。</li>\
                                        <li><span class="undLine tB">本信託資金不屬於存款保險保障之範圍</span>，受託人不保證信託資金盈虧及最低收益。一切風險(包括投資風險及其他風險)均由委託人負擔，且不得以任何理由要求受託人分擔損失。</li>\
                                        <li>委託人茲確認已詳讀本次交易簽署之「元大商業銀行特定金錢信託境外股權商品買進暨賣出申請書」及相關資料，委託人已瞭解上述條款並願遵守，且基於其獨立審慎之判斷而投資ETF及境外股票(含特別股)。</li>\
                                      </ul>\
                                    </div>\
                                    <div class="title_blk_3">二、	投資風險揭露說明</div>\
                                    <ul class="doc_num3" style="margin-bottom: 0px;">\
                                      <li><span class="undLine">市場風險：就所投資標的及所投資交易市場之不同，委託人應瞭解其特性及風險。委託人應瞭解投資標的係於國外證券市場交易，交易之進行須遵照當地國家之法令及交易市場之規定辦理，其或與我國證券交易法之法規不同(如：部分外國交易所無漲跌幅之限制等)，保護之程度亦有異，委託人除有義務遵守我國政府及自律機構之法律、規則及規範外，亦有義務遵守當地法令及交易市場規定、規章及慣例。</span></li>\
                                      <li><span class="undLine">交割風險：ETF及境外股票(含特別股)之交易所所在地，如遇緊急特殊情形、市場變動因素或逢例假日而改變交割規定，將導致暫時無法交割或交割延誤。</span></li>\
                                      <li><span class="undLine">追蹤誤差風險：由於ETF的基金發行公司會向基金持有人收取管理費用、加上基金資產與追蹤指數成分股之間存在少許差異、或是持有非於公開市場交易之衍生性商品，皆可能會造成ETF的資產淨值與股價指數間存在些許落差之風險。</span></li>\
                                      <li><span class="undLine">折溢價風險：ETF在證券交易所的交易價格可能因市場追價因素，使市價不同於淨值而產生折溢價的情形。</span></li>\
                                      <li><span class="undLine">槓桿風險：具有槓桿效果之ETF，其單日投資報酬率將會倍數於標的指數(Benchmark)之漲跌幅，且基金經理人會每天調整其曝險部位，以達到每日追蹤其標的指數(Benchmark)之倍數效果。在複利效果下，具有槓桿效果之ETF之長期績效與標的指數(Benchmark)之長期績效將產生落差，其投資報酬率非為倍數於標的指數(Benchmark)之漲跌幅。僅適合充分了解商品特性之客戶短期投資，不適合長期持有。</span></li>\
                                      <li><span class="undLine">放空風險：具有放空效果之ETF，其單日投資報酬率將與標的指數(Benchmark)之漲跌幅呈相反方向變動，且基金經理人會每天調整其曝險部位，以達到每日追蹤其標的指數(Benchmark)之反向效果。在複利效果下，具有放空效果之ETF之長期績效與標的指數(Benchmark)之長期績效將產生落差，其投資報酬率非為標的指數(Benchmark)漲跌幅之反向倍數。僅適合充分了解商品特性之客戶短期投資，不適合長期持有。</span></li>\
                                      <li><span class="undLine">期貨交易風險：槓桿型、放空型、商品型之ETF，因操作策略或避險需求須透過期貨或衍生性商品交易來完成，僅須支付契約價值一定百分比之保證金，故具有高槓桿特性而使獲利放大或損失倍增，使ETF價格短期內出現較大波動。</span></li>\
                                      <li><span class="undLine">流動性風險：若市場成交量於ETF及境外股票(含特別股)委託交易當日發生不足的情況，或交易已達交易對手核给受託人之當日核定額度上限，則當日之委託交易可能發生不成功之情形。</span></li>\
                                      <li><span class="undLine">匯兌風險：ETF及境外股票(含特別股)屬外幣計價之投資產品，若委託人於投資之初係以非本產品計價幣別之資金承作本商品者，需留意外幣之孳息及原始投資金額贖回時，轉換回原幣資產時將可能產生低於投資本金之匯兌風險。</span></li>\
                                      <li><span class="undLine">RQFII 額度風險：RQFII ETF的基金經理受RQFII額度限制。若ETF基金經理的投資額達到RQFII額度上限，且未能增加額度或未能及時增加額度，增設ETF單位的機制可能受阻，導致ETF出現市價大於淨值的現象，即產生追蹤誤差風險。</span></li>\
                                      <li><span class="undLine">交易對手風險：各國對ETF商品之法令規範不同，致使投資架構有所差異。若ETF商品之投資部位有涉及衍生性商品時，恐因交易一方無法達成交易合約中所承諾之報酬而產生之風險，此時將影響ETF商品之投資績效。</span></li>\
                                      <li><span class="undLine">投資集中風險：若ETF投資在某商品或國家，將無法達到分散投資的目的。</span></li>\
                                      <li><span class="undLine">最大可能損失：ETF及境外股票(含特別股)交易之最大可能損失為全部之信託本金。</span></li>\
                                      <li><span class="undLine">信用風險：委託人須承擔境外股票(含特別股)發行機構之信用風險；而「信用風險」之評估，端視委託人對於發行機構信用評等價值之評估；若發行機構發生信用風險相關之違約事件，委託人可能完全損失投資本金且不獲得任何配息，且受託人不承諾或保證任何投資本金及配息。</span></li>\
                                      <li><span class="undLine">下市風險：投資標的可能因各種原因而遭下市，委託人須承擔投資標的下市之損失，最差情況下，委託人可能損失全部之信託本金。</span></li>\
                                      <li><span class="undLine">提早收盤與停止交易風險：ETF及境外股票(含特別股)掛牌交易所或市場有提早收盤或發布停止交易的特殊機制，將限制本商品買進或賣出，除影響流動性外，ETF及境外股票(含特別股)實際的成交價格將可能導致委託人交易損失。</span></li>\
                                      <li><span class="undLine">經營風險：境外股票(含特別股)發行公司經營上受到景氣變動或公司經營方針錯誤、財務操作或調度失當等影響，導致其業績衰退、公司財務不健全等，進而影響公司股票價格下跌。</span></li>\
                                      <li><span class="undLine">行業風險：一個特定行業的環境變化可能帶來高風險，導致與該行業相關的公司股票價格下跌。</span></li>\
                                      <li><span class="undLine">稅賦風險：受託人在所適用法律規定應予預扣的情況下，將依相關稅法規定，於付款時辦理扣繳。若日後因稅法變更，委託人之稅賦將依相關法令規定辦理，委託人之收益將可能不等同於買進時之預期。</span></li>\
                                      <li><span class="undLine">其他說明：</span></li>\
                                    </ul>\
                                    <div class="level2">\
                                      <ul class="doc_num">\
                                        <li class=""><span class="undLine tB">委託人投資ETF及境外股票(含特別股)，係基於獨立審慎之判斷後自行決定，並應於投資前明瞭所投資標的可能產生之(包括但不限於)國家、利率、流動性、提前解約、匯兌、通貨膨脹、交割、再投資、個別事件、稅賦、信用及受連結標的影響等風險，受託人對ETF及境外股票(含特別股)不為任何投資獲利或保本之保證。</span></li>\
                                        <li><span class="undLine tB">投資ETF及境外股票(含特別股)，係以外國貨幣交易，因此，除實際交易產生損益外，尚須負擔匯率風險，且投資標的可能因利率、匯率、有價證券市價或其他指標之變動，有直接導致本金損失或超過當時本金損失之虞。</span></li>\
                                        <li><span class="tB">上述揭露風險預告僅例示重要部分，無法對所有投資風險及影響市場之因素逐項詳述，建議委託人於交易前詳閱公開說明書，並應充分了解相關投資風險及其他可能影響投資報酬之因素，自行衡量本身財務狀況及風險承受程度，以免因交易而遭到無法承受之損失。</span></li>\
                                        <li><span class="tB">ETF依投資策略為投資或持有現貨、期貨、選擇權、交換合約或其他衍生性金融商品等金融工具者，須注意該等ETF因投資標的及投資技術特殊可能產生的風險，例如現貨或期貨投資風險及追蹤誤差之風險、現貨投資與期貨投資價格劇烈變化風險、期貨投資正逆價差或到期換約等風險；槓桿型、放空型ETF則以追求標的指數單日報酬表現為目標，投資盈虧深受市場波動與複利效果影響，與傳統指數股票型基金不同，長期持有時其累積報酬可能偏離基金投資目標，不適合追求長期投資且不熟悉ETF以追求單日報酬為投資目標之投資人。</span></li>\
                                        <li><span class="tB">ETF多為被動型式管理，重點在特定指數的連動，經理人並不主動選股或在逆勢中採取防禦措施。少數ETF為主動式管理，特色在不追蹤特定指數，也不複製或模擬任何指數表現，由基金經理人主動選股。投資前，請確實了解上述ETF特性，並審慎評估投資風險。</span></li>\
                                      </ul>\
                                    </div>\
                                    <p class="tB">※境外指數股票基金商品簡介投資人可於元大銀行官方網站查詢。</p>\
                                    <a id="investorsLink" class="contract_link" href="javascript:void(0)">https://yuantabank.moneydj.com/ifpage.html?sUrl=$ETFWEB$HTML$ET081001]DJHTM?|CID}ALL</a>\
                                    <p class="tB">※境外股票之商品簡介投資人可於元大銀行官方網站查詢。</p>\
                                    <a id="stockInfoLink" class="contract_link" href="javascript:void(0)">https://yuantabank.moneydj.com/ifpage.html?sUrl=$W$STOCK$STOCKLIST]DJHTM{A}US</a>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="check_rule checkbox_bottom">\
                          <div class="iAgree">\
                            <input type="checkbox" id="riskInfo"/>\
                            <label for="riskInfo"><span></span>我已於7日合理期間內閱讀本預告書同意並接受本產品之相關交易條件。</label>\
                            <div class="check_plz">請勾選已審閱特定金錢信託投資境外指數股票型基金(ETF)/ 境外股票(含特別股)特約事項暨風險預告書</div>\
                          </div>\
                        </div>\
                    </div>\
                </div>\
                <div class="fixBot">\
                    <div class="scroll_plz"><a href="javascript:void(0);" id="goBot"></a>請滑動頁面至底部詳閱本條款完整內容</div>\
                    <p class="supplement_tc">我已閱讀並了解以上所載之內容</p>\
                    <div id="confirm" class="bot_btn_set invalid">\
                        <div class="single"><a href="javascript:void(0)"></a>同意</div>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>';
    var $popup = jq(html);

    var hideScrollToBottomTips = function () {
      var $selector = jq(set.selector);
      $selector.find('.fixBot .bot_btn_set').removeClass('invalid');
      $selector.find('.scroll_plz').addClass('pass');
    };

    var setData = function () {
      if (set.isSign) {
        set.isScrollToBottom = true;
        hideScrollToBottomTips();
      }
      setEvent();
    };

    var setEvent = function () {
      var $selector = jq(set.selector);
      var $goBot = $selector.find('#goBot');
      var $contractContent = $selector.find('#contractContent');
      var $confirm = $selector.find('#confirm a');
      var $popupClose = $selector.find('.popup_close');
      var $riskInfo = $selector.find('#riskInfo');
      var $investorsLink = $selector.find('#investorsLink');
      var $stockInfoLink = $selector.find('#stockInfoLink');

      $goBot.off().on('click', function (e) {
        e.stopPropagation();
        set.isScrollToBottom = true;
        var height = document.getElementById('contractContent').scrollHeight;
        $contractContent.animate({ scrollTop: height }, 1000);
      });

      $contractContent.off().on('scroll', function () {
        var cHeight = document.getElementById('contractContent').clientHeight;
        var sHeight = document.getElementById('contractContent').scrollHeight;
        var sTop = document.getElementById('contractContent').scrollTop;

        if (cHeight + sTop >= sHeight - 50) {
          set.isScrollToBottom = true;
          hideScrollToBottomTips();
        }
      });

      $riskInfo.off().on('click', function (e) {
        e.stopPropagation();
        var $this = jq(this);
        var isChecked = $this.prop('checked');
        set.riskInfoCheckStatus = isChecked;
        $this.parent().removeClass('org_warn');
      });
      if (set.isSign) {
        $riskInfo.click();
      }

      var valid = function () {
        var result = true;
        if (!set.isScrollToBottom) {
          result = false;
        }
        if (!set.riskInfoCheckStatus) {
          $riskInfo.parent().addClass('org_warn');
          result = false;
        }
        return result;
      };

      $confirm.off().on('click', function (e) {
        e.stopPropagation();
        if (!valid()) {
          var $popupContent = $selector.find('.popup_content');
          var $checkRule = $selector.find('.check_rule');
          $popupContent.animate({ scrollTop: $checkRule.offset().top - ($popupContent.offset().top - $popupContent.scrollTop()) }, 500);
          return;
        }

        interface.close();
        event.confirm(set);
      });

      $popupClose.off().on('click', function (e) {
        e.stopPropagation();
        interface.close();
        event.popupClose();
      });

      $investorsLink.off().on('click', function (e) {
        e.stopPropagation();
        var url = 'https://yuantabank.moneydj.com/ifpage.html?sUrl=$ETFWEB$HTML$ET081001]DJHTM?|CID}ALL';
        This.commonService.OpenURL(url);
      });

      $stockInfoLink.off().on('click', function (e) {
        e.stopPropagation();
        var url = 'https://yuantabank.moneydj.com/ifpage.html?sUrl=$W$STOCK$STOCKLIST]DJHTM{A}US';
        This.commonService.OpenURL(url);
      });
    };

    var set = {
      selector: '',
      isSign: false,
      riskInfoCheckStatus: false
    };
    var event = {
      confirm: function () {},
      popupClose: function () {}
    };
    var interface = {
      open: function () {
        location.replace(set.selector);
        yuantaApp.gettransarr();
        yuantaApp.popupResize(set.selector.replace('#', ''));
        return interface;
      },
      close: function () {
        jq(set.selector).empty();
        location.replace('#');
        yuantaApp.gettransarr();
        return interface;
      }
    };
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $popup.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //PFXX-產品說明書暨風險預告書及特別股申購聲明書
  StockSubscriptionComponent.prototype.StockPFXXRiskPopup = function () {
    var html =
      '<div class="popup newBlock">\
        <div class="popup_close" tabindex="0" data-aria="cancel">\
            <img src="images/menu_back.png" role="button" alt="" />\
        </div>\
        <div class="popup_title background_base bg_blue">\
            <span>個股申購</span>\
        </div>\
        <div id="contractContent" class="popup_content">\
            <div class="wrapper">\
                <div class="inside">\
                    <div class="content">\
                        <div class="process">\
                            <div class="done">資料填寫</div>\
                            <div class="on">同意簽署</div>\
                            <div class="">交易確認</div>\
                        </div>\
                        <div class="document_area">\
                            <div class="document_tt"><span id="pfxxNo1"></span>-產品說明書暨風險預告書及特別股申購聲明書\
                                <div class="deco">\
                                  <div></div>\
                                  <div></div>\
                                  <div></div>\
                                  <div></div>\
                                  <div></div>\
                                </div>\
                            </div>\
                            <div class="check_rule">\
                              <div class="iAgree">\
                                <input type="checkbox" id="pfxxInfo"/>\
                                <label for="pfxxInfo"><span></span>我已於7日合理期間內，於元大銀行官網閱覽<br><a id="pfxxInfoLink" href="javascript:void(0)">「<span id="pfxxNo2" class="not_label"></span>-產品說明書暨風險預告書」</a>同意並接受本產品之相關交易條件。</label>\
                                <div class="check_plz">請勾選此題</div>\
                              </div>\
                              <div class="iAgree">\
                                <input type="checkbox" id="illegalCheckAgree"/>\
                                <label for="illegalCheckAgree"><span></span>(一) 無涉及洗錢及不法交易聲明書<br>本人茲聲明本投資並無涉及洗錢及不法交易，且完全遵守中華民國「洗錢防制法」等相關法規之規範，特立此書為憑。</label>\
                                <div class="check_plz">請勾選此題</div>\
                              </div>\
                              <div class="iAgree">\
                                <input type="checkbox" id="advanceCheckAgree"/>\
                                <label for="advanceCheckAgree"><span></span>(二) 瞭解提前買回風險聲明書<br>本人茲聲明瞭解確知特別股之發行機構得行使提前買回權利，若發行機構行使提前買回權利，將縮短預期的投資期限，且依面額或公開說明書訂定之價格買回，非以投資人(委託人)之申購成本買回，當申購成本高於發行機構提前買回價格時，將會產生資本利損，特立此書為憑。</label>\
                                <div class="check_plz">請勾選此題</div>\
                              </div>\
                            </div><br>\
                            <div class="document_in">\
                                <div class="stage">\
                                  <p>＊投資人於簽署本聲明書前，對相關事宜若有疑問，請逕洽詢營業單位，由專人詳予解說。</p>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
                <div class="fixBot">\
                    <p class="supplement_tc">我已閱讀並了解以上所載之內容</p>\
                    <div id="confirm" class="bot_btn_set invalid">\
                        <div class="single"><a href="javascript:void(0)"></a>同意</div>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>';
    var $popup = jq(html);

    var hideScrollToBottomTips = function () {
      var $selector = jq(set.selector);
      $selector.find('.fixBot .bot_btn_set').removeClass('invalid');
      $selector.find('.scroll_plz').addClass('pass');
    };

    var setData = function () {
      var $selector = jq(set.selector);
      var $pfxxNo1 = $selector.find('#pfxxNo1');
      var $pfxxNo2 = $selector.find('#pfxxNo2');
      var trustNo = set.trustNo;
      $pfxxNo1.text(trustNo);
      $pfxxNo2.text(trustNo);

      set.isScrollToBottom = true;
      hideScrollToBottomTips();
      setEvent();
    };

    var setEvent = function () {
      var $selector = jq(set.selector);
      var $confirm = $selector.find('#confirm a');
      var $popupClose = $selector.find('.popup_close');
      var $pfxxInfo = $selector.find('#pfxxInfo');
      var $pfxxInfoLink = $selector.find('#pfxxInfoLink');
      var $illegalCheckAgree = $selector.find('#illegalCheckAgree');
      var $advanceCheckAgree = $selector.find('#advanceCheckAgree');

      $pfxxInfo.off().on('click', function (e) {
        e.stopPropagation();
        var $this = jq(this);
        if (set.isSign) {
          var isChecked = $this.prop('checked');
          set.pfxxInfoCheckStatus = isChecked;
          $this.parent().removeClass('org_warn');
        } else {
          if (!set.clickPfxxInfoLink) {
            $pfxxInfo.prop('checked', false);
            $pfxxInfoLink.click();
          } else {
            var isChecked = $this.prop('checked');
            set.pfxxInfoCheckStatus = isChecked;
            $this.parent().removeClass('org_warn');
          }
        }
      });
      if (set.isSign) {
        $pfxxInfo.click();
      }
      $pfxxInfoLink.off().on('click', function (e) {
        e.stopPropagation();
        set.clickPfxxInfoLink = true;
        var trustNo = set.trustNo;
        var url = 'https://www.yuantabank.com.tw/bankwebIMG/dwn/fundclear/SpecialStockProspectus_' + trustNo + '.pdf'; //正式
        yuantaApp.openURL(url);
      });

      $advanceCheckAgree.off().on('click', function (e) {
        e.stopPropagation();
        var $this = jq(this);
        var isChecked = $this.prop('checked');
        set.advanceCheckAgreeStatus = isChecked;
        $this.parent().removeClass('org_warn');
      });
      if (set.isSign) {
        $advanceCheckAgree.click();
      }

      $illegalCheckAgree.off().on('click', function (e) {
        e.stopPropagation();
        var $this = jq(this);
        var isChecked = $this.prop('checked');
        set.illegalCheckAgreeStatus = isChecked;
        $this.parent().removeClass('org_warn');
      });
      if (set.isSign) {
        $illegalCheckAgree.click();
      }

      var valid = function () {
        var result = true;
        if (!set.isScrollToBottom) {
          result = false;
        }
        if (!set.pfxxInfoCheckStatus) {
          $pfxxInfo.parent().addClass('org_warn');
          result = false;
        }
        if (!set.advanceCheckAgreeStatus) {
          $advanceCheckAgree.parent().addClass('org_warn');
          result = false;
        }
        if (!set.illegalCheckAgreeStatus) {
          $illegalCheckAgree.parent().addClass('org_warn');
          result = false;
        }
        return result;
      };

      $confirm.off().on('click', function (e) {
        e.stopPropagation();
        if (!valid()) {
          var $popupContent = $selector.find('.popup_content');
          var $checkRule = $selector.find('.check_rule');
          $popupContent.animate({ scrollTop: $checkRule.offset().top - ($popupContent.offset().top - $popupContent.scrollTop()) }, 500);
          return;
        }

        interface.close();
        event.confirm(set);
      });

      $popupClose.off().on('click', function (e) {
        e.stopPropagation();
        interface.close();
        event.popupClose();
      });
    };

    var set = {
      selector: '',
      isSign: false,
      trustNo: '',
      isScrollToBottom: false,
      clickPfxxInfoLink: false,
      pfxxInfoCheckStatus: false,
      advanceCheckAgreeStatus: false,
      illegalCheckAgreeStatus: false
    };
    var event = {
      confirm: function () {},
      popupClose: function () {}
    };
    var interface = {
      open: function () {
        location.replace(set.selector);
        yuantaApp.gettransarr();
        yuantaApp.popupResize(set.selector.replace('#', ''));
        return interface;
      },
      close: function () {
        jq(set.selector).empty();
        location.replace('#');
        yuantaApp.gettransarr();
        return interface;
      }
    };
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $popup.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //客戶審慎評估投資聲明書
  StockSubscriptionComponent.prototype.StockInterestByUserPopup = function () {
    var html =
      '<div class="popup newBlock">\
        <div class="popup_close" tabindex="0" data-aria="cancel">\
            <img src="images/menu_back.png" role="button" alt="" />\
        </div>\
        <div class="popup_title background_base bg_blue">\
            <span>個股申購</span>\
        </div>\
        <div id="contractContent" class="popup_content">\
            <div class="wrapper">\
                <div class="inside">\
                    <div class="content">\
                        <div class="process">\
                            <div class="done">資料填寫</div>\
                            <div class="on">同意簽署</div>\
                            <div class="">交易確認</div>\
                        </div>\
                        <div class="document_area checkbox_bottom">\
                            <div class="document_tt">客戶審慎評估投資聲明書\
                                <div class="deco">\
                                  <div></div>\
                                  <div></div>\
                                  <div></div>\
                                  <div></div>\
                                  <div></div>\
                                </div>\
                            </div>\
                            <div class="document_in">\
                                <div class="stage">\
                                    <p>本人已充分瞭解本商品具有  貴公司所告知可能造成本商品之價格大幅波動的風險，包括但不限於以下所列風險：</p><br>\
                                    <ul class="doc_num">\
                                      <li>本商品可能投資或連結特定經濟、產業環境波動較大、風險較高之國家、產業，或本商品發行人可能於該等國家營運或從事該等產業。</li>\
                                      <li>本商品、本商品之部分或全部投資標的/連結標的或保證人之信用評等可能屬非投資等級。</li>\
                                      <li>本商品投資人在特定情形下，可能必須較本商品發行人之債權人、股東優先承受特定損失，或本商品之投資標的或連結標的具有該等性質。</li>\
                                      <li>本商品之計價幣別或其投資標的/連結標的之計價幣別可能有匯率波動較大情形。</li>\
                                      <li>本商品相關文件上所載之其他風險。</li>\
                                    </ul>\
                                    <p>本人茲此聲明：本人業已審閱本商品之相關商品說明資訊，經審慎評估個人資產規劃安排及風險承受度後，係自行決定向  貴公司辦理本商品之投資，並非基於  貴公司之推薦，且經 貴公司充分揭露及說明後，本人已瞭解本商品具不保本之特性及其相關投資風險，本人願就本商品之投資自行承擔損益。</p>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="check_rule checkbox_bottom">\
                          <div class="iAgree">\
                            <input type="checkbox" id="interestInfo"/>\
                            <label for="interestInfo"><span></span>我已於7日合理期間內閱讀本預告書同意並接受本產品之相關交易條件。</label>\
                            <div class="check_plz">請勾選已審閱客戶審慎評估投資聲明書</div>\
                          </div>\
                        </div>\
                    </div>\
                </div>\
                <div class="fixBot">\
                    <div class="scroll_plz"><a href="javascript:void(0);" id="goBot"></a>請滑動頁面至底部詳閱本條款完整內容</div>\
                    <p class="supplement_tc">我已閱讀並了解以上所載之內容</p>\
                    <div id="confirm" class="bot_btn_set invalid">\
                        <div class="single"><a href="javascript:void(0)"></a>同意</div>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>';
    var $popup = jq(html);

    var hideScrollToBottomTips = function () {
      var $selector = jq(set.selector);
      $selector.find('.fixBot .bot_btn_set').removeClass('invalid');
      $selector.find('.scroll_plz').addClass('pass');
    };

    var setData = function () {
      if (set.isSign) {
        set.isScrollToBottom = true;
        hideScrollToBottomTips();
      }
      setEvent();
    };

    var setEvent = function () {
      var $selector = jq(set.selector);
      var $goBot = $selector.find('#goBot');
      var $contractContent = $selector.find('#contractContent');
      var $confirm = $selector.find('#confirm a');
      var $popupClose = $selector.find('.popup_close');
      var $interestInfo = $selector.find('#interestInfo');

      $goBot.off().on('click', function (e) {
        e.stopPropagation();
        set.isScrollToBottom = true;
        var height = document.getElementById('contractContent').scrollHeight;
        $contractContent.animate({ scrollTop: height }, 1000);
      });

      $contractContent.off().on('scroll', function () {
        var cHeight = document.getElementById('contractContent').clientHeight;
        var sHeight = document.getElementById('contractContent').scrollHeight;
        var sTop = document.getElementById('contractContent').scrollTop;

        if (cHeight + sTop >= sHeight - 50) {
          set.isScrollToBottom = true;
          hideScrollToBottomTips();
        }
      });

      $interestInfo.off().on('click', function (e) {
        e.stopPropagation();
        var $this = jq(this);
        var isChecked = $this.prop('checked');
        set.interestInfoCheckStatus = isChecked;
        $this.parent().removeClass('org_warn');
      });
      if (set.isSign) {
        $interestInfo.click();
      }

      var valid = function () {
        var result = true;
        if (!set.isScrollToBottom) {
          result = false;
        }
        if (!set.interestInfoCheckStatus) {
          $interestInfo.parent().addClass('org_warn');
          result = false;
        }
        return result;
      };

      $confirm.off().on('click', function (e) {
        e.stopPropagation();
        if (!valid()) {
          var $popupContent = $selector.find('.popup_content');
          var $checkRule = $selector.find('.check_rule');
          $popupContent.animate({ scrollTop: $checkRule.offset().top - ($popupContent.offset().top - $popupContent.scrollTop()) }, 500);
          return;
        }

        interface.close();
        event.confirm(set);
      });

      $popupClose.off().on('click', function (e) {
        e.stopPropagation();
        interface.close();
        event.popupClose();
      });
    };

    var set = {
      selector: '',
      isSign: false,
      isScrollToBottom: false,
      interestInfoCheckStatus: false
    };
    var event = {
      confirm: function () {},
      popupClose: function () {}
    };
    var interface = {
      open: function () {
        location.replace(set.selector);
        yuantaApp.gettransarr();
        yuantaApp.popupResize(set.selector.replace('#', ''));
        return interface;
      },
      close: function () {
        jq(set.selector).empty();
        location.replace('#');
        yuantaApp.gettransarr();
        return interface;
      }
    };
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $popup.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //金融商品投資風險告知書
  StockSubscriptionComponent.prototype.StockInvestmentRiskPopup = function () {
    var html =
      '<div class="popup newBlock">\
        <div class="popup_close" tabindex="0" data-aria="cancel">\
            <img src="images/menu_back.png" role="button" alt="" />\
        </div>\
        <div class="popup_title background_base bg_blue">\
            <span>個股申購</span>\
        </div>\
        <div id="contractContent" class="popup_content">\
            <div class="wrapper">\
                <div class="inside">\
                    <div class="content">\
                        <div class="process">\
                            <div class="done">資料填寫</div>\
                            <div class="on">同意簽署</div>\
                            <div class="">交易確認</div>\
                        </div>\
                        <div class="document_area checkbox_bottom">\
                            <div class="document_tt">金融商品投資風險告知書\
                                <div class="deco">\
                                  <div></div>\
                                  <div></div>\
                                  <div></div>\
                                  <div></div>\
                                  <div></div>\
                                </div>\
                            </div>\
                            <div class="document_in">\
                                <div class="stage">\
                                  <p>親愛的客戶您好，為了保障您的權益，請您詳閱以下金融商品投資風險重要須知內容：</p><br>\
                                  <ul class="doc_num">\
                                    <li>您所投資的商品非存款，具有投資風險，不受存款保險保障。其中最大可能損失為損失所有本金及可能之配息，故您須自負盈虧。投資標的以往之績效不代表未來之績效表現，亦不保證投資標的之最低收益。</li>\
                                    <li>您於交易前已確實詳閱投資標的之相關資料及其規定，並瞭解其投資風險（包括但不限於可能發生之投資標的跌價、匯兌風險、利率風險、信用風險、流動性風險及市場風險等）及相關費用，且您係基於獨立審慎之投資判斷後決定投資指示。</li>\
                                    <li>本次交易係您依自身需求所決定投資且已充分考量自身與金融商品之適合度，未受本行人員鼓勵或勸誘以貸款、定存解約、保單借款、保單解約或信託商品贖回等方式購買本商品，且完全了解倘以借款、定存解約或原金融商品解約、贖回或舉債等方式投資商品所涉及之風險。</li>\
                                  </ul>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="check_rule checkbox_bottom">\
                          <div class="iAgree">\
                            <input type="checkbox" id="investmentInfo"/>\
                            <label for="investmentInfo"><span></span>我已閱讀並了解已上所載之內容。</label>\
                            <div class="check_plz">請勾選已審閱金融商品投資風險告知書</div>\
                          </div>\
                        </div>\
                    </div>\
                </div>\
                <div class="fixBot">\
                    <p class="supplement_tc">我已閱讀並了解以上所載之內容</p>\
                    <div id="confirm" class="bot_btn_set invalid">\
                        <div class="single"><a href="javascript:void(0)"></a>同意</div>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>';
    var $popup = jq(html);

    var hideScrollToBottomTips = function () {
      var $selector = jq(set.selector);
      $selector.find('.fixBot .bot_btn_set').removeClass('invalid');
      $selector.find('.scroll_plz').addClass('pass');
    };

    var setData = function () {
      set.isScrollToBottom = true;
      hideScrollToBottomTips();
      setEvent();
    };

    var setEvent = function () {
      var $selector = jq(set.selector);
      var $confirm = $selector.find('#confirm a');
      var $popupClose = $selector.find('.popup_close');
      var $investmentInfo = $selector.find('#investmentInfo');

      $investmentInfo.off().on('click', function (e) {
        e.stopPropagation();
        var $this = jq(this);
        var isChecked = $this.prop('checked');
        set.investmentInfoCheckStatus = isChecked;
        $this.parent().removeClass('org_warn');
      });
      if (set.isSign) {
        $investmentInfo.click();
      }

      var valid = function () {
        var result = true;
        if (!set.isScrollToBottom) {
          result = false;
        }
        if (!set.investmentInfoCheckStatus) {
          $investmentInfo.parent().addClass('org_warn');
          result = false;
        }
        return result;
      };

      $confirm.off().on('click', function (e) {
        e.stopPropagation();
        if (!valid()) {
          var $popupContent = $selector.find('.popup_content');
          var $checkRule = $selector.find('.check_rule');
          $popupContent.animate({ scrollTop: $checkRule.offset().top - ($popupContent.offset().top - $popupContent.scrollTop()) }, 500);
          return;
        }

        interface.close();
        event.confirm(set);
      });

      $popupClose.off().on('click', function (e) {
        e.stopPropagation();
        interface.close();
        event.popupClose();
      });
    };

    var set = {
      selector: '',
      isSign: false,
      isScrollToBottom: false,
      investmentInfoCheckStatus: false
    };
    var event = {
      confirm: function () {},
      popupClose: function () {}
    };
    var interface = {
      open: function () {
        location.replace(set.selector);
        yuantaApp.gettransarr();
        yuantaApp.popupResize(set.selector.replace('#', ''));
        return interface;
      },
      close: function () {
        jq(set.selector).empty();
        location.replace('#');
        yuantaApp.gettransarr();
        return interface;
      }
    };
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $popup.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //本人確認聲明
  StockSubscriptionComponent.prototype.StockConfirmStatementPopup = function () {
    var html =
      '<div class="popup newBlock">\
        <div class="popup_close" tabindex="0" data-aria="cancel">\
            <img src="images/menu_back.png" role="button" alt="" />\
        </div>\
        <div class="popup_title background_base bg_blue">\
            <span>個股申購</span>\
        </div>\
        <div id="contractContent" class="popup_content">\
            <div class="wrapper">\
                <div class="inside">\
                    <div class="content">\
                        <div class="process">\
                            <div class="done">資料填寫</div>\
                            <div class="on">同意簽署</div>\
                            <div class="">交易確認</div>\
                        </div>\
                        <div class="document_area checkbox_bottom">\
                            <div class="document_tt">本人確認聲明\
                                <div class="deco">\
                                  <div></div>\
                                  <div></div>\
                                  <div></div>\
                                  <div></div>\
                                  <div></div>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="check_rule checkbox_bottom">\
                          <div class="iAgree">\
                            <input type="checkbox" id="induceInfo"/>\
                            <label for="induceInfo"><span></span>本人茲聲明元大銀行業務人員並未鼓勵或勸誘本人以貸款、定存解約、保單借款、保單解約等方式購買本產品，且完全了解倘以借款或舉債等方式投資產品所涉之風險。</label>\
                            <div class="check_plz">請勾選未經勸誘聲明</div>\
                          </div>\
                          <div class="iAgree">\
                            <input type="checkbox" id="confirmInfo"/>\
                            <label for="confirmInfo"><span></span>為確保客戶權益，元大銀行提醒您：各項申購文件請由您親自填寫，並請親自核對交易明細及對帳單內容，請勿交付存摺印鑑及密碼等財務文件予理專保管，切勿與理專私下有金錢往來或由其代操金融商品。</label>\
                            <div class="check_plz">請勾選本人申購確認聲明</div>\
                          </div>\
                        </div>\
                    </div>\
                </div>\
                <div class="fixBot">\
                    <p class="supplement_tc">我已閱讀並了解以上所載之內容</p>\
                    <div id="confirm" class="bot_btn_set invalid">\
                        <div class="single"><a href="javascript:void(0)"></a>同意</div>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>';
    var $popup = jq(html);

    var hideScrollToBottomTips = function () {
      var $selector = jq(set.selector);
      $selector.find('.fixBot .bot_btn_set').removeClass('invalid');
      $selector.find('.scroll_plz').addClass('pass');
    };

    var setData = function () {
      set.isScrollToBottom = true;
      hideScrollToBottomTips();
      setEvent();
    };

    var setEvent = function () {
      var $selector = jq(set.selector);
      var $confirm = $selector.find('#confirm a');
      var $popupClose = $selector.find('.popup_close');
      var $induceInfo = $selector.find('#induceInfo');
      var $confirmInfo = $selector.find('#confirmInfo');

      $induceInfo.off().on('click', function (e) {
        e.stopPropagation();
        var $this = jq(this);
        var isChecked = $this.prop('checked');
        set.induceInfoCheckStatus = isChecked;
        $this.parent().removeClass('org_warn');
      });
      if (set.isSign) {
        $induceInfo.click();
      }

      $confirmInfo.off().on('click', function (e) {
        e.stopPropagation();
        var $this = jq(this);
        var isChecked = $this.prop('checked');
        set.confirmInfoCheckStatus = isChecked;
        $this.parent().removeClass('org_warn');
      });
      if (set.isSign) {
        $confirmInfo.click();
      }

      var valid = function () {
        var result = true;
        if (!set.isScrollToBottom) {
          result = false;
        }
        if (!set.induceInfoCheckStatus) {
          $induceInfo.parent().addClass('org_warn');
          result = false;
        }
        if (!set.confirmInfoCheckStatus) {
          $confirmInfo.parent().addClass('org_warn');
          result = false;
        }
        return result;
      };

      $confirm.off().on('click', function (e) {
        e.stopPropagation();
        if (!valid()) {
          var $popupContent = $selector.find('.popup_content');
          $popupContent.animate({ scrollTop: 0 }, 100);
          return;
        }

        interface.close();
        event.confirm(set);
      });

      $popupClose.off().on('click', function (e) {
        e.stopPropagation();
        interface.close();
        event.popupClose();
      });
    };

    var set = {
      selector: '',
      isSign: false,
      isScrollToBottom: false,
      induceInfoCheckStatus: false,
      confirmInfoCheckStatus: false
    };
    var event = {
      confirm: function () {},
      popupClose: function () {}
    };
    var interface = {
      open: function () {
        location.replace(set.selector);
        yuantaApp.gettransarr();
        yuantaApp.popupResize(set.selector.replace('#', ''));
        return interface;
      },
      close: function () {
        jq(set.selector).empty();
        location.replace('#');
        yuantaApp.gettransarr();
        return interface;
      }
    };
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $popup.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //敬請詳閱投資風險重要須知
  StockSubscriptionComponent.prototype.StocCareQuestionnairePopup = function () {
    var html =
      '<div class="popup newBlock">\
          <div class="popup_close" tabindex="0" data-aria="cancel">\
              <img src="images/menu_back.png" role="button" alt="" />\
          </div>\
          <div class="popup_title background_base bg_blue">\
              <span>個股申購</span>\
          </div>\
          <div id="contractContent" class="popup_content">\
              <div class="wrapper">\
                  <div class="inside">\
                      <div class="content">\
                          <div class="process">\
                              <div class="done">資料填寫</div>\
                              <div class="on">同意簽署</div>\
                              <div class="">交易確認</div>\
                          </div>\
                          <div class="line_area">\
                              <section>\
                                  <div class="document_area">\
                                    <div class="document_tt">敬請詳閱投資風險重要須知\
                                        <div class="deco">\
                                            <div></div>\
                                            <div></div>\
                                            <div></div>\
                                            <div></div>\
                                            <div></div>\
                                        </div>\
                                    </div>\
                                    <div class="check_rule">\
                                      <div class="iAgree">\
                                        <input type="checkbox" id="infoAgree"/>\
                                        <label for="infoAgree"><span></span>我瞭解現在所辦理的<span class="key_org not_label">是金融商品投資，不是存款業務</span>；投資具有風險，<span class="key_org not_label">沒有本金或配息的保證，最大可能損失為所有本金</span>，須自負盈虧。</label>\
                                        <div class="check_plz">請勾選此題</div>\
                                      </div>\
                                      <div class="iAgree">\
                                        <input type="checkbox" id="riskkAgree"/>\
                                        <label for="riskkAgree"><span></span>我已詳閱所投資商品的相關資料及規定，並<span class="key_org not_label">瞭解投資風險及相關費用</span>。</label>\
                                        <div class="check_plz">請勾選此題</div>\
                                      </div>\
                                      <div class="iAgree">\
                                        <input type="checkbox" id="induceAgree"/>\
                                        <label for="induceAgree"><span></span>本次交易我<span class="key_org not_label">未受貴行人員鼓勵或勸誘以貸款、定存解約、保單借款、保單解約或信託商品贖回等方式購買本商品</span>。</label>\
                                        <div class="check_plz">請勾選此題</div>\
                                      </div>\
                                    </div><br>\
                                    <div id="questionArea" class="none">\
                                      <div id="question" class="title_blk_3"></div>\
                                      <div class="input_box">\
                                          <input id="questionInput" type="tel" placeholder="請輸入數字驗證答案" maxlength="10" style="width:100%;"/>\
                                      </div>\
                                      <p id="warnMessage" class="supplement c_org none">請填答數字驗證</p>\
                                    </div>\
                                  </div>\
                              </section>\
                          </div>\
                      </div>\
                  </div>\
                  <div class="fixBot">\
                      <p class="supplement_tc key_red">提醒您 : 若您對於商品適合度有疑慮，請點擊「取消交易」，轉洽臨櫃辦理，將有專人為您服務。</p>\
                      <div id="confirm" class="bot_btn_set invalid">\
                          <div class="two n_left"><a href="javascript:void(0)"></a>取消交易</div>\
                          <div class="two n_right"><a href="javascript:void(0)"></a>下一步</div>\
                      </div>\
                  </div>\
              </div>\
          </div>\
      </div>';
    var $popup = jq(html);
    var hideScrollToBottomTips = function () {
      var $selector = jq(set.selector);
      $selector.find('.fixBot .bot_btn_set').removeClass('invalid');
      $selector.find('.scroll_plz').addClass('pass');
    };

    //客戶年齡超過85歲
    var isOver85YearsOld = function () {
      return HeaderObject.GetLoginObject().custInfo.age >= 85;
    };

    //算術題目
    var index = 0;
    var setMathQuestion = function () {
      var $selector = jq(set.selector);
      var $question = $selector.find('#question');
      if (index === 0) {
        $question.text('請填寫右列數字驗證答案５+４=');
      } else if (index === 1) {
        $question.text('請填寫右列數字驗證答案３+７=');
      } else {
        $question.text('請填寫右列數字驗證答案１+９=');
      }
    };

    var setData = function () {
      var $selector = jq(set.selector);
      var $questionArea = $selector.find('#questionArea');
      set.isScrollToBottom = true;

      //85(含)歲以上增加算術題目驗證答案
      if (isOver85YearsOld()) {
        $questionArea.removeClass('none');
        setMathQuestion();
      } else {
        $questionArea.remove();
      }

      hideScrollToBottomTips();
      setEvent();
    };

    var setEvent = function () {
      var $selector = jq(set.selector);
      var $confirmLeft = $selector.find('#confirm .n_left');
      var $confirmRight = $selector.find('#confirm .n_right');
      var $contractContent = $selector.find('#contractContent');
      var $popupClose = $selector.find('.popup_close');
      var $infoAgree = $selector.find('#infoAgree');
      var $riskkAgree = $selector.find('#riskkAgree');
      var $induceAgree = $selector.find('#induceAgree');
      var $questionInput = $selector.find('#questionInput');
      var $warnMessage = $selector.find('#warnMessage');

      $contractContent.off().on('scroll', function () {
        var cHeight = document.getElementById('contractContent').clientHeight;
        var sHeight = document.getElementById('contractContent').scrollHeight;
        var sTop = document.getElementById('contractContent').scrollTop;

        if (cHeight + sTop >= sHeight - 50) {
          set.isScrollToBottom = true;
          hideScrollToBottomTips();
        }
      });

      $infoAgree.off().on('click', function (e) {
        e.stopPropagation();
        var $this = jq(this);
        var isChecked = $this.prop('checked');
        set.infoAgreeCheckStatus = isChecked;
        $this.parent().removeClass('org_warn');
      });
      if (set.isSign) {
        $infoAgree.click();
      }

      $riskkAgree.off().on('click', function (e) {
        e.stopPropagation();
        var $this = jq(this);
        var isChecked = $this.prop('checked');
        set.riskkAgreeCheckStatus = isChecked;
        $this.parent().removeClass('org_warn');
      });
      if (set.isSign) {
        $riskkAgree.click();
      }

      $induceAgree.off().on('click', function (e) {
        e.stopPropagation();
        var $this = jq(this);
        var isChecked = $this.prop('checked');
        set.induceAgreeCheckStatus = isChecked;
        $this.parent().removeClass('org_warn');
      });
      if (set.isSign) {
        $induceAgree.click();
      }

      $questionInput.off().on('input change blur', function () {
        var $this = jq(this);
        var value = $this.val();
        if (value) {
          $questionInput.parent().removeClass('warn');
          $warnMessage.addClass('none');
          set.answer = value;
          set.questionInputStatus = true;
        } else {
          set.answer = '';
          set.questionInputStatus = false;
        }
      });

      var valid = function () {
        var result = true;
        if (!set.isScrollToBottom) {
          result = false;
        }
        if (!set.infoAgreeCheckStatus) {
          $infoAgree.parent().addClass('org_warn');
          result = false;
        }
        if (!set.riskkAgreeCheckStatus) {
          $riskkAgree.parent().addClass('org_warn');
          result = false;
        }
        if (!set.induceAgreeCheckStatus) {
          $induceAgree.parent().addClass('org_warn');
          result = false;
        }
        return result;
      };

      var yearVaild = function () {
        var result = true;
        if (set.questionInputStatus) {
          $questionInput.parent().removeClass('warn');
          $warnMessage.addClass('none');
          if (index === 0) {
            if (+set.answer !== 9) {
              index++;
              setMathQuestion();
              result = false;
            }
          } else if (index === 1) {
            if (+set.answer !== 10) {
              index++;
              setMathQuestion();
              result = false;
            }
          } else {
            if (+set.answer !== 10) {
              index++;
              setMathQuestion();
              result = false;
            }
          }
        } else {
          $questionInput.parent().addClass('warn');
          $warnMessage.removeClass('none');
          result = false;
        }
        return result;
      };

      $confirmLeft.off().on('click', function (e) {
        e.stopPropagation();
        yuantaApp.newBlock
          ._commonPopupModule()
          .set('modal', {
            showCloseBtn: true,
            showConfirmBtn: true,
            showCancelBtn: true,
            confirmAddOnClass: false,
            cancelAddOnClass: true,
            confirmText: '保留',
            cancelText: '確定取消'
          })
          .set('modalTitle', '您確定要取消？')
          .event('popupCancel', function () {
            yuantaApp.goFunctionPage(jq('#funcPageContent').data('pageid'), '', '', function () {
              interface.close();
            });
          })
          .appendTo()
          .build()
          .open();
      });

      $confirmRight.off().on('click', function (e) {
        e.stopPropagation();
        var $popupContent = $selector.find('.popup_content');
        if (!valid()) {
          $popupContent.animate({ scrollTop: 0 }, 100);
          return;
        } else if (isOver85YearsOld()) {
          if (!yearVaild()) {
            if (index === 0) {
              $popupContent.animate({ scrollTop: 0 }, 100);
              return;
            } else if (index === 1 || index === 2) {
              yuantaApp.newBlock
                ._commonPopupModule()
                .set('modal', {
                  showCloseBtn: false,
                  showConfirmBtn: true,
                  showCancelBtn: false,
                  confirmAddOnClass: true,
                  cancelAddOnClass: false,
                  confirmText: '確認'
                })
                .set('modalContent', "<span class='key_blue fz-20'>您所填寫的數字驗證不正確，請重新輸入。</span>")
                .event('popupConfirm', function () {
                  $questionInput.val('');
                  set.answer = '';
                })
                .appendTo()
                .build()
                .open();
              $popupContent.animate({ scrollTop: 0 }, 100);
              return;
            } else {
              yuantaApp.newBlock
                ._commonPopupModule()
                .set('modal', {
                  showCloseBtn: false,
                  showConfirmBtn: true,
                  showCancelBtn: false,
                  confirmAddOnClass: true,
                  cancelAddOnClass: false,
                  confirmText: '確認'
                })
                .set(
                  'modalContent',
                  "<span class='key_blue fz-20'>很抱歉，您所填寫的數字驗證不正確，故取消本次申購，如有任何問題歡迎洽詢鄰近分行或您的理財服務專員，謝謝。</span>"
                )
                .event('popupConfirm', function () {
                  if (
                    yuantaApp.checkLogin('_A0440', function () {
                      location.replace('#');
                    })
                  ) {
                    yuantaApp.loadpage('_A0440_01');
                  }
                })
                .appendTo()
                .build()
                .open();
              return;
            }
          } else {
            event.confirm();
            interface.close();
          }
        }
        event.confirm();
        interface.close();
      });

      $popupClose.off().on('click', function (e) {
        e.stopPropagation();
        event.popupClose();
        interface.close();
      });
    };

    var set = {
      selector: '',
      isSign: false,
      isScrollToBottom: false,
      infoAgreeCheckStatus: false,
      riskkAgreeCheckStatus: false,
      induceAgreeCheckStatus: false,
      questionInputStatus: false,
      answer: ''
    };
    var event = {
      confirm: function () {},
      popupClose: function () {}
    };
    var interface = {
      open: function () {
        location.replace(set.selector);
        yuantaApp.gettransarr();
        yuantaApp.popupResize(set.selector.replace('#', ''));
        return interface;
      },
      close: function () {
        jq(set.selector).empty();
        location.replace('#');
        yuantaApp.gettransarr();
        return interface;
      }
    };
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $popup.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //_A0436_01申購確認頁(單筆申購)
  StockSubscriptionComponent.prototype.TransactionConfirmationByOneTimePopup = function () {
    var html =
      '<div class="popup newBlock">\
            <div class="popup_close" tabindex="0" data-aria="cancel">\
                <img src="images/menu_back.png" role="button" alt="" />\
            </div>\
            <div class="popup_title background_base bg_blue">\
                <span>個股申購</span>\
            </div>\
            <div id="contractContent" class="popup_content">\
                <div class="wrapper">\
                    <div class="inside">\
                        <div class="content">\
                            <div class="process">\
                                <div class="done">資料填寫</div>\
                                <div class="done">同意簽署</div>\
                                <div class="on">交易確認</div>\
                            </div>\
                            <div class="line_area">\
                                <section id="subscriptionInfo">\
                                  <div class="subjectTitle">請確認交易資訊</div>\
                                  <div class="subject">\
                                    <div>委託日期</div>\
                                    <div>\
                                      <span id="applyDate" class="f_ty1"></span>\
                                    </div>\
                                  </div>\
                                  <div class="subject">\
                                    <div>市場交易日期</div>\
                                    <div>\
                                      <span id="effectDate" class="f_ty1"></span>\
                                    </div>\
                                  </div>\
                                  <div class="subject">\
                                    <div>投資方式</div>\
                                    <div>\
                                      <span class="f_ty1">單筆申購</span>\
                                    </div>\
                                  </div>\
                                  <div class="subject">\
                                    <div>投資市場</div>\
                                    <div>\
                                      <span id="stockMarket" class="f_ty1"></span>\
                                    </div>\
                                  </div>\
                                  <div class="subject">\
                                    <div>投資幣別</div>\
                                    <div>\
                                      <span id="stockCcy" class="f_ty1"></span>\
                                    </div>\
                                  </div>\
                                  <div class="subject">\
                                    <div>投資商品</div>\
                                    <div>\
                                      <span id="stockName" class="f_ty1"></span>\
                                    </div>\
                                  </div>\
                                  <div class="subject">\
                                    <div>參考盤價</div>\
                                    <div>\
                                      <span id="referPrice" class="f_ty1"></span>\
                                      <span id="referInvCcy" class="ml5"></span>\
                                    </div>\
                                  </div>\
                                  <div class="subject">\
                                    <div>委託價格</div>\
                                    <div>\
                                      <span id="buyAmount" class="f_ty1"></span>\
                                      <span id="buyInvCcy" class="ml5"></span>\
                                    </div>\
                                  </div>\
                                  <div class="subject">\
                                    <div>委託股數</div>\
                                    <div>\
                                      <span id="buyStock" class="f_ty1"></span>\
                                      <span class="ml5">股</span>\
                                    </div>\
                                  </div>\
                                  <div id="longPeriodSubject" class="subject none">\
                                    <div>長效單委託迄日</div>\
                                    <div>\
                                      <span id="longPeriod" class="f_ty1"></span>\
                                    </div>\
                                  </div>\
                                  <div class="subject">\
                                    <div>預估手續費</div>\
                                    <div>\
                                      <span id="fee" class="f_ty1"></span>\
                                      <span id="feeInvCcy" class="ml5"></span>\
                                    </div>\
                                  </div>\
                                  <div class="subject">\
                                    <div>圈存/扣款帳號</div>\
                                    <div>\
                                      <span id="debitAccount" class="f_ty1"></span>\
                                    </div>\
                                  </div>\
                                  <div class="subject">\
                                    <div>介紹人編號</div>\
                                    <div>\
                                      <span id="recommender" class="f_ty1"></span>\
                                    </div>\
                                  </div>\
                                </section>\
                                <section id="transactionPassword"></section>\
                            </div>\
                            <div id="promptMessage" class="addition"></div>\
                            <div class="bot_btn_set">\
                                <div id="cancel"><a href="javascript:void(0)"></a>取消交易</div>\
                                <div id="confirm" class="on"><a href="javascript:void(0)"></a>進行交易驗證</div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>';
    var $popup = jq(html);

    var isPasswordLogin = function () {
      return !(HeaderObject.GetLoginType() == fpAuth.loginType);
    };

    var renderTransactionPassword = function () {
      var html = '';
      var $selector = jq(set.selector);
      var $transactionPassword = $selector.find('#transactionPassword');
      $transactionPassword.empty();
      /* 112-S-94200-00411, 數位平台(行銀、新舊網銀、無障礙網銀、商務網)新增反詐警語說明 */
      if (isPasswordLogin()) {
        html =
          '<div class="title_blk_2">交易認證</div>\
            <div class="input_box">\
                <input id="transactionCode" type="password" keyboard="onlyNumber" readonly maxlength="7" placeholder="請輸入交易密碼 (民國出生日期)" data-label="transactionCode" style="width:100%;"/>\
            </div>\
            <p id="transactionCodeWarnMessage" class="supplement c_org none"></p>\
            <p class="supplement">交易密碼為您的出生日期，如為民國80年5月1日，請輸入800501；如為民國100年2月1日，請輸入1000201。</p>\
            <p class="supplement c_red mt30">提醒您切勿輕信不明來電、簡訊或社群連結與網站，請提高警覺！<br/>常見詐騙訊息態樣有「ATM設定錯誤、透過網路轉帳、解除分期付款、提高信用卡餘額/交易序號/卡號查詢、將監管您的帳戶、投資加LINE、加群領飆股」等。<br/>如您接獲可疑來訊，請聯繫本行客服02-21821988或警政署反詐騙諮詢專線165查證，以確保自身權益。</p>';
      } else {
        if (service.getTransFidoFlag() !== 'Y') {
          html =
            '<div class="title_blk_2">交易認證</div>\
            <div class="input_box">\
                <input id="transactionCode" type="password" maxlength="16" placeholder="請輸入交易密碼 (網路銀行登入之密碼)" data-label="transactionCode" style="width:100%;"/>\
            </div>\
            <p id="transactionCodeWarnMessage" class="supplement c_org none"></p>\
            <p class="supplement">交易密碼為您的網路銀行登入之密碼。</p>\
            <p class="supplement c_red mt30">提醒您切勿輕信不明來電、簡訊或社群連結與網站，請提高警覺！<br/>常見詐騙訊息態樣有「ATM設定錯誤、透過網路轉帳、解除分期付款、提高信用卡餘額/交易序號/卡號查詢、將監管您的帳戶、投資加LINE、加群領飆股」等。<br/>如您接獲可疑來訊，請聯繫本行客服02-21821988或警政署反詐騙諮詢專線165查證，以確保自身權益。</p>';
        } else {
          html = '';
        }
      }
      $transactionPassword.empty().append(html);
    };

    var setStockMarket = function (stockExchangeCode) {
      switch (stockExchangeCode) {
        case 'US':
          return '美股';
        case 'HK':
          return '港股';
        case 'HS':
          return '滬股';
        default:
          return '';
      }
    };

    var setStockCcy = function (stockExchangeCode) {
      switch (stockExchangeCode) {
        case 'US':
          return '美元';
        case 'HK':
          return '港幣';
        case 'HS':
          return '人民幣';
        default:
          return '';
      }
    };

    //委託日期
    var renderApplyDate = function () {
      if (set.orderOverseasStocks) {
        var $selector = jq(set.selector);
        var $applyDate = $selector.find('#applyDate');
        $applyDate.text(set.orderOverseasStocks.orderDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3'));
      }
    };
    //市場交易日期
    var renderEffectDate = function () {
      if (set.orderOverseasStocks) {
        var $selector = jq(set.selector);
        var $effectDate = $selector.find('#effectDate');
        $effectDate.text(set.orderOverseasStocks.orderFormDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3'));
      }
    };
    //投資市場
    var renderStockMarket = function () {
      if (set.orderOverseasStocks) {
        var $selector = jq(set.selector);
        var $stockMarket = $selector.find('#stockMarket');
        $stockMarket.text(setStockMarket(set.orderOverseasStocks.stockExchangeCode));
      }
    };
    //投資幣別
    var renderStockCcy = function () {
      if (set.orderOverseasStocks) {
        var $selector = jq(set.selector);
        var $stockCcy = $selector.find('#stockCcy');
        $stockCcy.text(setStockCcy(set.orderOverseasStocks.stockExchangeCode));
      }
    };
    //投資商品
    var renderStockName = function () {
      if (set.stockData) {
        var $selector = jq(set.selector);
        var $stockName = $selector.find('#stockName');
        var chtShortName = set.stockData.chtShortName || '';
        var bondDesc = set.stockData.bondDesc || '';
        var tradeCommCode = set.stockData.tradeCommCode || '';
        var trustNo = set.stockData.trustNo || '';
        $stockName.text(chtShortName + '-' + bondDesc + '-' + tradeCommCode + '-' + trustNo);
      }
    };
    //參考盤價
    var renderReferPrice = function () {
      if (set.stockData && set.orderOverseasStocks) {
        var $selector = jq(set.selector);
        var $referPrice = $selector.find('#referPrice');
        var $referInvCcy = $selector.find('#referInvCcy');
        $referPrice.text(set.stockData.redeemPrice);
        $referInvCcy.text(setStockCcy(set.orderOverseasStocks.stockExchangeCode));
      }
    };
    //委託價格
    var renderBuyAmount = function () {
      if (set.subscriptionStockData) {
        var $selector = jq(set.selector);
        var $buyAmount = $selector.find('#buyAmount');
        var $buyInvCcy = $selector.find('#buyInvCcy');
        $buyAmount.text(set.subscriptionStockData.commPrice);
        $buyInvCcy.text(setStockCcy(set.subscriptionStockData.stockExchangeCode));
      }
    };
    //委託股數
    var renderBuyStock = function () {
      if (set.subscriptionStockData) {
        var $selector = jq(set.selector);
        var $buyStock = $selector.find('#buyStock');
        $buyStock.text(set.subscriptionStockData.commQuantity);
      }
    };
    //長效單委託迄日
    var renderLongPeriod = function () {
      if (set.orderOverseasStocks) {
        var $selector = jq(set.selector);
        var $longPeriodSubject = $selector.find('#longPeriodSubject');
        var $longPeriod = $selector.find('#longPeriod');
        //是長效單才顯示
        if (set.orderOverseasStocks.entrustExprDate && set.orderOverseasStocks.entrustExprDate !== '00000000') {
          $longPeriodSubject.removeClass('none');
          $longPeriod.text(set.orderOverseasStocks.entrustExprDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3'));
        } else {
          $longPeriodSubject.addClass('none');
        }
      }
    };
    //預估手續費
    var renderSubscriptionFee = function () {
      if (set.orderOverseasStocks) {
        var $selector = jq(set.selector);
        var $fee = $selector.find('#fee');
        var $feeInvCcy = $selector.find('#feeInvCcy');
        $fee.text(yuantaApp.Format.ToAmt((Number(set.orderOverseasStocks.actualCustTransFee) / 100).toFixed(2), 2, true));
        $feeInvCcy.text(setStockCcy(set.orderOverseasStocks.stockExchangeCode));
      }
    };
    //圈存/扣款帳號
    var renderDebitAccount = function () {
      if (set.subscriptionStockData && set.stockData) {
        var $selector = jq(set.selector);
        var $debitAccount = $selector.find('#debitAccount');
        var invCcy = set.stockData.currency;
        var account;
        var fullAccountName;
        account = service.getForeignDebitAccount(set.subscriptionStockData.depWithdrawalAccount, invCcy);
        fullAccountName = service.getFullDebitAccountName(account);
        $debitAccount.text(fullAccountName);
      }
    };
    //介紹人編號
    var renderRecommender = function () {
      if (set.orderOverseasStocks) {
        var $selector = jq(set.selector);
        var $recommender = $selector.find('#recommender');
        $recommender.text(set.orderOverseasStocks.refAgentCode);
      }
    };

    // 貼心提醒
    var renderPromptMessage = function () {
      return '<p>貼心提醒： <br/>請再次檢視您的投資資料！若要修正，請回上一步修改，或按「取消交易」結束本筆交易。若您同意並按「確認」鍵，交易驗證完成後即完成委託交易，如您要進行撤銷，請您至「<a id="goSearchPage" href="javascript:void(0)" style="color: #d23650; text-decoration: underline;">即時委託查詢與撤銷</a>」進行申請。</p>';
    };

    var setData = function () {
      var $selector = jq(set.selector);
      var $promptMessage = $selector.find('#promptMessage');
      renderApplyDate();
      renderEffectDate();
      renderStockMarket();
      renderStockCcy();
      renderStockName();
      renderReferPrice();
      renderBuyAmount();
      renderBuyStock();
      renderLongPeriod();
      renderSubscriptionFee();
      renderDebitAccount();
      renderRecommender();
      renderTransactionPassword();
      $promptMessage.append(renderPromptMessage());
      yuantaApp.gettransarr();
      setEvet();
    };

    var setEvet = function () {
      var $selector = jq(set.selector);
      var $confirm = $selector.find('#confirm a');
      var $cancel = $selector.find('#cancel');
      var $transactionCode = $selector.find('#transactionCode');
      var $goSearchPage = $selector.find('#goSearchPage');
      var $popupClose = $selector.find('.popup_close');

      $confirm.off().on('click', function (e) {
        e.stopPropagation();
        if (!handleTransactionCodeValid()) {
          return;
        }
        event.confirm(set);
      });
      $cancel.off().on('click', function () {
        event.cancel();
      });

      var handleTransactionCodeValid = function () {
        var result = true;
        var value = $transactionCode.val();
        var parent = $transactionCode.parent();
        var $transactionCodeWarnMessage = jq('#transactionCodeWarnMessage');
        if (isPasswordLogin()) {
          if (!stockSubscriptionModule.validateRules.require.func(value)) {
            result = false;
            parent.addClass('warn');
            $transactionCodeWarnMessage.text('請輸入交易密碼').removeClass('none');
          } else if (!stockSubscriptionModule.validateRules.onlyNumber.func(value)) {
            result = false;
            parent.addClass('warn');
            $transactionCodeWarnMessage.text('交易密碼欄位輸入格是錯誤，請輸入數字').removeClass('none');
          } else if (!stockSubscriptionModule.validateRules.minSize.func(value, 6)) {
            result = false;
            parent.addClass('warn');
            $transactionCodeWarnMessage.text('交易密碼最少6個字元').removeClass('none');
          } else if (!stockSubscriptionModule.validateRules.maxSize.func(value, 7)) {
            result = false;
            parent.addClass('warn');
            $transactionCodeWarnMessage.text('交易密碼最多7個字元').removeClass('none');
          } else {
            result = true;
            parent.removeClass('warn');
            $transactionCodeWarnMessage.text('').addClass('none');
          }
        } else {
          if (service.getTransFidoFlag() !== 'Y') {
            if (!stockSubscriptionModule.validateRules.require.func(value)) {
              result = false;
              parent.addClass('warn');
              $transactionCodeWarnMessage.text('請輸入交易密碼').removeClass('none');
            } else if (!stockSubscriptionModule.validateRules.onlyNumberEnglish.func(value)) {
              result = false;
              parent.addClass('warn');
              $transactionCodeWarnMessage.text('交易密碼欄位輸入格是錯誤').removeClass('none');
            } else if (!stockSubscriptionModule.validateRules.minSize.func(value, 1)) {
              result = false;
              parent.addClass('warn');
              $transactionCodeWarnMessage.text('交易密碼最少1個字元').removeClass('none');
            } else if (!stockSubscriptionModule.validateRules.maxSize.func(value, 16)) {
              result = false;
              parent.addClass('warn');
              $transactionCodeWarnMessage.text('交易密碼最多16個字元').removeClass('none');
            } else {
              result = true;
              parent.removeClass('warn');
              $transactionCodeWarnMessage.text('').addClass('none');
            }
          } else {
            result = true;
            parent.removeClass('warn');
            $transactionCodeWarnMessage.text('').addClass('none');
          }
        }
        return result;
      };
      $transactionCode.off().on('change input blur', function () {
        handleTransactionCodeValid();
      });

      $goSearchPage.off().on('click', function (e) {
        e.stopPropagation();
        yuantaApp.loadpage('_A0439_01');
      });

      $popupClose.off().on('click', function () {
        event.popupClose();
      });
    };

    var service = {
      getTransFidoFlag: function () {},
      getForeignDebitAccount: function () {},
      getFullDebitAccountName: function () {}
    };

    var set = {
      selector: '',
      orderOverseasStocks: null,
      subscriptionStockData: null,
      stockData: null
    };
    var event = {
      confirm: function () {},
      cancel: function () {},
      popupClose: function () {}
    };
    var interface = {
      open: function () {
        location.replace(set.selector);
        yuantaApp.gettransarr();
        yuantaApp.popupResize(set.selector.replace('#', ''));
        return interface;
      },
      close: function () {
        jq(set.selector).empty();
        location.replace('#');
        yuantaApp.gettransarr();
        return interface;
      }
    };
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      service: function (name, value) {
        service[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $popup.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //_A0436_01申購結果頁(單筆申購)
  StockSubscriptionComponent.prototype.StockResultsByOneTimePopup = function () {
    var html =
      '<div class="popup newBlock">\
          <div class="popup_close none" tabindex="0" data-aria="cancel">\
              <img src="images/menu_back.png" role="button" alt="" />\
          </div>\
          <div class="popup_title background_base bg_blue">\
              <span>個股申購完成</span>\
          </div>\
          <div id="contractContent" class="popup_content">\
              <div class="wrapper">\
                  <div class="inside">\
                      <div class="content">\
                          <div id="resultBlock" class="mes_result"></div>\
                          <div class="line_area">\
                              <section>\
                                <div class="subject">\
                                  <div>委託日期</div>\
                                  <div>\
                                    <span id="applyDate" class="f_ty1"></span>\
                                  </div>\
                                </div>\
                                <div class="subject">\
                                  <div>市場交易日期</div>\
                                  <div>\
                                    <span id="effectDate" class="f_ty1"></span>\
                                  </div>\
                                </div>\
                                <div class="subject">\
                                  <div>投資方式</div>\
                                  <div>\
                                    <span class="f_ty1">單筆申購</span>\
                                  </div>\
                                </div>\
                                <div class="subject">\
                                  <div>投資市場</div>\
                                  <div>\
                                    <span id="stockMarket" class="f_ty1"></span>\
                                  </div>\
                                </div>\
                                <div class="subject">\
                                  <div>投資幣別</div>\
                                  <div>\
                                    <span id="stockCcy" class="f_ty1"></span>\
                                  </div>\
                                </div>\
                                <div class="subject">\
                                  <div>投資商品</div>\
                                  <div>\
                                    <span id="stockName" class="f_ty1"></span>\
                                  </div>\
                                </div>\
                                <div class="subject">\
                                  <div>參考盤價</div>\
                                  <div>\
                                    <span id="referPrice" class="f_ty1"></span>\
                                    <span id="referInvCcy" class="ml5"></span>\
                                  </div>\
                                </div>\
                                <div class="subject">\
                                  <div>委託價格</div>\
                                  <div>\
                                    <span id="buyAmount" class="f_ty1"></span>\
                                    <span id="buyInvCcy" class="ml5"></span>\
                                  </div>\
                                </div>\
                                <div class="subject">\
                                  <div>委託股數</div>\
                                  <div>\
                                    <span id="buyStock" class="f_ty1"></span>\
                                    <span class="ml5">股</span>\
                                  </div>\
                                </div>\
                                <div id="longPeriodSubject" class="subject none">\
                                  <div>長效單委託迄日</div>\
                                  <div>\
                                    <span id="longPeriod" class="f_ty1"></span>\
                                  </div>\
                                </div>\
                                <div class="subject">\
                                  <div>預估手續費</div>\
                                  <div>\
                                    <span id="fee" class="f_ty1"></span>\
                                    <span id="feeInvCcy" class="ml5"></span>\
                                  </div>\
                                </div>\
                                <div class="subject">\
                                  <div>圈存/扣款帳號</div>\
                                  <div>\
                                    <span id="debitAccount" class="f_ty1"></span>\
                                  </div>\
                                </div>\
                                <div class="subject">\
                                  <div>介紹人編號</div>\
                                  <div>\
                                    <span id="recommender" class="f_ty1"></span>\
                                  </div>\
                                </div>\
                              </section>\
                          </div>\
                          <div class="message_area">\
                            <section>\
                              <div id="promptMessage">\
                            </section>\
                          </div>\
                          <div class="bot_btn_set">\
                            <div id="confirm" class="on"><a href="javascript:void(0)"></a>完成</div>\
                          </div>\
                      </div>\
                  </div>\
              </div>\
          </div>\
      </div>';
    var $popup = jq(html);

    var setStockMarket = function (stockExchangeCode) {
      switch (stockExchangeCode) {
        case 'US':
          return '美股';
        case 'HK':
          return '港股';
        case 'HS':
          return '滬股';
        default:
          return '';
      }
    };

    var setStockCcy = function (stockExchangeCode) {
      switch (stockExchangeCode) {
        case 'US':
          return '美元';
        case 'HK':
          return '港幣';
        case 'HS':
          return '人民幣';
        default:
          return '';
      }
    };

    //委託日期
    var renderApplyDate = function () {
      var $selector = jq(set.selector);
      var $applyDate = $selector.find('#applyDate');
      $applyDate.text(set.orderOverseasStocks.orderDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3'));
    };
    //市場交易日期
    var renderEffectDate = function () {
      var $selector = jq(set.selector);
      var $effectDate = $selector.find('#effectDate');
      $effectDate.text(set.orderOverseasStocks.orderFormDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3'));
    };
    //投資市場
    var renderStockMarket = function () {
      var $selector = jq(set.selector);
      var $stockMarket = $selector.find('#stockMarket');
      $stockMarket.text(setStockMarket(set.orderOverseasStocks.stockExchangeCode));
    };
    //投資幣別
    var renderStockCcy = function () {
      var $selector = jq(set.selector);
      var $stockCcy = $selector.find('#stockCcy');
      $stockCcy.text(setStockCcy(set.orderOverseasStocks.stockExchangeCode));
    };
    //投資商品
    var renderStockName = function () {
      var $selector = jq(set.selector);
      var $stockName = $selector.find('#stockName');
      var chtShortName = set.stockData.chtShortName || '';
      var bondDesc = set.stockData.bondDesc || '';
      var tradeCommCode = set.stockData.tradeCommCode || '';
      var trustNo = set.stockData.trustNo || '';
      $stockName.text(chtShortName + '-' + bondDesc + '-' + tradeCommCode + '-' + trustNo);
    };
    //參考盤價
    var renderReferPrice = function () {
      var $selector = jq(set.selector);
      var $referPrice = $selector.find('#referPrice');
      var $referInvCcy = $selector.find('#referInvCcy');
      $referPrice.text(set.stockData.redeemPrice);
      $referInvCcy.text(setStockCcy(set.orderOverseasStocks.stockExchangeCode));
    };
    //委託價格
    var renderBuyAmount = function () {
      var $selector = jq(set.selector);
      var $buyAmount = $selector.find('#buyAmount');
      var $buyInvCcy = $selector.find('#buyInvCcy');
      $buyAmount.text(set.data.commPrice);
      $buyInvCcy.text(setStockCcy(set.data.stockExchangeCode));
    };
    //委託股數
    var renderBuyStock = function () {
      var $selector = jq(set.selector);
      var $buyStock = $selector.find('#buyStock');
      $buyStock.text(set.data.commQuantity);
    };
    //長效單委託迄日
    var renderLongPeriod = function () {
      var $selector = jq(set.selector);
      var $longPeriodSubject = $selector.find('#longPeriodSubject');
      var $longPeriod = $selector.find('#longPeriod');
      //是長效單才顯示
      if (set.orderOverseasStocks.entrustExprDate && set.orderOverseasStocks.entrustExprDate !== '00000000') {
        $longPeriodSubject.removeClass('none');
        $longPeriod.text(set.orderOverseasStocks.entrustExprDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3'));
      } else {
        $longPeriodSubject.addClass('none');
      }
    };
    //預估手續費
    var renderSubscriptionFee = function () {
      var $selector = jq(set.selector);
      var $fee = $selector.find('#fee');
      var $feeInvCcy = $selector.find('#feeInvCcy');
      $fee.text(yuantaApp.Format.ToAmt((Number(set.orderOverseasStocks.actualCustTransFee) / 100).toFixed(2), 2, true));
      $feeInvCcy.text(setStockCcy(set.orderOverseasStocks.stockExchangeCode));
    };
    //圈存/扣款帳號
    var renderDebitAccount = function () {
      var $selector = jq(set.selector);
      var $debitAccount = $selector.find('#debitAccount');
      var invCcy = set.stockData.currency;
      var account;
      var fullAccountName;
      account = service.getForeignDebitAccount(set.data.depWithdrawalAccount, invCcy);
      fullAccountName = service.getFullDebitAccountName(account);
      $debitAccount.text(fullAccountName);
    };
    //介紹人編號
    var renderRecommender = function () {
      var $selector = jq(set.selector);
      var $recommender = $selector.find('#recommender');
      $recommender.text(set.orderOverseasStocks.refAgentCode);
    };

    //交易結果
    var renderResultBlock = function () {
      var $selector = jq(set.selector);
      var $resultBlock = $selector.find('#resultBlock');
      var html = '';
      if (set.data.result) {
        html =
          '<p class="mes_result_tt">委託成功</p><p>本行將於委託市場交易日期進行交易<br>委託狀態請至<a id="goSearchPage" href="javascript:void(0)" style="color: #f26f28; text-decoration: underline;">即時委託查詢與撤銷</a>查詢</p>';
        $resultBlock.addClass('mes_result').append(html);
      } else {
        html = '<p class="mes_result_tt">委託失敗</p>';
        $resultBlock.addClass('fail').append(html);
      }
      yuantaApp.gettransarr();
    };

    // 貼心提醒
    var renderPromptMessage = function () {
      return '<p>提醒您：</br>1.成交股數預計於1~3天後於庫存總覽顯示。</br>2.預估手續費僅供參考，若您符合手續費折扣優惠資格，則本行交於交易扣款成功時自動提供折扣優惠。</p>';
    };

    var setData = function () {
      if (set.data) {
        var $selector = jq(set.selector);
        var $promptMessage = $selector.find('#promptMessage');
        var $lineArea = $selector.find('.line_area');
        var $section = $lineArea.find('section');
        var $botBtnSet = $selector.find('.bot_btn_set');

        renderResultBlock();
        if (set.data.result) {
          renderApplyDate();
          renderEffectDate();
          renderStockMarket();
          renderStockCcy();
          renderStockName();
          renderReferPrice();
          renderBuyAmount();
          renderBuyStock();
          renderLongPeriod();
          renderSubscriptionFee();
          renderDebitAccount();
          renderRecommender();
          $promptMessage.append(renderPromptMessage());
        } else {
          $section.empty();
          $botBtnSet.addClass('fail');
          if (!set.data.errorCode && !set.data.errorMessage) {
            $section.addClass('none');
          } else {
            var html =
              '<div id="errorCode" class="subject none">\
                <div>代碼</div>\
                <div>\
                  <span class="f_ty1">' +
              set.data.errorCode +
              '</span>\
                </div>\
              </div>\
              <div id="errorMessage" class="subject none">\
                <div>錯誤訊息</div>\
                <div>\
                  <span class="f_ty1" style="word-break: break-all;">' +
              set.data.errorMessage +
              '</span>\
                </div>\
            </div>';
            $section.append(html);

            if (set.data.errorCode) {
              jq('#errorCode').removeClass('none');
            }
            if (set.data.errorMessage) {
              jq('#errorMessage').removeClass('none');
            }
          }
        }
      }
      setEvent();
    };
    var setEvent = function () {
      var $selector = jq(set.selector);
      var $confirm = $selector.find('#confirm a');
      var $goSearchPage = $selector.find('#goSearchPage');

      $goSearchPage.off().on('click', function (e) {
        e.stopPropagation();
        yuantaApp.loadpage('_A0439_01');
      });

      $confirm.off().on('click', function (e) {
        e.stopPropagation();
        event.confirm();
      });
    };

    var service = {
      getForeignDebitAccount: function () {},
      getFullDebitAccountName: function () {}
    };

    var set = {
      selector: '',
      data: null,
      orderOverseasStocks: null,
      stockData: null
    };
    var event = {
      confirm: function () {}
    };
    var interface = {
      open: function () {
        location.replace(set.selector);
        yuantaApp.gettransarr();
        yuantaApp.popupResize(set.selector.replace('#', ''));
        return interface;
      },
      close: function () {
        jq(set.selector).empty();
        location.replace('#');
        yuantaApp.gettransarr();
        return interface;
      }
    };
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      service: function (name, value) {
        service[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $popup.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };

    return buildInterface;
  };

  //境外股票/ETF總覽 上方tab
  StockSubscriptionComponent.prototype.StockTab = function () {
    var html =
      '<div class="top_header">\
          <div data-key="_A0440_01"><a href="javascript:void(0)"></a><span class="txt" data-txt="tab1">庫存績效</span></div>\
          <div data-key="_A0441_01"><a href="javascript:void(0)"></a><span class="txt" data-txt="tab2">申購清單</span></div>\
          <div data-key="_A0442_01"><a href="javascript:void(0)"></a><span class="txt" data-txt="tab3">熱門股票</span></div>\
        </div>';
    var $html = jq(html);
    var setData = function () {
      var pageid = jq('#funcPageContent').data('pageid');
      var $div = $html.find('div');
      jq.each($div, function (index, elm) {
        if (jq(elm).data('key') == pageid) {
          jq(elm).addClass('on');
        }
      });
      yuantaApp.gettransarr();
      setEvent();
    };
    var setEvent = function () {
      var $div = $html.find('div');
      $div.on('click', function () {
        var $this = jq(this);
        var key = $this.data('key');
        event.click(key);
      });
    };
    var set = {
      selector: '',
      appendToApi: 'appendTo'
    };
    var event = {
      click: function () {}
    };
    var interface = {};
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector, appendToApi) {
        set.appendToApi = appendToApi || 'appendTo';
        set.selector = selector;
        if (jq(set.selector) && jq(set.selector)[set.appendToApi]) {
          jq(set.selector)[set.appendToApi]($html);
        }
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //_A0440_01境外股票/ETF總覽-庫存績效-無庫存
  StockSubscriptionComponent.prototype.StockEmptyView = function () {
    var html =
      '<div id="rounded_box" class="rounded_box">\
          <div id="dataHeaderArea">\
            <a href="javascript:void(0);" id="direction" class="direction"></a>\
            <div class="twoSet">\
              <div class="overall_switch">\
                <div class="txt" data-txt="lblTotalRefPay"></div>\
              </div>\
              <div id="txnDetail" class="link txt" data-txt="txnDetail"></div>\
            </div>\
            <div id="outline1"></div>\
          </div>\
          <!-- detail輪播 -->\
          <div class="swiper detailSwiper carousel container">\
            <!-- Additional required wrapper -->\
            <div id="wrapper" class="swiper-wrapper" data-snap-ignore="true"></div>\
            <div class="swiper-pagination pagination"></div>\
            <div id="detailInfoBtn" class="btn_detail txt lineHeight30 none" data-txt="detailInfo"></div>\
          </div>\
        </div>';
    var $html = jq(html);

    var setMountAdView = function () {
      var selector = '#mountArea';
      jq(selector).empty();
      This.MountAdView().set('stocksListHot', set.stocksListHot).appendTo(selector).build();
    };

    var setData = function () {
      var $selector = jq(set.selector);
      var $roundedBox = $selector.find('#rounded_box');
      var $overallSwitch = $selector.find('#dataHeaderArea .overall_switch');
      var btnTitle = '';
      var subTitle = '';

      yuantaApp.recServiceDWID();
      stockSubscriptionModule.commonService.ToggleLoading(false);

      $roundedBox.css({ height: '270px' });
      $overallSwitch.append(yuantaApp.newBlock._switch('totalRefPay'));
      switch (set.type) {
        case 'credit':
          btnTitle = '馬上開戶';
          subTitle = '線上一次開立數位存款戶+信託戶，好方便!';
          break;
        case 'isNotBranch':
          btnTitle = '馬上開立信託戶';
          subTitle = '開戶完成即可開始投資，當下立即審核，無須等候';
          break;
        case 'empty':
          btnTitle = '立刻開始投資';
          break;
      }
      $selector.addClass('noMore');
      $roundedBox.addClass('blur');
      $selector.append('<div class="cover"></div>');
      $selector.append(
        '<div class="noMore_in">' +
          '<div class="wording">' +
          set.title +
          '</div>' +
          '<a href="javascript:void(0);" class="btn_blueRouded">' +
          btnTitle +
          '</a>' +
          '<div class="wording_noimg">' +
          subTitle +
          '</div>' +
          '</div>'
      );

      //輪播廣告
      setMountAdView();

      /* 處理 footer_menu */
      yuantaApp.newBlock._footerMenu(jq('#footerMenu'));
      yuantaApp.pageContentResizeCustom('#footerMenu');

      yuantaApp.gettransarr();
      setEvent();
    };
    var setEvent = function () {
      var $selector = jq(set.selector);
      var $btn = $selector.find('.btn_blueRouded');
      $btn.off().on('click', function () {
        switch (set.type) {
          case 'credit':
            var url = 'https://ebank.yuantabank.com.tw/ecntr/tx/openacct?p=c_yacct'; //正式
            yuantaApp.openURL(url);
            break;
          case 'isNotBranch':
            var url = 'https://ebank.yuantabank.com.tw/ecntr/tx/opentrustacct?method=login'; //正式
            yuantaApp.openURL(url);
            break;
          case 'empty':
            if (
              yuantaApp.checkLogin('_A0434', function () {
                location.replace('#');
              })
            ) {
              yuantaApp.loadpage('_A0434_01');
            }
            break;
        }
      });
    };
    var set = {
      selector: '',
      type: '',
      title: '',
      stocksListHot: null
    };
    var event = {
      click: function () {}
    };
    var interface = {};
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $html.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //_A0440_01境外股票/ETF總覽-庫存績效-有庫存
  StockSubscriptionComponent.prototype.StockInitView = function () {
    var html =
      '<div id="rounded_box" class="rounded_box">\
          <div id="dataHeaderArea">\
            <a href="javascript:void(0);" id="direction" class="direction"></a>\
            <div class="twoSet">\
              <div class="overall_switch">\
                <div class="txt" data-txt="lblTotalRefPay"></div>\
              </div>\
              <div id="txnDetail">\
                <a class="txt link" data-txt="txnDetail" href="javascript:void(0);"></a>\
              </div>\
            </div>\
            <div id="outline1"></div>\
            <!-- 圓餅圖 -->\
            <div class="proportion">\
              <div class="chart">\
                <p>總資產類型比例</p>\
                <div class="chart_in"></div>\
              </div>\
              <div class="txtList"></div>\
					  </div>\
          </div>\
          <!-- detail輪播 -->\
          <div class="swiper detailSwiper carousel container">\
            <!-- Additional required wrapper -->\
            <div id="wrapper" class="swiper-wrapper" data-snap-ignore="true"></div>\
            <div class="swiper-pagination pagination"></div>\
            <div id="detailInfoBtn" class="btn_detail txt lineHeight30 none" data-txt="detailInfo"></div>\
          </div>\
        </div>';
    var $html = jq(html);

    //圓餅圖
    var setProportion = function () {
      var custStocksData = set.custStocksData;
      var D3Data = {
        temp: [],
        smalltotal: []
      };
      var map = [];
      jq.each(custStocksData.records, function (index, item) {
        if (map[item.trustNo]) {
          return;
        }
        var totalMarketCap = 0;
        jq.each(item.dtlDatas, function (index2, item2) {
          if (item2.currency === 'TWD') {
            totalMarketCap = totalMarketCap + Number(item2.refMarketValue) / 100;
          } else {
            var rate = Number(item2.transferRate.substr(0, 10) + '.' + item2.transferRate.substr(10, 9));
            totalMarketCap = totalMarketCap + (Number(item2.refMarketValue) / 100) * rate;
          }
        });
        map[item.trustNo] = true;
        var obj = {
          totalMarketCap: totalMarketCap,
          trustNo: item.trustNo,
          bondDesc: item.bondDesc,
          chtShortName: item.chtShortName,
          marketNo: item.marketNo
        };
        D3Data.temp.push(obj);
      });
      D3Data.temp.sort(function (a, b) {
        return b.totalMarketCap - a.totalMarketCap;
      });

      var lessValue = parseInt(custStocksData.totalMarketCapWithInt);
      var d3Color = ['#114A9C', '#0B7EF2', '#38A8FD', '#67B2F6', '#99C7E5'];
      var stockLabel = '';
      var stockValue = 0;
      var stockTotalValue = 0;
      for (var i = 0; i < D3Data.temp.length; i++) {
        if (i >= 4) break;
        lessValue -= parseInt(D3Data.temp[i].totalMarketCap);
        var name = '';
        if (D3Data.temp[i].marketNo) {
          if (D3Data.temp[i].marketNo.toUpperCase() === 'USA') {
            if (D3Data.temp[i].bondDesc) {
              name = D3Data.temp[i].bondDesc;
            } else {
              name = D3Data.temp[i].chtShortName || '';
            }
          } else {
            name = D3Data.temp[i].chtShortName || '';
          }
        }

        D3Data.smalltotal.push({
          value: ((parseInt(D3Data.temp[i].totalMarketCap) / parseInt(custStocksData.totalMarketCapWithInt) || 0) * 100).toFixed(1),
          drawvalue: D3Data.temp[i].totalMarketCap,
          color: d3Color[i],
          labelcolor: '#039BE5',
          label: name,
          type: 'assets'
        });

        if (stockValue < D3Data.smalltotal[i].value) {
          stockLabel = D3Data.smalltotal[i].label;
          stockValue = parseFloat(D3Data.smalltotal[i].value);
        }
        stockTotalValue = parseFloat(stockTotalValue) + parseFloat(D3Data.smalltotal[i].value);
      }

      if (D3Data.temp.length > 4) {
        D3Data.smalltotal.push({
          value: ((lessValue / parseInt(custStocksData.totalMarketCapWithInt) || 0) * 100).toFixed(1),
          drawvalue: custStocksData.totalMarketCapWithInt == undefined || custStocksData.totalMarketCapWithInt == 0 ? 1 : lessValue,
          color: d3Color[4],
          labelcolor: '#039BE5',
          label: '其他',
          type: 'assets'
        });
        if (stockValue < D3Data.smalltotal[4].value) {
          stockLabel = D3Data.smalltotal[4].label;
          stockValue = parseFloat(D3Data.smalltotal[4].value);
        }
        stockTotalValue = parseFloat(stockTotalValue) + parseFloat(D3Data.smalltotal[4].value);
      }

      if (stockTotalValue > 100) {
        stockValue = parseFloat(stockValue + (100 - stockTotalValue)).toFixed(1);
      }
      if (stockTotalValue < 100) {
        stockValue = parseFloat(stockValue + (100 - stockTotalValue)).toFixed(1);
      }
      if (D3Data.temp.length == 1) {
        D3Data.smalltotal[0].value = '100.0';
      } else {
        if (D3Data.temp.length > 1) {
          jq.each(D3Data.smalltotal, function (index, item) {
            if (item.label == stockLabel) {
              item.value = parseFloat(stockValue).toFixed(1);
            }
          });
        }
      }

      renderProportion(D3Data);
      var selector = '#wrapper';
      This.MountDetailView().set('custStocksData', custStocksData).appendTo(selector).build();

      yuantaApp.gettransarr();
      setEvent();
    };

    //渲染圓餅圖
    var renderProportion = function (dataset) {
      var $selector = jq(set.selector);
      var $proportion = $selector.find('.proportion');
      var $txtList = $selector.find('.txtList');
      var $chart = $selector.find('.chart');

      var renderList = function () {
        return new Promise(function (resolve, reject) {
          setTimeout(function () {
            $txtList.append('<ul>');
            jq.each(dataset.smalltotal, function (index, item) {
              var template =
                '<li>' +
                '<div style="background-color: ' +
                item.color +
                ';" class="dot"></div>' +
                '<p>' +
                item.label +
                '</p>' +
                '<div class="num">' +
                item.value +
                '%</div>' +
                '</li>';
              $txtList.append(template);
            });
            resolve(true);
          }, 0);
        });
      };
      var renderChart = function () {
        return new Promise(function (resolve, reject) {
          setTimeout(function () {
            var listWidth = $txtList.width();
            var width = $proportion.width();
            var chartWidth = width - listWidth;
            var chartHeight = chartWidth;
            var data = dataset.smalltotal;
            data = data.map(function (el) {
              return {
                value: +el.value,
                color: el.color,
                label: el.label,
                drawvalue: el.drawvalue
              };
            });
            if (d3 && d3.version == '7.3.0') {
              var svg = d3
                .select('.proportion .chart .chart_in')
                .append('svg')
                .attr('id', 'svg')
                .attr('width', chartWidth)
                // .attr('height', chartHeight + 50)
                .attr('height', chartHeight)
                .append('g')
                .attr('id', 'arc')
                .attr('transform', 'translate(' + chartWidth / 2 + ',' + chartHeight / 2 + ')');
              var arc = d3
                .arc()
                .innerRadius(0)
                .outerRadius(chartWidth / 2.5);
              var pie = d3.pie().value(function (d) {
                return d.value;
              });
              svg
                .selectAll('path')
                .data(pie(data))
                .enter()
                .append('g')
                .append('path')
                .attr('d', arc)
                .attr('fill', function (d) {
                  return d.data.color;
                });
            } else {
              var svg = d3
                .select('.proportion .chart .chart_in')
                .append('svg')
                .attr('id', 'svg')
                .attr('width', chartWidth)
                // .attr('height', chartHeight + 50)
                .attr('height', chartHeight)
                .append('g')
                .attr('id', 'arc')
                .attr('transform', 'translate(' + chartWidth / 2 + ',' + chartHeight / 2 + ')');
              var arc = d3.svg
                .arc()
                .innerRadius(0)
                .outerRadius(chartWidth / 2.5);
              var pie = d3.layout.pie().value(function (d) {
                return d.value;
              });
              svg
                .selectAll('path')
                .data(pie(data))
                .enter()
                .append('g')
                .append('path')
                .attr('d', arc)
                .attr('fill', function (d) {
                  return d.data.color;
                });
            }
            resolve(true);
          }, 0);
        });
      };

      renderList().then(function () {
        renderChart().then(function () {
          yuantaApp.gettransarr();
        });
      });
    };

    //依據enabledSwitch來新頁面顯示結果
    var checkSwitch = function () {
      if (jq('input[name=enabledSwitch]').prop('checked')) {
        jq('.Ref').removeClass('hide');
        jq('.IncRef').addClass('hide');
      } else {
        jq('.Ref').addClass('hide');
        jq('.IncRef').removeClass('hide');
      }
      setOutLineView(jq('input[name=enabledSwitch]').prop('checked'));
    };

    var setOutLineView = function (enabledSwitch) {
      var custStocksData = set.custStocksData;
      jq('#outline1').empty();
      jq('#outline2').empty();
      var outLineData = {
        amount: enabledSwitch ? custStocksData.totalRefProfitWithoutInt : custStocksData.totalRefProfitWithInt,
        payback: enabledSwitch ? Number(custStocksData.irrWhithoutInt).toFixed(2) : Number(custStocksData.irrWhithInt).toFixed(2),
        amount_reference: [
          {
            name: 'lblTotalRefAmount',
            value: 'TWD ' + yuantaApp.Format.ToAmt(Number(custStocksData.totalMarketCapWithInt).toFixed(0), 0, false)
          },
          {
            name: 'lblTotalCostAll',
            value: 'TWD ' + yuantaApp.Format.ToAmt(Number(custStocksData.totalInvestAmountWithInt).toFixed(0), 0, false)
          }
        ]
      };
      yuantaApp.newBlock._outline('outline1', outLineData);
      yuantaApp.newBlock._outline('outline2', outLineData);
    };

    //輪播廣告
    var setMountAdView = function () {
      var selector = '#mountArea';
      jq(selector).empty();
      This.MountAdView().set('stocksListHot', set.stocksListHot).appendTo(selector).build();
    };

    var setData = function () {
      var $selector = jq(set.selector);
      var $detailInfoBtn = $selector.find('#detailInfoBtn');
      var $overallSwitch = $selector.find('#dataHeaderArea .overall_switch');

      yuantaApp.recServiceDWID();
      stockSubscriptionModule.commonService.ToggleLoading(false);

      $detailInfoBtn.removeClass('none');
      $overallSwitch.append(yuantaApp.newBlock._switch('totalRefPay'));
      //圓餅圖
      setProportion();
      //輪播廣告
      setMountAdView();

      /* 處理 footer_menu */
      yuantaApp.newBlock._footerMenu(jq('#footerMenu'));
      jq('#wrapper').parent().addClass('listSwiper');
      yuantaApp.newBlock._setSwiper('listSwiper', true, true);
      yuantaApp.pageContentResizeCustom('#footerMenu');

      yuantaApp.gettransarr();
    };
    var setEvent = function () {
      var $selector = jq(set.selector);
      var $direction = $selector.find('#direction');
      var $enabledSwitch = $selector.find('#enabledSwitch');
      var $txnDetail = $selector.find('#txnDetail');
      var $btnDetail = $selector.find('.btn_detail');

      //驚嘆號icon
      $direction.on('click', function () {
        var content = '<div class="txt" data-txt="directionContent"></div>';
        yuantaApp.popupNewMessageNoButton('總覽說明', content);
      });

      //總參考損益
      $enabledSwitch.on('change', function () {
        checkSwitch();
      });

      //委託單查詢與撤銷
      $txnDetail.on('click', function () {
        yuantaApp.loadpage('_A0439_01', true);
      });

      //詳細資訊
      $btnDetail.on('click', function () {
        event.detail();
      });
    };
    var set = {
      selector: '',
      custStocksData: null,
      stocksListHot: null
    };
    var event = {
      detail: function () {}
    };
    var interface = {};
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $html.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //_A0440_01境外股票/ETF總覽-庫存績效-輪播廣告
  StockSubscriptionComponent.prototype.MountAdView = function () {
    var html =
      '<div id="adArea" class="content">\
          <div id="hotSell"></div>\
          <div id="featuredETF"></div>\
        </div>';
    var $html = jq(html);

    var setData = function () {
      var $selector = jq(set.selector);
      var $hotSell = $selector.find('#hotSell');
      var $featuredETF = $selector.find('#featuredETF');
      var adData = set.stocksListHot;

      //熱門股票
      $hotSell.append(yuantaApp.newBlock._title({ lblHotSell: '' }));
      $hotSell.append('<section class="m10">' + yuantaApp.newBlock._wiperView() + '</section>');
      jq.each(adData.StockListHot, function (index, item) {
        if (index >= 5) {
          return;
        }
        var trustNo = item.trustNo;
        if (item.hotFlag == 'Y') {
          item.flag = '熱門項目';
        }
        if (item.marketArea) {
          if (item.marketArea.toUpperCase() === 'US') {
            if (item.bondDesc) {
              item.name = item.bondDesc;
            } else {
              item.name = item.chtShortName || '';
            }
          } else if (item.marketArea.toUpperCase() === 'HK' || item.marketArea.toUpperCase() === 'HS') {
            item.name = item.chtShortName || '';
          } else {
            item.name = '';
          }
        } else if (item.tradeCode) {
          if (item.tradeCode.toUpperCase() === 'US') {
            if (item.bondDesc) {
              item.name = item.bondDesc;
            } else {
              item.name = item.chtShortName || '';
            }
          } else if (item.tradeCode.toUpperCase() === 'HK' || item.tradeCode.toUpperCase() === 'HS') {
            item.name = item.chtShortName || '';
          } else {
            item.name = '';
          }
        } else {
          item.name = '';
        }
        if (item.priceRefDate) {
          item.date = item.priceRefDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');
        } else {
          item.date = '';
        }

        data = {
          header: {
            type: 'titleSideLimit',
            data: {
              value: yuantaApp.newBlock.ToASCIIAndUpper('(' + item.tradeCommCode + ') - ' + item.name),
              sideData: [
                {
                  value: item.flag,
                  valueClass: item.hotFlag == 'Y' ? 'tag' : ''
                }
              ]
            }
          },
          body: {
            type: 'flex_three',
            data: [
              {
                name: 'lblClosingPrice',
                value:
                  item.redeemPrice + '</br><span class="f_small14">' + '(' + item.currency + ')' + '</span></br><span class="date">' + item.date + '</span>',
                valueClass: 'num key_blue lineHeight1_1'
              },
              {
                name: 'lblRiskLevel',
                value: 'RR' + item.risk,
                valueClass: 'stock_c1'
              },
              {
                name: 'market' + item.currency,
                value: '<img src="images/newBlock/flag_' + item.currency + '.svg" class="flag">'
              }
            ]
          },
          footer: {
            type: 'onlyButton',
            data: [{ name: '立即申購' }]
          }
        };
        $hotSell
          .children(':last')
          .find('.swiper-wrapper')
          .append('<div class="swiper-slide data_set">' + yuantaApp.newBlock._infoCard(data) + '</div>');
        $hotSell
          .children(':last')
          .children('.swiper ')
          .children('.swiper-wrapper')
          .children(':last')
          .find('.btn_blue')
          .on('click', function (e) {
            e.stopPropagation();
            HeaderObject.SetData({ trustNo: trustNo });
            if (
              yuantaApp.checkLogin('_A0436', function () {
                location.replace('#');
              })
            ) {
              stockDispCacheService.setGoBackPageID(jq('#funcPageContent').data('pageid'));
              yuantaApp.loadpage('_A0436_01', true);
            }
          });
        $hotSell
          .children(':last')
          .children('.swiper ')
          .children('.swiper-wrapper')
          .children(':last')
          .find('.infoCard_newBlock.detail_box')
          .on('click', function (e) {
            e.stopPropagation();
            if (trustNo) {
              var url = 'https://yuantabank.moneydj.com/w/CustFundIDMap.djhtm?A=' + trustNo + '&B=1001';
              yuantaApp.openURL(url);
            }
          });
      });

      //嚴選國外ETF
      $featuredETF.append(yuantaApp.newBlock._title({ lblETF: '' }));
      $featuredETF.append('<section class="m10">' + yuantaApp.newBlock._wiperView() + '</section>');
      jq.each(adData.StockListETF, function (index, item) {
        if (index >= 5) {
          return;
        }
        var trustNo = item.trustNo;
        if (item.etfFlag == 'Y') {
          item.flag = '熱門項目';
        }
        if (item.marketArea) {
          if (item.marketArea.toUpperCase() === 'US') {
            if (item.bondDesc) {
              item.name = item.bondDesc;
            } else {
              item.name = item.chtShortName || '';
            }
          } else if (item.marketArea.toUpperCase() === 'HK' || item.marketArea.toUpperCase() === 'HS') {
            item.name = item.chtShortName || '';
          } else {
            item.name = '';
          }
        } else if (item.tradeCode) {
          if (item.tradeCode.toUpperCase() === 'US') {
            if (item.bondDesc) {
              item.name = item.bondDesc;
            } else {
              item.name = item.chtShortName || '';
            }
          } else if (item.tradeCode.toUpperCase() === 'HK' || item.tradeCode.toUpperCase() === 'HS') {
            item.name = item.chtShortName || '';
          } else {
            item.name = '';
          }
        } else {
          item.name = '';
        }
        if (item.priceRefDate) {
          item.date = item.priceRefDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');
        } else {
          item.date = '';
        }

        data = {
          header: {
            type: 'titleSideLimit',
            data: {
              value: yuantaApp.newBlock.ToASCIIAndUpper('(' + item.tradeCommCode + ') - ' + item.name),
              sideData: [
                {
                  value: item.flag,
                  valueClass: item.etfFlag == 'Y' ? 'tag' : ''
                }
              ]
            }
          },
          body: {
            type: 'flex_three',
            data: [
              {
                name: 'lblClosingPrice',
                value:
                  item.redeemPrice + '</br><span class="f_small14">' + '(' + item.currency + ')' + '</span></br><span class="date">' + item.date + '</span>',
                valueClass: 'num key_blue lineHeight1_1'
              },
              {
                name: 'lblRiskLevel',
                value: 'RR' + item.risk,
                valueClass: 'stock_c1'
              },
              {
                name: 'market' + item.currency,
                value: '<img src="images/newBlock/flag_' + item.currency + '.svg" class="flag">'
              }
            ]
          },
          footer: {
            type: 'onlyButton',
            data: [{ name: '立即申購' }]
          }
        };
        $featuredETF
          .children(':last')
          .find('.swiper-wrapper')
          .append('<div class="swiper-slide data_set">' + yuantaApp.newBlock._infoCard(data) + '</div>');
        $featuredETF
          .children(':last')
          .children('.swiper ')
          .children('.swiper-wrapper')
          .children(':last')
          .find('.btn_blue')
          .on('click', function (e) {
            e.stopPropagation();
            HeaderObject.SetData({ trustNo: trustNo });
            if (
              yuantaApp.checkLogin('_A0436', function () {
                location.replace('#');
              })
            ) {
              stockDispCacheService.setGoBackPageID(jq('#funcPageContent').data('pageid'));
              yuantaApp.loadpage('_A0436_01', true);
            }
          });
        $featuredETF
          .children(':last')
          .children('.swiper ')
          .children('.swiper-wrapper')
          .children(':last')
          .find('.infoCard_newBlock.detail_box')
          .on('click', function (e) {
            e.stopPropagation();
            if (trustNo) {
              var url = 'https://yuantabank.moneydj.com/w/CustFundIDMap.djhtm?A=' + trustNo + '&B=1001';
              yuantaApp.openURL(url);
            }
          });
      });

      jq('#adArea .detailSwiper').addClass('adSwiper');
      yuantaApp.newBlock._setSwiper('adSwiper', false, true);

      yuantaApp.gettransarr();
    };
    var set = {
      selector: '',
      stocksListHot: null
    };
    var event = {
      click: function () {}
    };
    var interface = {};
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $html.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //庫存卡片
  StockSubscriptionComponent.prototype.MountDetailView = function () {
    //排序
    var sortDetailData = function (detailData) {
      var sortKey = set.sortKey;
      detailData.sort(function (a, b) {
        if (sortKey === 'rorWithInt') {
          if (+(a.rorWithIntSign + Number(a.rorWithInt) / 100) < +(b.rorWithIntSign + Number(b.rorWithInt) / 100)) {
            return 1;
          } else {
            return -1;
          }
        } else if (sortKey === 'unrealizeProfitLosswInt') {
          if (
            +(a.unrealizeProfitLosswIntSign + Number(a.unrealizeProfitLosswInt) / 100) <
            +(b.unrealizeProfitLosswIntSign + Number(b.unrealizeProfitLosswInt) / 100)
          ) {
            return 1;
          } else {
            return -1;
          }
        } else {
          return b[sortKey] - a[sortKey];
        }
      });
    };

    //依據enabledSwitch來新頁面顯示結果
    var checkSwitch = function () {
      if (jq('input[name=enabledSwitch]').prop('checked')) {
        jq('.Ref').removeClass('hide');
        jq('.IncRef').addClass('hide');
      } else {
        jq('.Ref').addClass('hide');
        jq('.IncRef').removeClass('hide');
      }
      setOutLineView(jq('input[name=enabledSwitch]').prop('checked'));
    };
    var checkSwitch2 = function () {
      if (jq('input[name=enabledSwitch2]').prop('checked')) {
        jq('.Ref').removeClass('hide');
        jq('.IncRef').addClass('hide');
      } else {
        jq('.Ref').addClass('hide');
        jq('.IncRef').removeClass('hide');
      }
      setOutLineView(jq('input[name=enabledSwitch2]').prop('checked'));
    };

    //上方total卡
    var setOutLineView = function (enabledSwitch) {
      var custStocksData = set.custStocksData;
      jq('#outline1').empty();
      jq('#outline2').empty();
      var outLineData = {
        amount: enabledSwitch ? custStocksData.totalRefProfitWithoutInt : custStocksData.totalRefProfitWithInt,
        payback: enabledSwitch ? Number(custStocksData.irrWhithoutInt).toFixed(2) : Number(custStocksData.irrWhithInt).toFixed(2),
        amount_reference: [
          {
            name: 'lblTotalRefAmount',
            value: 'TWD ' + yuantaApp.Format.ToAmt(Number(custStocksData.totalMarketCapWithInt).toFixed(0), 0, false)
          },
          {
            name: 'lblTotalCostAll',
            value: 'TWD ' + yuantaApp.Format.ToAmt(Number(custStocksData.totalInvestAmountWithInt).toFixed(0), 0, false)
          }
        ]
      };
      yuantaApp.newBlock._outline('outline1', outLineData);
      yuantaApp.newBlock._outline('outline2', outLineData);
    };

    var marketFlag = function (marketNo) {
      var marketInfo = stockSubscriptionModule.commonService.GetMarketFlagInfo(marketNo);
      var displayFlagImg = marketInfo.flagPath === '' ? 'none' : '';
      var template =
        '<div class="r_tag ' +
        displayFlagImg +
        '">' +
        '<div class="flag">' +
        '<img src="' +
        marketInfo.flagPath +
        '">' +
        '</div>' +
        '<span>' +
        marketInfo.marketText +
        '</span>' +
        '</div>';
      return template;
    };

    var setData = function () {
      var $selector = jq(set.selector);
      var hasSort = set.hasSort;
      var isclickMenu = set.isclickMenu;
      var selectMarket = set.selectMarket;
      var custStocksData = set.custStocksData;
      var orderList = [];
      var detailData = [];

      if (hasSort && isclickMenu) {
        if (selectMarket !== 'all') {
          orderList = custStocksData.records.filter(function (item) {
            return item.marketNo.toUpperCase() === selectMarket.toUpperCase();
          });
        } else {
          orderList = custStocksData.records;
        }
      } else {
        orderList = custStocksData.records;
      }

      if (!orderList || orderList.length <= 0) {
        var stockType = '';
        switch (selectMarket) {
          case 'all':
            stockType = '全部';
            break;
          case 'usa':
            stockType = '美股';
            break;
          case 'hkg':
            stockType = '港股';
            break;
          case 'hks':
            stockType = '滬股';
            break;
        }
        $selector.empty();
        $selector.append('<div class="noResult">目前尚無' + stockType + '申購庫存</div>');
        return;
      }

      jq.each(orderList, function (index, item) {
        jq.each(item.dtlDatas, function (index2, item2) {
          item2.bondDesc = item.bondDesc || '';
          item2.chtShortName = item.chtShortName;
          item2.marketNo = item.marketNo;
          item2.tradeCommCode = item.tradeCommCode;
          item2.trustNo = item.trustNo;
          detailData.push(item2);
        });
      });
      if (hasSort) {
        $selector.empty();
        sortDetailData(detailData);
      } else {
        detailData = detailData.sort(function (a, b) {
          if (+(a.rorWithIntSign + Number(a.rorWithInt) / 100) < +(b.rorWithIntSign + Number(b.rorWithInt) / 100)) {
            return 1;
          } else {
            return -1;
          }
        });
      }

      jq.each(detailData, function (index, item) {
        if (!hasSort && index >= 5) {
          return;
        }
        var name = '';
        if (item.marketNo) {
          if (item.marketNo.toUpperCase() === 'USA') {
            if (item.bondDesc) {
              name = item.bondDesc;
            } else {
              name = item.chtShortName || '';
            }
          } else {
            name = item.chtShortName || '';
          }
        }

        var template = {
          card: {
            class: 'swiper-slide'
          },
          header: {
            type: 'linkStock',
            class: 'heading_limit',
            value: '(' + item.tradeCommCode + ') ' + name
          },
          body: {
            type: 'stock_reference',
            ccy: marketFlag(item.marketNo),
            refMarketValue:
              item.currency !== 'TWD'
                ? item.currency + ' ' + yuantaApp.Format.ToAmt((Number(item.refMarketValue) / 100).toFixed(2), 2, true)
                : item.currency + ' ' + yuantaApp.Format.ToAmt((Number(item.refMarketValue) / 100).toFixed(0), 0, false),
            stockCost:
              item.currency !== 'TWD'
                ? item.currency + ' ' + yuantaApp.Format.ToAmt((Number(item.stockCost) / 100).toFixed(2), 2, true)
                : item.currency + ' ' + yuantaApp.Format.ToAmt((Number(item.stockCostTWD) / 10000).toFixed(0), 0, false),
            data: [
              {
                leftName: 'lblMarketPrice',
                leftValue: item.goodDeliveryCurrency + ' ' + yuantaApp.Format.ToAmt((Number(item.closingPrice) / 1000000).toFixed(2), 2, true),
                rightName: 'lblAveragePrice',
                rightValue: item.goodDeliveryCurrency + ' ' + This.commonService.FormatNum(Number(item.stockCostPrice) / 1000000, 4)
              },
              {
                leftName: 'lblInventoryStock',
                leftValue: yuantaApp.Format.ToAmt(Number(item.holdingPart), 0, true),
                rightName: 'lblTradableStock',
                rightValue: yuantaApp.Format.ToAmt(Number(item.actualStock), 0, true)
              },
              {
                extraClass: 'IncRef',
                leftName: 'lblIncRefProfit',
                leftValue:
                  item.currency !== 'TWD'
                    ? item.goodDeliveryCurrency +
                      ' ' +
                      (item.unrealizeProfitLosswIntSign === '-' ? '-' : '') +
                      yuantaApp.Format.ToAmt((Number(item.unrealizeProfitLosswInt) / 100).toFixed(2), 2, true)
                    : item.currency +
                      ' ' +
                      (item.unrealizeProfitLossSumSign === '-' ? '-' : '') +
                      yuantaApp.Format.ToAmt((Number(item.unrealizeProfitLossSum) / 100).toFixed(0), 0, true),
                rightName: 'lblIncRefPayback',
                rightValue:
                  item.currency !== 'TWD'
                    ? (item.rorWithIntSign === '-' ? '-' : '') + yuantaApp.Format.ToAmt((Number(item.rorWithInt) / 100).toFixed(2), 2, true) + '%'
                    : (item.rorSumSign === '-' ? '-' : '') + yuantaApp.Format.ToAmt((Number(item.rorSum) / 100).toFixed(2), 2, true) + '%',
                leftValueClass:
                  item.currency !== 'TWD'
                    ? 'tB ' + (item.unrealizeProfitLosswIntSign === '+' ? 'up' : item.unrealizeProfitLosswIntSign === '-' ? 'down' : '')
                    : 'tB ' + (item.unrealizeProfitLossSumSign === '+' ? 'up' : item.unrealizeProfitLossSumSign === '-' ? 'down' : ''),
                rightValueClass:
                  item.currency !== 'TWD'
                    ? 'tB ' + (item.rorWithIntSign === '+' ? 'up' : item.rorWithIntSign === '-' ? 'down' : '')
                    : 'tB ' + (item.rorSumSign === '+' ? 'up' : item.rorSumSign === '-' ? 'down' : '')
              },
              {
                extraClass: 'Ref',
                leftName: 'lblRefProfit',
                leftValue:
                  item.currency !== 'TWD'
                    ? item.goodDeliveryCurrency +
                      ' ' +
                      (item.unrealizeProfitLosswoIntSign === '-' ? '-' : '') +
                      yuantaApp.Format.ToAmt((Number(item.unrealizeProfitLosswoInt) / 100).toFixed(2), 2, true)
                    : item.currency +
                      ' ' +
                      (item.unrealizeProfitLossSign === '-' ? '-' : '') +
                      yuantaApp.Format.ToAmt((Number(item.unrealizeProfitLoss) / 100).toFixed(0), 0, true),
                rightName: 'lblRefPayback',
                rightValue:
                  item.currency !== 'TWD'
                    ? (item.rorWithoutIntSign === '-' ? '-' : '') + yuantaApp.Format.ToAmt((Number(item.rorWithoutInt) / 100).toFixed(2), 2, true) + '%'
                    : (item.rorSign === '-' ? '-' : '') + yuantaApp.Format.ToAmt((Number(item.ror) / 100).toFixed(2), 2, true) + '%',
                leftValueClass:
                  item.currency !== 'TWD'
                    ? 'tB ' + (item.unrealizeProfitLosswoIntSign === '+' ? 'up' : item.unrealizeProfitLosswoIntSign === '-' ? 'down' : '')
                    : 'tB ' + (item.unrealizeProfitLossSign === '+' ? 'up' : item.unrealizeProfitLossSign === '-' ? 'down' : ''),
                rightValueClass:
                  item.currency !== 'TWD'
                    ? 'tB ' + (item.rorWithoutIntSign === '+' ? 'up' : item.rorWithoutIntSign === '-' ? 'down' : '')
                    : 'tB ' + (item.rorSign === '+' ? 'up' : item.rorSign === '-' ? 'down' : '')
              }
            ]
          }
        };

        if (hasSort) {
          $selector.append('<li>' + yuantaApp.newBlock._infoCard(template) + '</li>');
        } else {
          $selector.append(yuantaApp.newBlock._infoCard(template));
        }

        $selector.children(':last').on('click', function () {
          if (hasSort) {
            step++;
          } else {
            step += 2;
          }
          HeaderObject.SetData({ stockData: item });
          yuantaApp.loadpage('_A0441_02');
        });
      });
      if (hasSort) {
        checkSwitch2();
      } else {
        checkSwitch();
      }
      yuantaApp.gettransarr();
    };
    // var setEvent = function () {
    // };
    var set = {
      selector: '',
      hasSort: null,
      sortKey: '',
      isclickMenu: false,
      selectMarket: 'all',
      custStocksData: null
    };
    var event = {
      click: function () {}
    };
    var interface = {};
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //_A0441_01境外股票/ETF總覽-申購清單
  StockSubscriptionComponent.prototype.StockInitListView = function () {
    var html =
      '<div class="top_rounded_area2" id="headerArea">\
        <div class="rounded_box">\
          <div class="twoSet">\
            <div class="overall_switch">\
              <div class="txt" data-txt="lblTotalRefPay"></div>\
            </div>\
          </div>\
          <div id="outline2"></div>\
        </div>\
        <div class="bot_link_set">\
          <a href="javascript:void(0);" id="txnDetail2" class="link txt" data-txt="txnDetail"></a>\
        </div>\
      </div>\
      <div class="menu_h_area">\
          <div id="menu" class="menu"></div>\
        </div>\
      <div class="content" id="contentArea">\
        <section class="twoSet">\
          <div class="sort_way">排序方式：\
            <a href="javascript:void(0);" class="link"></a>\
          </div>\
        </section>\
        <ul class="list"></ul>\
      </div>';
    var $html = jq(html);
    var sortKey = '';

    //篩選選項
    var menuList = [
      {
        value: '依報酬率',
        sortKey: 'rorWithInt'
      },
      {
        value: '依參考損益',
        sortKey: 'unrealizeProfitLosswInt'
      },
      {
        value: '依庫存市值',
        sortKey: 'refMarketValueOrgCurrency'
      },
      {
        value: '依投資金額',
        sortKey: 'stockCost'
      }
    ];

    // 暫存排序key
    var cacheSortKey0441 = {
      set: function (value, callback, failCallback) {
        return ytaJsonStore.setItem('sortKey0441', value, callback, failCallback);
      },
      get: function () {
        return ytaJsonStore.getItem('sortKey0441');
      }
    };

    var setSortKey = function () {
      var match = false;
      jq.each(menuList, function (index, item) {
        if (item.sortKey == sortKey) {
          match = true;
          item.on = true;
          jq('.sort_way a').text(item.value);
          cacheSortKey0441.set(sortKey);
        } else {
          item.on = false;
        }
      });
      //沒有符合 預設第一種排序方式
      if (!match) {
        jq('.sort_way a').text(menuList[0].value);
        menuList[0].on = true;
        sortKey = menuList[0].sortKey;
        cacheSortKey0441.set(sortKey);
      }
    };

    //依據enabledSwitch來新頁面顯示結果
    var checkSwitch2 = function () {
      if (jq('input[name=enabledSwitch2]').prop('checked')) {
        jq('.Ref').removeClass('hide');
        jq('.IncRef').addClass('hide');
      } else {
        jq('.Ref').addClass('hide');
        jq('.IncRef').removeClass('hide');
      }
      setOutLineView(jq('input[name=enabledSwitch2]').prop('checked'));
    };

    var setOutLineView = function (enabledSwitch) {
      var custStocksData = set.custStocksData;
      jq('#outline1').empty();
      jq('#outline2').empty();
      var outLineData = {
        amount: enabledSwitch ? custStocksData.totalRefProfitWithoutInt : custStocksData.totalRefProfitWithInt,
        payback: enabledSwitch ? Number(custStocksData.irrWhithoutInt).toFixed(2) : Number(custStocksData.irrWhithInt).toFixed(2),
        amount_reference: [
          {
            name: 'lblTotalRefAmount',
            value: 'TWD ' + yuantaApp.Format.ToAmt(Number(custStocksData.totalMarketCapWithInt).toFixed(0), 0, false)
          },
          {
            name: 'lblTotalCostAll',
            value: 'TWD ' + yuantaApp.Format.ToAmt(Number(custStocksData.totalInvestAmountWithInt).toFixed(0), 0, false)
          }
        ]
      };
      yuantaApp.newBlock._outline('outline1', outLineData);
      yuantaApp.newBlock._outline('outline2', outLineData);
    };

    var setData = function () {
      var $selector = jq(set.selector);
      var $overallSwitch = $selector.find('#headerArea .overall_switch');
      var $menu = $selector.find('#menu');
      var custStocksData = set.custStocksData;
      var enabledSwitch_A0440 = set.enabledSwitch_A0440;

      yuantaApp.recServiceDWID();
      sortKey = cacheSortKey0441.get() || 'rorWithInt';
      $overallSwitch.append(yuantaApp.newBlock._switch('totalRefPay', 'enabledSwitch2'));

      //股票類別標籤
      var menuHtml =
        '<div class="swiper-slide on" data-market="all"><a href="javascript:void(0);">全部</a></div>\
          <div class="swiper-slide" data-market="usa"><a href="javascript:void(0);">美股</a></div>\
          <div class="swiper-slide" data-market="hkg"><a href="javascript:void(0);">港股</a></div>\
          <div class="swiper-slide" data-market="hks"><a href="javascript:void(0);">滬股</a></div>';
      $menu.append(yuantaApp.newBlock._wiperView());
      $menu.children().find('.swiper-wrapper').append(menuHtml);
      var $detailSwiper = jq('#menu .detailSwiper');
      $detailSwiper.addClass('horizontalSwiper');
      var swiper = new Swiper('.horizontalSwiper', {
        slidesPerView: 4,
        spaceBetween: 0
      });

      //設定排序
      setSortKey();
      var selector = '#contentArea .list';
      This.MountDetailView().set('hasSort', true).set('sortKey', sortKey).set('custStocksData', custStocksData).appendTo(selector).build();

      //同步第一頁的切換選項
      jq('input[name=enabledSwitch2]').prop('checked', enabledSwitch_A0440);

      yuantaApp.gettransarr();
      yuantaApp.pageContentResizeCustom();
      setEvent();
    };
    var setEvent = function () {
      var $selector = jq(set.selector);
      var $sortWay_a = $selector.find('.sort_way > a');
      var $enabledSwitch2 = $selector.find('#enabledSwitch2');
      var $txnDetail2 = $selector.find('#txnDetail2');
      var $menuSwiper = $selector.find('.menu .swiper-slide');
      var custStocksData = set.custStocksData;

      //排序下拉選單
      $sortWay_a.on('click', function () {
        yuantaApp.popupNewMenuList('請選擇排序方式', menuList, null, null, function (data) {
          sortKey = data.sortKey;
          setSortKey();
          var selector = '#contentArea .list';
          This.MountDetailView().set('hasSort', true).set('sortKey', sortKey).set('custStocksData', custStocksData).appendTo(selector).build();
        });
      });

      //總參考損益
      $enabledSwitch2.on('change', function () {
        checkSwitch2();
      });

      //委託單查詢與撤銷
      $txnDetail2.on('click', function () {
        yuantaApp.loadpage('_A0439_01', true);
      });

      //股票類別標籤
      $menuSwiper.on('click', function () {
        var market = jq(this).attr('data-market');
        $menuSwiper.removeClass('on');
        jq('[data-market=' + market + ']').addClass('on');
        var selector = '#contentArea .list';
        This.MountDetailView()
          .set('hasSort', true)
          .set('sortKey', sortKey)
          .set('isclickMenu', true)
          .set('selectMarket', market)
          .set('custStocksData', custStocksData)
          .appendTo(selector)
          .build();
      });
    };
    var set = {
      selector: '',
      custStocksData: null,
      enabledSwitch_A0440: false
    };
    var event = {
      click: function () {}
    };
    var interface = {};
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $html.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //_A0441_01境外股票/ETF總覽-申購清單-無庫存
  StockSubscriptionComponent.prototype.StockInitEmptyView = function () {
    var html =
      '<div class="upper">\
        <div class="top_rounded_area">\
          <div id="rounded_box" class="rounded_box">\
            <div id="dataHeaderArea">\
              <a href="javascript:void(0);" id="direction" class="direction"></a>\
              <div class="twoSet">\
                <div class="overall_switch">\
                  <div class="txt" data-txt="lblTotalRefPay"></div>\
                </div>\
                <div id="txnDetail" class="link txt" data-txt="txnDetail"></div>\
              </div>\
              <div id="outline1"></div>\
            </div>\
            <!-- detail輪播 -->\
            <div class="swiper detailSwiper carousel container">\
              <!-- Additional required wrapper -->\
              <div id="wrapper" class="swiper-wrapper" data-snap-ignore="true"></div>\
              <div class="swiper-pagination pagination"></div>\
              <div id="detailInfoBtn" class="btn_detail txt lineHeight30 none" data-txt="detailInfo"></div>\
            </div>\
          </div>\
        </div>\
      </div>';
    var $html = jq(html);

    var setData = function () {
      var $selector = jq(set.selector);
      var $roundedBox = $selector.find('#rounded_box');
      var $overallSwitch = $selector.find('#dataHeaderArea .overall_switch');
      var btnTitle = '';
      var subTitle = '';

      yuantaApp.recServiceDWID();
      stockSubscriptionModule.commonService.ToggleLoading(false);

      $roundedBox.css({ height: '270px' });
      $overallSwitch.append(yuantaApp.newBlock._switch('totalRefPay'));
      switch (set.type) {
        case 'credit':
          btnTitle = '馬上開戶';
          subTitle = '線上一次開立數位存款戶+信託戶，好方便!';
          break;
        case 'isNotBranch':
          btnTitle = '馬上開立信託戶';
          subTitle = '開戶完成即可開始投資，當下立即審核，無須等候';
          break;
        case 'empty':
          btnTitle = '立刻開始投資';
          break;
      }
      $selector.addClass('noMore noBorderRadius');
      $roundedBox.addClass('blur');
      $selector.append('<div class="cover"></div>');
      $selector.append(
        '<div class="noMore_in">' +
          '<div class="wording">' +
          set.title +
          '</div>' +
          '<a href="javascript:void(0);" class="btn_blueRouded">' +
          btnTitle +
          '</a>' +
          '<div class="wording_noimg">' +
          subTitle +
          '</div>' +
          '</div>'
      );

      /* 處理 footer_menu */
      yuantaApp.newBlock._footerMenu(jq('#footerMenu'));
      yuantaApp.pageContentResizeCustom('#footerMenu');

      yuantaApp.gettransarr();
      setEvent();
    };
    var setEvent = function () {
      var $selector = jq(set.selector);
      var $btn = $selector.find('.btn_blueRouded');
      $btn.off().on('click', function () {
        switch (set.type) {
          case 'credit':
            var url = 'https://ebank.yuantabank.com.tw/ecntr/tx/openacct?p=c_yacct'; //正式
            yuantaApp.openURL(url);
            break;
          case 'isNotBranch':
            var url = 'https://ebank.yuantabank.com.tw/ecntr/tx/opentrustacct?method=login'; //正式
            yuantaApp.openURL(url);
            break;
          case 'empty':
            if (
              yuantaApp.checkLogin('_A0434', function () {
                location.replace('#');
              })
            ) {
              yuantaApp.loadpage('_A0434_01');
            }
            break;
        }
      });
    };
    var set = {
      selector: '',
      type: '',
      title: ''
    };
    var event = {
      click: function () {}
    };
    var interface = {};
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $html.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //_A0441_02境外股票/ETF總覽-個股庫存明細
  StockSubscriptionComponent.prototype.StockDetailView = function () {
    var html =
      '<div class="wrapper">\
          <div class="common">\
            <div id="orderInfo" class="upside_white">\
              <section class="stock_detail_title">\
                <div id="stockName"></div>\
                <div>\
                  <a href="javascript:void(0)" class="btn_chart_stock">\
                    <img src="images/newBlock/btn_chart_stock.png">\
                  </a>\
                </div>\
              </section>\
              <section class="m0">\
                <div class="subject subject_width">\
                  <div class="txt" data-txt="lblTradingNo"></div>\
                  <div id="tradingNo" class="key_blue"></div>\
                </div>\
              </section>\
              <section class="m0">\
                <div class="subject subject_width">\
                  <div class="txt" data-txt="lblTrustNo"></div>\
                  <div id="trustNo" class="key_blue"></div>\
                </div>\
              </section>\
              <section class="m0">\
                <div class="subject subject_width">\
                  <div class="txt" data-txt="lblMarketType"></div>\
                  <div id="marketType" class="key_blue"></div>\
                </div>\
              </section>\
              <section class="m0">\
                <div class="subject subject_width">\
                  <div class="txt" data-txt="lblRefMarket"></div>\
                  <div id="refMarket" class="key_blue"></div>\
                </div>\
              </section>\
              <section class="m0">\
                <div class="subject subject_width">\
                  <div class="txt" data-txt="lblRefDate"></div>\
                  <div id="refDate" class="key_blue"></div>\
                </div>\
              </section>\
            </div>\
            <div id="detailInfo" class="menu_h_area">\
              <div id="menu" class="menu"></div>\
              <div class="contain_full">\
                <div id="holdingArea">\
                  <ul id="holdingAreaUl" class="ul_flex_space_between"></ul>\
                </div>\
                <div id="subInfoArea">\
                  <div id="subTotal"></div>\
                  <div id="subDetail">\
                    <section class="m10">\
                      <div class="sort_way">排序方式：\
                        <a href="javascript:void(0);" class="link black"></a>\
                      </div>\
                    </section>\
                    <div id="subDetailCard"></div>\
                  </div>\
                </div>\
              </div>\
              <div class="bot_btn_set">\
                <div class="single"><a></a>申購/賣出/其他交易</div>\
              </div>\
              <div class="bot_link_set">\
                <a class="btn_count_direct">計算說明</a>\
              </div>\
            </div>\
          </div>\
        </div>';
    var $html = jq(html);
    var sortKey = 'byDateNear';
    var subDetailData = [];

    //持股明細
    var setHoldingArea = function (data) {
      var $selector = jq(set.selector);
      var $holdingAreaUl = $selector.find('#holdingAreaUl');
      var holdingTemplate = '';
      for (var i = 0; i < data.length; i++) {
        var valueClass = data[i].valueClass || '';
        holdingTemplate =
          '<li>' + '<div class="txt" data-txt="' + data[i].name + '"></div>' + '<div class="' + valueClass + '">' + data[i].value + '</div>' + '</li>';
        $holdingAreaUl.append(holdingTemplate);
      }
      yuantaApp.gettransarr();
    };

    //申購明細-投資合計
    var setSubTotal = function (data) {
      var $selector = jq(set.selector);
      var $subTotal = $selector.find('#subTotal');
      var subTotalTemplate =
        '<div class="subTotalCard">' +
        '<div class="subTotalCardHeader"></div>' +
        '<div class="card_title">' +
        data.title +
        '</div>' +
        '<ul class="ul_flex_space_between">' +
        '<li>' +
        '<div class="txt" data-txt="lblTotalAmount"></div>' +
        '<div>' +
        data.ccy +
        ' ' +
        data.totalAmount +
        '</div>' +
        '</li>' +
        '<li>' +
        '<div class="txt" data-txt="lblTotalValue"></div>' +
        '<div>' +
        data.ccy +
        ' ' +
        data.totalValue +
        '</div>' +
        '</li>' +
        '<li>' +
        '<div class="txt" data-txt="lblRefGOL"></div>' +
        '<div class="' +
        data.refGOLSign +
        '">' +
        data.ccy +
        ' ' +
        data.refGOL +
        '</div>' +
        '</li>' +
        '<li>' +
        '<div class="txt" data-txt="lblRefROI"></div>' +
        '<div class="' +
        data.refROISign +
        '">' +
        data.refROI +
        '%' +
        '</div>' +
        '</li>' +
        '</ul>' +
        '</div>';
      $subTotal.append(subTotalTemplate);
      yuantaApp.gettransarr();
    };

    var setCcy = function (ccy) {
      switch (ccy) {
        case 'USD':
          return '美元';
        case 'HKD':
          return '港幣';
        case 'CNY':
          return '人民幣';
        case 'AUD':
          return '澳幣';
        case 'JPY':
          return '日圓';
        case 'TWD':
          return '新台幣';
      }
    };

    //篩選選項
    var menuList = [
      {
        value: '依申購日期近到遠',
        sortKey: 'byDateNear'
      },
      {
        value: '依申購日期遠到近',
        sortKey: 'byDateFar'
      }
    ];

    var setSortKey = function () {
      var match = false;
      jq.each(menuList, function (index, item) {
        if (item.sortKey == sortKey) {
          match = true;
          item.on = true;
          jq('.sort_way a').text(item.value);
        } else {
          item.on = false;
        }
      });
      //沒有符合 預設第一種排序方式
      if (!match) {
        jq('.sort_way a').text(menuList[0].value);
        menuList[0].on = true;
        sortKey = menuList[0].sortKey;
      }
    };

    //排序
    var sortDetailData = function (detailData) {
      detailData.sort(function (a, b) {
        var aDate = a.subDate.replace('/', '').replace('/', '');
        var bDate = b.subDate.replace('/', '').replace('/', '');
        if (sortKey === 'byDateFar') {
          return aDate - bDate;
        } else {
          return bDate - aDate;
        }
      });
    };

    //申購明細-卡
    var setSubDetail = function (detailData) {
      var $selector = jq('#subDetailCard');
      var subDetailTemplate = '';
      $selector.empty();
      sortDetailData(detailData);
      jq.each(detailData, function (index, item) {
        subDetailTemplate =
          '<ul class="ul_flex_space_between">' +
          '<li>' +
          '<div class="txt" data-txt="lblSubDate"></div>' +
          '<div>' +
          item.subDate +
          '</div>' +
          '</li>' +
          '<li>' +
          '<div class="txt" data-txt="lblInvestmentAmount"></div>' +
          '<div>' +
          item.investmentAmount +
          '</div>' +
          '</li>' +
          '<li>' +
          '<div class="txt" data-txt="lblTransactionPrice"></div>' +
          '<div>' +
          item.transactionPrice +
          '</div>' +
          '</li>' +
          '<li>' +
          '<div class="txt" data-txt="lblMarketPrice"></div>' +
          '<div>' +
          item.marketPrice +
          '</div>' +
          '</li>' +
          '<li>' +
          '<div class="txt" data-txt="lblTransactionNum"></div>' +
          '<div>' +
          item.transactionNum +
          '</div>' +
          '</li>' +
          '<li>' +
          '<div class="txt" data-txt="lblStockValue"></div>' +
          '<div>' +
          item.stockValue +
          '</div>' +
          '</li>' +
          '<li>' +
          '<div class="txt" data-txt="lblGOLIncluding"></div>' +
          '<div>' +
          item.GOLIncluding +
          '</div>' +
          '</li>' +
          '<li>' +
          '<div class="txt" data-txt="lblROIIncluding"></div>' +
          '<div>' +
          item.ROIIncluding +
          '</div>' +
          '</li>' +
          '</ul>';
        $selector.append(subDetailTemplate);
      });
      yuantaApp.gettransarr();
    };

    var setData = function () {
      var $selector = jq(set.selector);
      var $menu = $selector.find('#menu');
      var $btnChart = $selector.find('.btn_chart_stock'); //走勢圖
      var $stockName = $selector.find('#stockName'); //商品名稱
      var $tradingNo = $selector.find('#tradingNo'); //交易所代碼
      var $trustNo = $selector.find('#trustNo'); //商品代號
      var $marketType = $selector.find('#marketType'); //投資市場
      var $refMarket = $selector.find('#refMarket'); //參考報價
      var $refDate = $selector.find('#refDate'); //報價日期
      var $holdingArea = $selector.find('#holdingArea'); //持股明細
      var $subInfoArea = $selector.find('#subInfoArea'); //申購明細
      var stockData = set.stockData; //個股資訊
      var stockDetailData = set.stockDetailData; //平倉資訊

      //走勢圖
      $btnChart.attr('data-trustno', stockData.trustNo);

      //持股明細/申購明細標籤
      var menuTemplate =
        '<div class="swiper-slide on" data-type="1">\
            <a>持股明細</a>\
          </div>\
          <div class="swiper-slide" data-type="2">\
            <a>申購明細</a>\
          </div>';
      $menu.append(yuantaApp.newBlock._wiperView());
      $menu.children().find('.swiper-wrapper').append(menuTemplate);
      var $detailSwiper = jq('#menu .detailSwiper');
      $detailSwiper.addClass('horizontalSwiper');
      var swiper = new Swiper('.horizontalSwiper', {
        slidesPerView: 2,
        spaceBetween: 0
      });

      //置入資料
      var stockChtShortName = stockData.chtShortName || '';
      var stockBondDesc = stockData.bondDesc || '';
      var marketInfo = stockSubscriptionModule.commonService.GetMarketFlagInfo(stockData.marketNo);
      $stockName.append(stockChtShortName + ' ' + stockBondDesc);
      $tradingNo.append(stockData.tradeCommCode);
      $trustNo.append(stockData.trustNo);
      $marketType.append(marketInfo.marketText);
      $refMarket.append(yuantaApp.Format.ToAmt((Number(stockData.closingPrice) / 1000000).toFixed(2), 2, true));
      $refDate.append(stockData.refQuoteDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3'));

      //持股明細
      var holdingAreaData = [
        {
          name: 'lblTotalStock',
          value: yuantaApp.Format.ToAmt(Number(stockData.holdingPart).toFixed(0), 0, false),
          valueClass: 'key_blue'
        },
        {
          name: 'lblTradableStock',
          value: yuantaApp.Format.ToAmt(Number(stockData.actualStock).toFixed(0), 0, false),
          valueClass: 'key_blue'
        },
        {
          name: 'lblMarketPrice',
          value: stockData.goodDeliveryCurrency + ' ' + yuantaApp.Format.ToAmt((Number(stockData.closingPrice) / 1000000).toFixed(2), 2, true),
          valueClass: 'key_blue'
        },
        {
          name: 'lblAveragePrice',
          value: stockData.goodDeliveryCurrency + ' ' + This.commonService.FormatNum(Number(stockData.stockCostPrice) / 1000000, 4),
          valueClass: 'key_blue'
        },
        {
          name: 'lblInvestmentAmount',
          value:
            stockData.currency +
            ' ' +
            (stockData.currency === 'TWD'
              ? yuantaApp.Format.ToAmt((Number(stockData.stockCostTWD) / 10000).toFixed(0), 0, false)
              : yuantaApp.Format.ToAmt((Number(stockData.stockCost) / 100).toFixed(2), 2, true))
        },
        {
          name: 'lblRefValue',
          value:
            stockData.currency === 'TWD'
              ? stockData.currency + ' ' + yuantaApp.Format.ToAmt((Number(stockData.refMarketValue) / 100).toFixed(0), 0, true)
              : stockData.goodDeliveryCurrency + ' ' + yuantaApp.Format.ToAmt((Number(stockData.refMarketValueOrgCurrency) / 100).toFixed(2), 2, true)
        },
        {
          name: 'lblCumAmount',
          value:
            stockData.currency === 'TWD'
              ? stockData.currency + ' ' + yuantaApp.Format.ToAmt((Number(stockData.aggregateInterest) / 100).toFixed(0), 0, true)
              : stockData.goodDeliveryCurrency + ' ' + yuantaApp.Format.ToAmt((Number(stockData.aggregateInt) / 100).toFixed(2), 2, true)
        },
        {
          name: 'lblGOL',
          value:
            stockData.currency === 'TWD'
              ? stockData.currency +
                ' ' +
                (stockData.unrealizeProfitLossSign === '-' ? '-' : '') +
                yuantaApp.Format.ToAmt((Number(stockData.unrealizeProfitLoss) / 100).toFixed(0), 0, true)
              : stockData.goodDeliveryCurrency +
                ' ' +
                (stockData.unrealizeProfitLosswoIntSign === '-' ? '-' : '') +
                yuantaApp.Format.ToAmt((Number(stockData.unrealizeProfitLosswoInt) / 100).toFixed(2), 2, true),
          valueClass: 'key_red'
        },
        {
          name: 'lblROI',
          value:
            stockData.currency === 'TWD'
              ? (stockData.rorSign === '-' ? '-' : '') + yuantaApp.Format.ToAmt((Number(stockData.ror) / 100).toFixed(2), 2, true) + '%'
              : (stockData.rorWithoutIntSign === '-' ? '-' : '') + yuantaApp.Format.ToAmt((Number(stockData.rorWithoutInt) / 100).toFixed(2), 2, true) + '%',
          valueClass: 'key_red'
        },
        {
          name: 'lblGOLIncluding',
          value:
            stockData.currency === 'TWD'
              ? stockData.currency +
                ' ' +
                (stockData.unrealizeProfitLossSumSign === '-' ? '-' : '') +
                yuantaApp.Format.ToAmt((Number(stockData.unrealizeProfitLossSum) / 100).toFixed(2), 2, true)
              : stockData.goodDeliveryCurrency +
                ' ' +
                (stockData.unrealizeProfitLosswIntSign === '-' ? '-' : '') +
                yuantaApp.Format.ToAmt((Number(stockData.unrealizeProfitLosswInt) / 100).toFixed(2), 2, true),
          valueClass: 'key_red'
        },
        {
          name: 'lblROIIncluding',
          value:
            stockData.currency === 'TWD'
              ? (stockData.rorSumSign === '-' ? '-' : '') + yuantaApp.Format.ToAmt((Number(stockData.rorSum) / 100).toFixed(2), 2, true) + '%'
              : (stockData.rorWithIntSign === '-' ? '-' : '') + yuantaApp.Format.ToAmt((Number(stockData.rorWithInt) / 100).toFixed(2), 2, true) + '%',
          valueClass: 'key_red'
        }
      ];
      setHoldingArea(holdingAreaData);

      //申購明細-投資合計
      var subTotalData = {};
      var ccy = stockData.currency;
      var totalAmount = 0;
      var totalValue = 0;
      var refGOL = 0;
      var refROI = 0;
      var setTotalData = function () {
        return new Promise(function (resolve, reject) {
          setTimeout(function () {
            jq.each(stockDetailData.records, function (index, item) {
              if (item.tradingCurrency === ccy) {
                if (ccy === 'TWD') {
                  totalAmount = totalAmount + Number(item.openPositionTransactionPriceTWD) / 100;
                } else {
                  totalAmount = totalAmount + Number(item.openPositionTransactionPriceOrgCurr) / 100;
                }
                totalValue = totalValue + Number(item.referenceMarketValInvCurrency) / 100;
                refGOL = refGOL + Number(item.unrealizedProfitInvCurrencyInterestSign + item.unrealizedProfitInvCurrencyInterest) / 100;
                refROI = (refGOL / totalAmount) * 100;
              }
            });
            resolve(true);
          }, 0);
        });
      };
      setTotalData().then(function () {
        subTotalData = {
          ccy: ccy,
          title: setCcy(ccy) + '投資合計',
          totalAmount: ccy === 'TWD' ? yuantaApp.Format.ToAmt(totalAmount.toFixed(0), 0, false) : yuantaApp.Format.ToAmt(totalAmount.toFixed(2), 2, true),
          totalValue: ccy === 'TWD' ? yuantaApp.Format.ToAmt(totalValue.toFixed(0), 0, false) : yuantaApp.Format.ToAmt(totalValue.toFixed(2), 2, true),
          refGOL: ccy === 'TWD' ? yuantaApp.Format.ToAmt(refGOL.toFixed(0), 0, false) : yuantaApp.Format.ToAmt(refGOL.toFixed(2), 2, true),
          refROI: yuantaApp.Format.ToAmt(refROI.toFixed(2), 2, true),
          refGOLSign: refGOL.toString().substring(0, 1) === '-' ? 'stock_down' : 'stock_up',
          refROISign: refROI.toString().substring(0, 1) === '-' ? 'stock_down' : 'stock_up'
        };
        setSubTotal(subTotalData);
      });

      jq.each(stockDetailData.records, function (index, item) {
        if (item.tradingCurrency === ccy) {
          var obj = {
            subDate: item.contractDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3'),
            investmentAmount:
              item.tradingCurrency +
              ' ' +
              (item.tradingCurrency === 'TWD'
                ? yuantaApp.Format.ToAmt((Number(item.openPositionTransactionPriceTWD) / 100).toFixed(0), 0, false)
                : yuantaApp.Format.ToAmt((Number(item.openPositionTransactionPriceOrgCurr) / 100).toFixed(2), 2, true)),
            transactionPrice: This.commonService.FormatNum(Number(item.dealPrice) / 1000000, 4),
            marketPrice: yuantaApp.Format.ToAmt((Number(item.referenceClosePrice) / 1000000).toFixed(2), 2, true),
            transactionNum: yuantaApp.Format.ToAmt(Number(item.dealAmt), 0, false),
            stockValue:
              item.tradingCurrency +
              ' ' +
              (item.tradingCurrency === 'TWD'
                ? yuantaApp.Format.ToAmt((Number(item.referenceMarketValInvCurrency) / 100).toFixed(0), 0, false)
                : yuantaApp.Format.ToAmt((Number(item.referenceMarketValInvCurrency) / 100).toFixed(2), 2, true)),
            GOLIncluding:
              item.tradingCurrency +
              ' ' +
              (item.unrealizedProfitInvCurrencyInterestSign === '-' ? '-' : '') +
              (item.tradingCurrency === 'TWD'
                ? yuantaApp.Format.ToAmt((Number(item.unrealizedProfitInvCurrencyInterest) / 100).toFixed(0), 0, false)
                : yuantaApp.Format.ToAmt((Number(item.unrealizedProfitInvCurrencyInterest) / 100).toFixed(2), 2, true)),
            ROIIncluding:
              (item.returnRateInvCurrencyInterestSign === '-' ? '-' : '') +
              yuantaApp.Format.ToAmt((Number(item.returnRateInvCurrencyInterest) / 100).toFixed(2), 2, true) +
              '%'
          };
          subDetailData.push(obj);
        }
      });
      setSortKey();
      setSubDetail(subDetailData);

      $holdingArea.removeClass('hide');
      $subInfoArea.addClass('hide');

      yuantaApp.pageContentResizeCustom();
      yuantaApp.gettransarr();
      setEvent();
    };
    var setEvent = function () {
      var $selector = jq(set.selector);
      var $btnChart = $selector.find('.btn_chart_stock');
      var $menuSwiper = $selector.find('.menu .swiper-slide');
      var $holdingArea = $selector.find('#holdingArea'); //持股明細
      var $subInfoArea = $selector.find('#subInfoArea'); //申購明細
      var $sortWay_a = $selector.find('.sort_way > a');
      var $botBtnSet = $selector.find('.bot_btn_set .single');
      var $btnCountDirect = $selector.find('.btn_count_direct');
      var pageid = jq('#funcPageContent').data('pageid');

      //走勢圖
      $btnChart.on('click', function () {
        var trustNo = jq(this).attr('data-trustno');
        var url = 'https://yuantabank.moneydj.com/w/CustFundIDMap.djhtm?A=' + trustNo + '&B=1001';
        yuantaApp.openURL(url);
      });

      //持股明細/申購明細標籤
      $menuSwiper.on('click', function () {
        var type = jq(this).attr('data-type');
        $menuSwiper.removeClass('on');
        jq(this).addClass('on');

        if (type === '1') {
          //持股明細
          $holdingArea.removeClass('hide');
          $subInfoArea.addClass('hide');
        } else {
          //申購明細
          $holdingArea.addClass('hide');
          $subInfoArea.removeClass('hide');
        }
      });

      //排序下拉選單
      $sortWay_a.on('click', function () {
        yuantaApp.popupNewMenuList('請選擇排序方式', menuList, null, null, function (data) {
          sortKey = data.sortKey;
          setSortKey();
          setSubDetail(subDetailData);
        });
      });

      //申購/賣出/其他交易
      $botBtnSet.on('click', function () {
        var stockData = set.stockData; //個股資訊

        var template =
          '<ul class="options_ty2 options_ty3">\
            <li class="on" data-id="_A0436_01" data-func="_A0436"><a></a><span>境外股票/ETF 申購</span></li>\
            <li class="on" data-id="_A0438_01" data-func="_A0438"><a></a><span>境外股票/ETF 賣出</span></li>\
            <li class="on" data-id="_A0444_01" data-func="_A0444"><a></a><span>歷史委託交易明細查詢</span></li>\
            <li class="on" data-id="_A0439_01" data-func="_A0439"><a></a><span>即時委託查詢與撤銷</span></li>\
          </ul>';
        yuantaApp.popupFullNewMessage('申購 / 賣出 / 其他交易', template);

        jq('.options_ty2 >li').on('click', function (e) {
          switch (jq(this).attr('data-id')) {
            case '_A0436_01':
              HeaderObject.SetData({ trustNo: stockData.trustNo });
              stockDispCacheService.setGoBackPageID(jq('#funcPageContent').data('pageid'));
              break;
            case '_A0438_01':
              HeaderObject.SetData({ dtlDatas: stockData });
              stockDispCacheService.setGoBackPageID(jq('#funcPageContent').data('pageid'));
              break;
          }
          yuantaApp.closePopup();
          location.replace('#');
          if (
            yuantaApp.checkLogin(jq(this).attr('data-func'), function () {
              location.replace('#');
            })
          ) {
            yuantaApp.loadpage(jq(this).attr('data-id'));
          }
        });
      });

      //計算說明
      $btnCountDirect.on('click', function () {
        yuantaApp.popupFullNewMessage(yuantaApp.getconttxt('lblComputeRule', pageid), yuantaApp.getconttxt('msgComputeRule', pageid));
      });
    };
    var set = {
      selector: '',
      stockData: null,
      stockDetailData: null
    };
    var event = {
      click: function () {}
    };
    var interface = {};
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $html.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //_A0442_01境外股票/ETF總覽-熱門股票-標籤
  StockSubscriptionComponent.prototype.StockMenuModule = function () {
    var html = '<div class="topMenu_set topMenu_two_set"></div>';
    var $html = jq(html);

    var setData = function () {
      if (set && set.menuList.length > 0) {
        var template = '';
        for (var i = 0, len = set.menuList.length; i < len; i++) {
          var classList = 'menu_' + set.menuList[i].name + ' txt';
          var txt = set.menuList[i].txt;
          var key = set.menuList[i].key;
          template += '<div class="' + classList + '" data-txt="' + txt + '" data-key="' + key + '"></div>';
        }
        $html.empty().append(template);
      }

      yuantaApp.gettransarr();
      setEvent();
    };
    var setEvent = function () {
      $html.children('div').off().on('click', event.click);
    };
    var set = {
      selector: '',
      menuList: null
    };
    var event = {
      click: function () {}
    };
    var interface = {
      mounted: function (cb) {
        if (cb && jq.isFunction(cb)) {
          cb($html);
        }
        return interface;
      },
      destory: function () {
        return interface;
      }
    };
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $html.appendTo(selector);
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //_A0442_01境外股票/ETF總覽-熱門股票-小卡
  StockSubscriptionComponent.prototype.StockCardModule = function () {
    //排序
    var sortData = function (data) {
      var sortKey = set.sortKey;
      data.sort(function (a, b) {
        if (sortKey === 'tradeCommCode') {
          if (a.tradeCommCode < b.tradeCommCode) {
            return -1;
          } else if (a.tradeCommCode > b.tradeCommCode) {
            return 1;
          } else {
            return 0;
          }
        } else {
          return b[sortKey] - a[sortKey];
        }
      });
    };

    var getCard = function (data) {
      var hotFlagClass = data.hotFlag === 'Y' || data.etfFlag === 'Y' ? 'tag' : 'tag none';
      var rsideClass = data.hotFlag === 'Y' || data.etfFlag === 'Y' ? '' : 'none';
      var name = '';
      if (data.marketArea) {
        if (data.marketArea.toUpperCase() === 'US') {
          if (data.bondDesc) {
            name = data.bondDesc;
          } else {
            name = data.chtShortName || '';
          }
        } else if (data.marketArea.toUpperCase() === 'HK' || data.marketArea.toUpperCase() === 'HS') {
          name = data.chtShortName || '';
        } else {
          name = '';
        }
      } else if (data.tradeCode) {
        if (data.tradeCode.toUpperCase() === 'US') {
          if (data.bondDesc) {
            name = data.bondDesc;
          } else {
            name = data.chtShortName || '';
          }
        } else if (data.tradeCode.toUpperCase() === 'HK' || data.tradeCode.toUpperCase() === 'HS') {
          name = data.chtShortName || '';
        } else {
          name = '';
        }
      } else {
        name = '';
      }
      var date = '';
      if (data.priceRefDate) {
        date = data.priceRefDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');
      } else {
        date = '';
      }
      var riskLevel = 'RR' + data.risk;
      return (
        '<li>\
          <div class="data_set">\
            <div class="link_box">\
              <div class="top">\
                <p class="heading heading_limit" style="-webkit-box-orient: vertical;">' +
        yuantaApp.newBlock.ToASCIIAndUpper('(' + data.tradeCommCode + ') - ' + name) +
        '</p>\
                <div class="r_side ' +
        rsideClass +
        '">\
                  <div class="' +
        hotFlagClass +
        '">熱門項目</div>\
                </div>\
              </div>\
              <div class="mid midThree">\
                <div>\
                  <div class="txt" data-txt="lblClosingPrice"></div>\
                  <div class="num key_blue lineHeight1_1">' +
        data.redeemPrice +
        '</br><span class="f_small14">' +
        '(' +
        data.currency +
        ')' +
        '</span></br><span class="date">' +
        date +
        '</span>' +
        '</div>\
                </div>\
                <div>\
                  <div class="txt" data-txt="lblRiskLevel"></div>\
                  <div class="stock_c1">' +
        riskLevel +
        '</div>\
                </div>\
                <div>\
                  <div class="txt" data-txt="market' +
        data.currency.toUpperCase() +
        '"></div>\
                  <div><img src="images/newBlock/flag_' +
        data.currency +
        '.svg" class="flag"></div>\
                </div>\
              </div>\
              <a href="javascript: void(0)" class="cover"></a>\
            </div>\
            <div class="btn_blue"><a href="javascript:void(0)">立即申購</a></div>\
          </div>\
        </li>'
      );
    };

    var setData = function () {
      var $selector = jq(set.selector);
      var data = set.data;
      var hasSort = set.hasSort;
      $selector.empty();

      if (hasSort) {
        sortData(data);
      }

      if (set && set.data.length > 0) {
        for (var i = 0; (data = set.data[i]); i++) {
          var trustNo = data.trustNo;
          var $li = jq(getCard(data));
          $li.find('.btn_blue').attr('data-trustNo', trustNo).html();
          $li.appendTo($selector);
        }
        yuantaApp.gettransarr();
      }
      setEvent();
    };
    var setEvent = function () {
      var $selector = jq(set.selector);
      $selector
        .find('.btn_blue')
        .off()
        .on('click', function (e) {
          e.stopPropagation();
          event.click && event.click(jq(this));
        });
      $selector
        .find('.link_box')
        .off()
        .on('click', function (e) {
          e.stopPropagation();
          event.clickLinkBox && event.clickLinkBox(jq(this));
        });
    };
    var set = {
      selector: '',
      hasSort: null,
      sortKey: '',
      data: []
    };
    var event = {
      click: function () {},
      clickLinkBox: function () {}
    };
    var interface = {
      mounted: function (cb) {
        if (cb && jq.isFunction(cb)) {
          cb();
        }
        return interface;
      },
      destory: function () {
        return interface;
      }
    };
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        return buildInterface;
      },
      build: function () {
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //_A0443_01產品搜尋
  StockSubscriptionComponent.prototype.StockProductSearchPopupModule = function () {
    var html =
      '<div class="popup newBlock">\
				<div class="popup_right_close btn_close" tabindex="0" data-aria="cancel">\
				</div>\
				<div class="popup_title background_base bg_blue">\
					<span class="txt" data-txt=""></span>\
				</div>\
				<div class="popup_content">\
					<div class="wrapper">\
						<div class="inside">\
							<div class="content">\
								<div class="searchSet">\
									<input id="searchInput" type="text" oninput="yuantaApp.newBlock._replaceInputOnlyAlphaNumberAndChinese(this, event)" inputmode="text" placeholder="請輸入關鍵字或代碼" value="" autocorrect="off" autocapitalize="characters">\
									<div class="btn_search"><a href="javascript:void(0)"></a></div>\
                  <a href="javascript:void(0)" class="btn_delete none"></a>\
								</div>\
								<section id="hotTags">\
									<div class="title_blk locate">熱門標籤<a href="javascript:void(0)" class="btn_filter">篩選</a></div>\
									<ul class="tags"></ul>\
								</section>\
								<section id="noRecentSearch">\
									<div class="title_blk txt" data-txt="recentTitle"></div>\
									<p class="noRecord txt" data-txt="recentNoRecord"></p>\
								</section>\
								<section id="recentSearch" class="none">\
									<div class="title_blk txt" data-txt="recentTitle"></div>\
                  <ul class="tags ty2"></ul>\
								</section>\
                <div class="s_resultArea_fix" style="padding-top:0;">\
                  <div id="noRecord" class="s_result_Box none">\
                    <p class="noRecord"><span class="txt" data-txt="noRecord"></span></p>\
                    <div id="popSearchBtn">\
										  <a href="javascript:void(0)" class="btn_filter txt" data-txt="popSearchBtn"></a>\
									  </div>\
                  </div>\
                  <section id="hasRecord" class="twoSet none" style="font-size: 0.85rem;">\
                    <p class="s_result"></p>\
                    <div class="sort_way">排序方式：\
                      <a href="javascript:void(0);" class="link"></a>\
                    </div>\
                  </section>\
                  <ul class="list none"></ul>\
                </div>\
							</div>\
						</div>\
					</div>\
				</div>\
				<div class="popup_footer"></div>\
			</div>';
    var $popup = jq(html);
    var sortKey = '';
    var fuzzyStockRes = [];

    //篩選選項
    var menuList = [
      {
        value: '依國際代碼(英文字母A~Z排序)',
        sortKey: 'tradeCommCode'
      },
      {
        value: '風險等級由高至低',
        sortKey: 'risk'
      }
    ];

    var setSortKey = function () {
      var match = false;
      jq.each(menuList, function (index, item) {
        if (item.sortKey == sortKey) {
          match = true;
          item.on = true;
          jq('.sort_way a').text(item.value);
        } else {
          item.on = false;
        }
      });
      //沒有符合 預設第一種排序方式
      if (!match) {
        jq('.sort_way a').text(menuList[0].value);
        menuList[0].on = true;
        sortKey = menuList[0].sortKey;
      }
    };

    //popup標題
    function setTitle() {
      if (set.title) {
        var $txt = $popup.find('.popup_title').find('.txt');
        $txt.attr('data-txt', set.title);
      }
    }
    //熱門標籤
    function setTags() {
      if (set && set.tags.length > 0) {
        var template = '';
        for (var i = 0, len = set.tags.length; i < len; i++) {
          var tag = set.tags[i];
          template += '<li id="' + tag.id + '" class="tag txt" data-txt="' + tag.name + '"><a href="javascript:void(0)"></a>' + tag.name + '</li>';
        }
        $popup.find('#hotTags').find('.tags').append(template);
      }
    }

    var fuzzySearch = function (stockList, value) {
      var toASCIIfunction = function (chars) {
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
      if (!stockList) {
        return [];
      }
      if (stockList && stockList.length == 0) {
        return [];
      }
      if (value) {
        value = toASCIIfunction(value).toLocaleUpperCase().replace(' ', '');
      }
      var regex = new RegExp('(' + value + ')', 'i');
      var arr = [];

      for (var i = 0; (data = stockList[i]); i++) {
        var name = '';
        if (data.marketArea) {
          if (data.marketArea.toUpperCase() === 'US') {
            if (data.bondDesc) {
              name = data.bondDesc;
            } else {
              name = data.chtShortName || '';
            }
          } else if (data.marketArea.toUpperCase() === 'HK' || data.marketArea.toUpperCase() === 'HS') {
            name = data.chtShortName || '';
          } else {
            name = '';
          }
        } else if (data.tradeCode) {
          if (data.tradeCode.toUpperCase() === 'US') {
            if (data.bondDesc) {
              name = data.bondDesc;
            } else {
              name = data.chtShortName || '';
            }
          } else if (data.tradeCode.toUpperCase() === 'HK' || data.tradeCode.toUpperCase() === 'HS') {
            name = data.chtShortName || '';
          } else {
            name = '';
          }
        } else {
          name = '';
        }

        data.completeStockName = yuantaApp.newBlock.ToASCIIAndUpper('(' + data.tradeCommCode + ') - ' + name);
        data.completeStockName = toASCIIfunction(data.completeStockName).toLocaleUpperCase().replace(' ', '');
        if (data.completeStockName.match(regex)) {
          arr.push(data);
        }
      }
      return arr;
    };

    var handleStockSearchRecod = function () {
      var $noRecentSearch = $popup.find('#noRecentSearch');
      var $recentSearch = $popup.find('#recentSearch');
      var $searchInput = $popup.find('#searchInput');
      var $list = $recentSearch.find('.tags');
      var value = This.commonService.CacheStockSearchRecodeService.get();
      if (value) {
        $noRecentSearch.addClass('none');
        $recentSearch.removeClass('none');
        $list.empty();
        list = value.split(',');
        if (list && list.length > 0) {
          var html = '';
          for (var i = 0, len = list.length; i < len; i++) {
            html +=
              '<li class="tag" data-name="' +
              list[i] +
              '"><a href="javascript:void(0)"></a><a href="javascript:void(0)" class="delete" data-name="' +
              list[i] +
              '"></a>' +
              list[i] +
              '</li>';
          }
          $list.append(html);
        } else {
          $noRecentSearch.removeClass('none');
          $recentSearch.addClass('none');
        }
      } else {
        $noRecentSearch.removeClass('none');
        $recentSearch.addClass('none');
      }
      var recordTagClick = function (e) {
        var targetName = jq(this).data('name');
        $searchInput.val(targetName);
        set.cacheSearchVal = $searchInput.val();
        handleStockSearchView($popup.find('#searchInput').val());
      };
      var delRecordTagClick = function (e) {
        e.stopPropagation();
        var targetName = jq(this).data('name');
        var stockSearchRecodVal = This.commonService.CacheStockSearchRecodeService.get();
        if (stockSearchRecodVal) {
          stockSearchRecodVal = stockSearchRecodVal.split(',');
          stockSearchRecodVal = stockSearchRecodVal.filter(function (item) {
            return item != targetName;
          });
          var value = '';
          if (stockSearchRecodVal.length > 0) {
            for (var i = 0, len = stockSearchRecodVal.length; i < len; i++) {
              if (i === 0) {
                value += stockSearchRecodVal[i];
              } else {
                value += ',' + stockSearchRecodVal[i];
              }
            }
          }
          This.commonService.CacheStockSearchRecodeService.set(value);
          handleStockSearchRecod();
        }
      };
      $popup.find('#recentSearch .delete').off().on('click', delRecordTagClick);
      $popup.find('#recentSearch .tag').off().on('click', recordTagClick);
      $popup
        .find('.btn_search')
        .off()
        .on('click', function () {
          if (!$popup.find('#searchInput').val()) {
            return;
          }
          set.cacheSearchVal = $popup.find('#searchInput').val();
          handleStockSearchView($popup.find('#searchInput').val());
        });
      $popup
        .find('.btn_delete')
        .off()
        .on('click', function () {
          set.cacheSearchVal = '';
          $popup.find('#searchInput').val('');
          var value = $popup.find('#searchInput').val();
          handleStockSearchView(value);
          handleStockSearchRecod();
        });
      $popup
        .find('.btn_filter')
        .off()
        .on('click', function (e) {
          interface.close();
          event.filterBtnClick && event.filterBtnClick();
        });
    };

    var handleStockSearchView = function (inputValue) {
      $popup.find('.list').empty();
      var $btnSearch = $popup.find('.btn_search');
      var $btnDelete = $popup.find('.btn_delete');
      var $hotTags = $popup.find('#hotTags');
      var $recentSearch = $popup.find('#recentSearch');
      var $noRecentSearch = $popup.find('#noRecentSearch');
      var $noRecord = $popup.find('#noRecord');
      var $list = $popup.find('.list');
      var $hasRecord = $popup.find('#hasRecord');
      var stockAllList = set.stockAllListService;
      var injectStockCard = function (stockList) {
        sortKey = 'tradeCommCode';
        //設定排序
        setSortKey();
        This.StockCardModule()
          .set('data', stockList)
          .set('hasSort', true)
          .set('sortKey', sortKey)
          .event('click', event.stockCardClick)
          .event('clickLinkBox', event.stockCardLinkBoxClick)
          .appendTo(set.selector + ' .list')
          .build()
          .mounted(function () {
            yuantaApp.gettransarr();
            yuantaApp.popupResize('stockProductSearchPopup');
          });
      };

      if (inputValue) {
        $hotTags.addClass('none');
        $recentSearch.addClass('none');
        $noRecentSearch.addClass('none');
        $btnSearch.addClass('none');
        $btnDelete.removeClass('none');
        $list.removeClass('none');
        $noRecord.addClass('none');
        fuzzyStockRes = fuzzySearch(stockAllList, inputValue);
        if (fuzzyStockRes.length > 0) {
          $hasRecord
            .removeClass('none')
            .children('p')
            .text('共' + fuzzyStockRes.length + '筆結果');
          injectStockCard(fuzzyStockRes);
        } else {
          $hasRecord.addClass('none');
          $noRecord.removeClass('none');
        }
        if (This.commonService.CacheStockSearchRecodeService.get()) {
          var stockSearchRecode = This.commonService.CacheStockSearchRecodeService.get().split(',');
          if (stockSearchRecode.indexOf(inputValue) <= -1) {
            var value = This.commonService.CacheStockSearchRecodeService.get() + ',' + inputValue;
            This.commonService.CacheStockSearchRecodeService.set(value);
          }
        } else {
          This.commonService.CacheStockSearchRecodeService.set(inputValue);
        }
      } else {
        $btnSearch.removeClass('none');
        $btnDelete.addClass('none');
        $hotTags.removeClass('none');
        $noRecord.addClass('none');
        $list.addClass('none');
        $hasRecord.addClass('none');
      }

      yuantaApp.gettransarr();
      yuantaApp.popupResize('stockProductSearchPopup');
      jq.unblockUI();
    };

    var render = function () {
      handleStockSearchRecod();
    };

    function setData() {
      render();
      setEvent();
    }

    var setEvent = function () {
      var $selector = jq(set.selector);
      var $sortWay_a = $selector.find('.sort_way > a');

      //排序下拉選單
      $sortWay_a.on('click', function () {
        yuantaApp.popupNewMenuList('請選擇排序方式', menuList, null, null, function (data) {
          sortKey = data.sortKey;
          setSortKey();
          This.StockCardModule()
            .set('data', fuzzyStockRes)
            .set('hasSort', true)
            .set('sortKey', sortKey)
            .event('click', event.stockCardClick)
            .event('clickLinkBox', event.stockCardLinkBoxClick)
            .appendTo(set.selector + ' .list')
            .build()
            .mounted(function () {
              yuantaApp.gettransarr();
              yuantaApp.popupResize('stockProductSearchPopup');
            });
        });
      });

      var searchKeyupEvent = (function () {
        var timer = null;
        return function (e) {
          if (timer) {
            clearTimeout(timer);
          }
          timer = setTimeout(function () {
            var $popup = jq('#stockProductSearchPopup');
            var $btnSearch = $popup.find('.btn_search');
            var $btnDelete = $popup.find('.btn_delete');
            if (e.target.value && e.target.value === set.cacheSearchVal) {
              $btnSearch.addClass('none');
              $btnDelete.removeClass('none');
            } else if (e.target.value && e.target.value !== set.cacheSearchVal) {
              $btnSearch.removeClass('none');
              $btnDelete.addClass('none');
            } else {
              handleStockSearchView('');
              handleStockSearchRecod();
            }
          }, 100);
        };
      })();
      var searchKeypressEvent = (function () {
        var timer = null;
        return function (e) {
          if (timer) {
            clearTimeout(timer);
          }
          timer = setTimeout(function () {
            if (e && e.keyCode === 13 && e.target.value) {
              set.cacheSearchVal = e.target.value;
              handleStockSearchView(e.target.value);
              return;
            }
          }, 100);
        };
      })();
      $popup.find('.popup_right_close').off().on('click', event.close);
      $popup
        .find('#hotTags .tags .tag')
        .off()
        .on('click', function () {
          event.hotTagsClick(jq(this));
        });
      if (event.searchKeyupEvent) {
        $popup.find('#searchInput').on('keyup change', event.searchKeyupEvent);
      } else {
        $popup.find('#searchInput').on('keyup change', searchKeyupEvent);
      }
      if (event.searchKeypressEvent) {
        $popup.find('#searchInput').on('keyup change', event.searchKeypressEvent);
      } else {
        $popup.find('#searchInput').on('keyup change', searchKeypressEvent);
      }
    };

    var set = {
      selector: '',
      title: '',
      tags: [],
      stockList: [],
      cacheSearchVal: '',
      stockAllListService: []
    };
    var event = {
      close: function () {},
      hotTagsClick: function () {},
      search: function () {},
      stockCardClick: function () {},
      filterBtnClick: function () {},
      stockCardLinkBoxClick: function () {},
      searchKeyupEvent: null,
      searchKeypressEvent: null
    };
    var interface = {
      open: function () {
        location.replace(set.selector);
        yuantaApp.gettransarr();
        yuantaApp.popupResize(set.selector.replace('#', ''));
        return interface;
      },
      close: function () {
        jq(set.selector).empty();
        location.replace('#');
        yuantaApp.gettransarr();
        return interface;
      },
      mounted: function (cb) {
        if (cb && jq.isFunction(cb)) {
          cb();
        }
        return interface;
      },
      destory: function () {
        return interface;
      }
    };
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $popup.appendTo(selector);
        return buildInterface;
      },
      adjust: function (cb) {
        cb($popup);
        return buildInterface;
      },
      build: function () {
        setTitle();
        setTags();
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //熱門搜尋
  StockSubscriptionComponent.prototype.stockPopularityRankingTagPopupModule = function () {
    var html =
      '<div class="popup newBlock">\
        <div class="popup_close" tabindex="0" data-aria="cancel">\
          <img src="images/menu_back.png" role="button" alt="" />\
        </div>\
        <div class="popup_title background_base bg_blue">\
          <span class="txt" data-txt=""></span>\
        </div>\
        <div class="popup_content">\
          <div class="wrapper">\
            <div class="inside">\
              <div class="content">\
                <section>\
                  <ul class="tags">\
                    <li id="tagName" class="txt" data-txt=""></li>\
                  </ul>\
                </section>\
                <section class="twoSet">\
                  <p class="s_result"></p>\
                </section>\
                <ul class="list"></ul>\
              </div>\
            </div>\
          </div>\
        </div>\
      </div>';
    var $popup = jq(html);

    //popup標題
    function setTitle() {
      if (set.title) {
        var $txt = $popup.find('.popup_title').find('.txt');
        $txt.attr('data-txt', set.title);
      }
    }

    //熱門標籤名稱
    function setTagName() {
      if (set && set.tagName) {
        $popup.find('#tagName').attr('data-txt', set.tagName);
      }
    }

    var renderStockCard = function () {
      var count = set.stockList && set.stockList.length > 0 ? set.stockList.length : '0';
      var selector = set.selector + ' .list';
      $popup.find('.s_result').text('共' + count + '筆結果');
      This.StockCardModule()
        .set('data', set.stockList)
        .event('click', event.stockCardClick)
        .event('clickLinkBox', event.stockCardLinkBoxClick)
        .appendTo(selector)
        .build();
      yuantaApp.popupResize('stockPopularityRankingTagPopup');
    };

    function setData() {
      renderStockCard();
      setEvent();
    }

    var setEvent = function () {
      $popup.find('.popup_close').off().on('click', event.close);
    };

    var set = {
      selector: '',
      title: '',
      tagName: '',
      stockList: []
    };
    var event = {
      close: function () {},
      stockCardClick: function () {},
      stockCardLinkBoxClick: function () {}
    };
    var interface = {
      open: function () {
        location.replace(set.selector);
        yuantaApp.gettransarr();
        yuantaApp.popupResize(set.selector.replace('#', ''));
        return interface;
      },
      close: function () {
        jq(set.selector).empty();
        location.replace('#');
        yuantaApp.gettransarr();
        return interface;
      },
      mounted: function (cb) {
        if (cb && jq.isFunction(cb)) {
          cb();
        }
        return interface;
      },
      destory: function () {
        return interface;
      }
    };
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $popup.appendTo(selector);
        return buildInterface;
      },
      adjust: function (cb) {
        cb($popup);
        return buildInterface;
      },
      build: function () {
        setTitle();
        setTagName();
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //篩選
  StockSubscriptionComponent.prototype.StockFilterSearchPopupModule = function () {
    var html =
      '<div class="popup newBlock">\
        <div class="popup_close" tabindex="0" data-aria="cancel">\
          <img src="images/menu_back.png" role="button" alt="" />\
        </div>\
        <div class="popup_title background_base bg_blue">\
          <span class="txt" data-txt=""></span>\
        </div>\
        <div class="popup_content">\
          <div class="wrapper">\
            <div class="inside">\
              <div class="content noSpace">\
                <div class="conditionBox">\
                  <div class="condition_set">\
                    <div class="tt_2">市場</div>\
                    <div id="area" class="option_box">\
                      <label><input id="allMarket" type="checkbox" name="market" value="allMarket" checked="true"><span>全部</span></label><br>\
                      <label><input id="US" type="checkbox" name="market" value="US"><span class="marketSpan checkedButton">美股</span></label>\
                      <label><input id="HK" type="checkbox" name="market" value="HK"><span class="marketSpan checkedButton">港股</span></label>\
                      <label><input id="HS" type="checkbox" name="market" value="HS"><span class="marketSpan checkedButton">滬股</span></label>\
                    </div>\
                  </div>\
                  <div class="condition_set">\
                    <div class="tt_2">風險報酬等級</div>\
                    <div class="option_box">\
                      <label><input type="checkbox" name="risk" value="1"><span>RR1</span></label><br>\
                      <label><input type="checkbox" name="risk" value="2"><span>RR2</span></label><br>\
                      <label><input type="checkbox" name="risk" value="3"><span>RR3</span></label><br>\
                      <label><input type="checkbox" name="risk" value="4"><span>RR4</span></label>\
                      <label><input type="checkbox" name="risk" value="5"><span>RR5</span></label>\
                    </div>\
                  </div>\
                  <div class="condition_set">\
                  <div class="tt_1">商品計價幣別<a href="javascript:void(0)" class="btn_more nth2"></a></div>\
                    <div class="expand nth2">\
                      <div id="currency" class="option_box typ_3set">\
                        <label><input type="checkbox" name="currency" value="USD"><span>美元</span></label>\
                        <label><input type="checkbox" name="currency" value="HKD"><span>港幣</span></label>\
                        <label><input type="checkbox" name="currency" value="CNY"><span>人民幣</span></label>\
                      </div>\
                    </div>\
                  </div>\
                </div>\
                <div class="bot_btn_set">\
                  <div class="reset"><a href="javascript:void(0)"></a>清除條件</div>\
                  <div class="confirm on"><a href="javascript:void(0)"></a>確定</div>\
                </div>\
              </div>\
            </div>\
          </div>\
        </div>\
      </div>';
    var $popup = jq(html);

    //popup標題
    function setTitle() {
      if (set.title) {
        var $txt = $popup.find('.popup_title').find('.txt');
        $txt.attr('data-txt', set.title);
      }
    }

    var popupReset = function () {
      //需求變更-第一階段先隱藏
      //僅顯示可定期(不)定額的股票
      // var $showRegularQuotaFlag = $popup.find('#showRegularQuotaFlag');
      // set.showRegularQuotaFlag = false;
      // $showRegularQuotaFlag.prop('checked', false);
      //市場
      var $allMarket = $popup.find('#allMarket');
      var $US = $popup.find('#US');
      var $HK = $popup.find('#HK');
      var $HS = $popup.find('#HS');
      var $marketSpan = $popup.find('.marketSpan');
      $allMarket.prop('checked', true);
      $US.prop('checked', false);
      $HK.prop('checked', false);
      $HS.prop('checked', false);
      $marketSpan.addClass('checkedButton');
      set.currentMarket = 'allMarket';
      //風險報酬等級
      var $risk = $popup.find('input[name="risk"]');
      $risk.prop('checked', false);
      set.currentSelectRisk = [];
      //商品計價幣別
      var $currency = $popup.find('input[name="currency"]');
      $currency.prop('checked', false);
      set.currentSelectCCyList = [];
    };

    var reudnerCurrency = function () {
      $btnMoreNthSeconed = jq('a.btn_more.nth2');
      $expandNthSeconed = jq('.expand.nth2');
      $btnMoreNthSeconed.off().on('click', function () {
        $expandNthSeconed.slideToggle();
        $btnMoreNthSeconed.toggleClass('active');
      });
    };

    var renderDefault = function () {
      if (set.defaultData && Object.keys(set.defaultData).length > 0) {
        //定期定額flag
        // set.showRegularQuotaFlag = set.defaultData.showRegularQuotaFlag;
        // $popup.find('#showRegularQuotaFlag').prop('checked', set.showRegularQuotaFlag);
        //市場
        set.currentMarket = set.defaultData.currentMarket;
        if (set.currentMarket.length > 0) {
          jq.each($popup.find('input[name="market"]'), function (index, elm) {
            var $this = jq(elm);
            var value = $this.val();
            if (value == set.currentMarket) {
              $this.prop('checked', true);
            } else {
              $this.prop('checked', false);
            }
          });
        }
        //風險等級
        set.currentSelectRisk = set.defaultData.currentSelectRisk;
        if (set.currentSelectRisk.length > 0) {
          jq.each($popup.find('input[name="risk"]'), function (index, elm) {
            var $this = jq(elm);
            var value = $this.val();
            if (set.currentSelectRisk.includes(value)) {
              $this.prop('checked', true);
            } else {
              $this.prop('checked', false);
            }
          });
        }
        //商品計價幣別
        set.currentSelectCCyList = set.defaultData.currentSelectCCyList;
        if (set.currentSelectCCyList.length > 0) {
          jq.each($popup.find('input[name="currency"]'), function (index, elm) {
            var $this = jq(elm);
            var value = $this.val();
            if (set.currentSelectCCyList.includes(value)) {
              $this.prop('checked', true);
            } else {
              $this.prop('checked', false);
            }
          });
          jq('a.btn_more.nth2').click();
        }
      }
    };

    function setData() {
      reudnerCurrency();
      renderDefault();
      setEvent();
    }

    var setEvent = function () {
      $popup.find('.popup_close').off().on('click', event.popupClose);
      $popup
        .find('.confirm')
        .off()
        .on('click', function () {
          event.popupConfirm && event.popupConfirm(set);
        });
      $popup
        .find('.reset')
        .off()
        .on('click', function () {
          popupReset();
        });

      // //顯示定期定額或者定期不定額
      // $popup
      //   .find('#showRegularQuotaFlag')
      //   .off()
      //   .on('click', function () {
      //     var $this = jq(this);
      //     var isChecked = $this.prop('checked');
      //     set.showRegularQuotaFlag = isChecked;
      //   });
      //市場
      $popup
        .find('input[name="market"]')
        .off()
        .on('click', function () {
          var $this = jq(this);
          var $marketSpan = $popup.find('.marketSpan');
          if ($this.val() == 'allMarket') {
            $marketSpan.addClass('checkedButton');
          } else {
            $marketSpan.removeClass('checkedButton');
          }
          if ($this.val() == set.currentMarket) {
            $this.prop('checked', true);
          } else {
            $popup.find('input[name="market"]').prop('checked', false);
            $this.prop('checked', true);
            set.currentMarket = $this.val();
          }
        });
      //風險報酬等級
      $popup
        .find('input[name="risk"]')
        .off()
        .on('click', function () {
          var $this = jq(this);
          var value = jq(this).val();
          var isChecked = $this.prop('checked');
          if (set.currentSelectRisk && set.currentSelectRisk.length > 0) {
            if (!set.currentSelectRisk.includes(value) && isChecked) {
              set.currentSelectRisk.push(value);
            } else if (set.currentSelectRisk.includes(value) && !isChecked) {
              set.currentSelectRisk = set.currentSelectRisk.filter(function (item) {
                return item != value;
              });
            }
          } else {
            if (isChecked) {
              set.currentSelectRisk.push(value);
            }
          }
        });
      //商品計價幣別
      $popup
        .find('input[name="currency"]')
        .off()
        .on('click', function () {
          var $this = jq(this);
          var value = $this.val();
          var isChecked = $this.prop('checked');
          if (set.currentSelectCCyList && set.currentSelectCCyList.length > 0) {
            if (!set.currentSelectCCyList.includes(value) && isChecked) {
              set.currentSelectCCyList.push(value);
            } else if (set.currentSelectCCyList.includes(value) && !isChecked) {
              set.currentSelectCCyList = set.currentSelectCCyList.filter(function (item) {
                return item != value;
              });
            }
          } else {
            if (isChecked) {
              set.currentSelectCCyList.push(value);
            }
          }
        });
    };

    var set = {
      selector: '',
      title: '篩選條件',
      currentMarket: 'allMarket',
      currentSelectRisk: [],
      currentSelectCCyList: [],
      showRegularQuotaFlag: false,
      defaultData: {}
    };
    var event = {
      popupClose: function () {},
      popupConfirm: function () {},
      popupReset: function () {},
      showRegularQuotaFlag: function () {}
    };
    var interface = {
      open: function () {
        location.replace(set.selector);
        yuantaApp.gettransarr();
        yuantaApp.popupResize(set.selector.replace('#', ''));
        return interface;
      },
      close: function () {
        jq(set.selector).empty();
        location.replace('#');
        yuantaApp.gettransarr();
        return interface;
      },
      mounted: function (cb) {
        if (cb && jq.isFunction(cb)) {
          cb();
        }
        return interface;
      },
      destory: function () {
        return interface;
      }
    };
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $popup.appendTo(selector);
        return buildInterface;
      },
      adjust: function (cb) {
        cb($popup);
        return buildInterface;
      },
      build: function () {
        setTitle();
        setData();
        return interface;
      }
    };
    return buildInterface;
  };

  //條件篩選結果
  StockSubscriptionComponent.prototype.StockSearchResultPopupModule = function () {
    var html =
      '<div class="popup newBlock">\
        <div class="popup_close" tabindex="0" data-aria="cancel">\
          <img src="images/menu_back.png" role="button" alt="" />\
        </div>\
        <div class="popup_title background_base bg_blue">\
          <span class="txt" data-txt=""></span>\
        </div>\
        <div class="popup_content">\
          <div class="wrapper">\
            <div class="inside">\
              <div class="content">\
                <section>\
                  <ul id="queryBean" class="tags ty3"></ul>\
                </section>\
                <section id="resultCount" class="twoSet none">\
                  <p class="s_result">共5筆結果</p>\
                </section>\
                <ul class="list"></ul>\
                <div class="s_result_Box none">\
                  <p class="noRecord"><span>無符合條件的結果</span></p>\
                </div>\
              </div>\
            </div>\
          </div>\
        </div>\
      </div>';
    var $popup = jq(html);

    //popup標題
    function setTitle() {
      if (set.title) {
        if (set.title) {
          var $txt = $popup.find('.popup_title').find('.txt');
          $txt.attr('data-txt', set.title);
        }
      }
    }

    //顯示選擇的篩選條件tag
    var renderTags = function (query) {
      var $queryBean = $popup.find('#queryBean');
      var html = '';
      $queryBean.empty();
      //市場
      if (query.currentMarket === 'allMarket') {
        html += '<li style="padding:0px 25px;">全部</li>';
      } else if (query.currentMarket === 'US') {
        html += '<li style="padding:0px 25px;">美股</li>';
      } else if (query.currentMarket === 'HK') {
        html += '<li style="padding:0px 25px;">港股</li>';
      } else if (query.currentMarket === 'HS') {
        html += '<li style="padding:0px 25px;">滬股</li>';
      }
      //風險報酬等級
      if (query.currentSelectRisk && query.currentSelectRisk.length > 0) {
        for (var i = 0; (risk = query.currentSelectRisk[i]); i++) {
          html += ' <li><a href="javascript:void(0)" class="risk delete" data-risk="' + risk + '"></a>' + 'RR' + risk + '</li>';
        }
      }
      //商品計價幣別
      if (query.currentSelectCCyList && query.currentSelectCCyList.length > 0) {
        for (var i = 0; (cc = query.currentSelectCCyList[i]); i++) {
          html += ' <li><span class="txt" data-txt="' + cc + '" ></span><a href="javascript:void(0)" class="cc delete" data-cc="' + cc + '"></a></li>';
        }
      }
      $queryBean.append(html);

      //刪除條件
      var $cc = $queryBean.find('.cc');
      $cc.off().on('click', function (e) {
        e.stopPropagation();
        var $this = jq(this);
        var cc = $this.data('cc');
        set.query.currentSelectCCyList = set.query.currentSelectCCyList.filter(function (data) {
          return data != cc;
        });
        setData();
      });
      var $risk = $queryBean.find('.risk');
      $risk.off().on('click', function (e) {
        e.stopPropagation();
        var $this = jq(this);
        var risk = $this.data('risk');
        set.query.currentSelectRisk = set.query.currentSelectRisk.filter(function (data) {
          return data != risk;
        });
        setData();
      });
    };

    var renderStockCard = function (stocksListAll, query) {
      // var showRegularQuotaFlag = query.showRegularQuotaFlag;
      var currentMarket = query.currentMarket || '';
      var currentSelectRisk = query.currentSelectRisk || [];
      var currentSelectCCyList = query.currentSelectCCyList || [];
      var $list = $popup.find('.list');
      var $resultCount = $popup.find('#resultCount');
      var $resultCountText = $resultCount.find('p');
      var $noRecord = $popup.find('.s_result_Box');

      var filterInvType = (function () {
        var invTypeList = ['2', '3']; // invType: "3" 2 or 3 顯示定期定額
        return function (arr) {
          if (arr && arr.length > 0) {
            return arr.filter(function (data) {
              return invTypeList.includes(data.invType);
            });
          } else {
            return [];
          }
        };
      })();

      var filtersMarket = function (arr) {
        if (arr && arr.length > 0) {
          return arr.filter(function (data) {
            return data.marketArea == currentMarket || data.tradeCode == currentMarket;
          });
        } else {
          return [];
        }
      };

      var filtersRiskLevel = function (arr) {
        if (arr && arr.length > 0) {
          return arr.filter(function (data) {
            return currentSelectRisk.includes(data.risk);
          });
        } else {
          return [];
        }
      };

      var filterCurrency = function (arr) {
        if (arr && arr.length > 0) {
          var ccyList = currentSelectCCyList;
          return arr.filter(function (data) {
            return ccyList.includes(data.currency);
          });
        } else {
          return [];
        }
      };

      $list.empty();
      // if (showRegularQuotaFlag) {
      //   stocksListAll = filterInvType(stocksListAll);
      // }
      if (currentMarket !== 'allMarket') {
        stocksListAll = filtersMarket(stocksListAll);
      }
      if (currentSelectRisk && currentSelectRisk.length > 0) {
        stocksListAll = filtersRiskLevel(stocksListAll);
      }
      if (currentSelectCCyList && currentSelectCCyList.length > 0) {
        stocksListAll = filterCurrency(stocksListAll);
      }
      if (stocksListAll.length > 0) {
        var bindCardNode = set.selector + ' .content .list';
        This.StockCardModule()
          .set('data', stocksListAll)
          .event('click', event.stockCardClick)
          .event('clickLinkBox', event.stockCardLinkBoxClick)
          .appendTo(bindCardNode)
          .build();
        $resultCount.removeClass('none');
        $noRecord.addClass('none');
        $resultCountText.text('共' + stocksListAll.length + '筆結果');
      } else {
        $noRecord.removeClass('none');
        $resultCountText.text('共0筆結果');
      }
    };

    function setData() {
      renderTags(set.query);
      renderStockCard(set.stocksListAll, set.query);
      yuantaApp.gettransarr();
    }

    var setEvent = function () {
      $popup
        .find('.popup_close')
        .off()
        .on('click', function () {
          event.popupClose(set.query);
        });
    };

    var set = {
      selector: '',
      title: '',
      query: {},
      stocksListAll: []
    };
    var event = {
      popupClose: function () {},
      stockCardClick: function () {},
      stockCardLinkBoxClick: function () {}
    };
    var interface = {
      open: function () {
        location.replace(set.selector);
        yuantaApp.gettransarr();
        yuantaApp.popupResize(set.selector.replace('#', ''));
        return interface;
      },
      close: function () {
        jq(set.selector).empty();
        location.replace('#');
        yuantaApp.gettransarr();
        return interface;
      },
      mounted: function (cb) {
        if (cb && jq.isFunction(cb)) {
          cb();
        }
        return interface;
      },
      destory: function () {
        return interface;
      }
    };
    var buildInterface = {
      set: function (name, value) {
        set[name] = value;
        return buildInterface;
      },
      event: function (name, value) {
        event[name] = value;
        return buildInterface;
      },
      appendTo: function (selector) {
        set.selector = selector;
        $popup.appendTo(selector);
        return buildInterface;
      },
      adjust: function (cb) {
        if (cb && jq.isFunction(cb)) {
          cb($popup);
        }
        return buildInterface;
      },
      build: function () {
        setTitle();
        setData();
        setEvent();
        return interface;
      }
    };
    return buildInterface;
  };

  return StockSubscriptionComponent;
})();