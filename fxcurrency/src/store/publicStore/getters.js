export default {
  //取得目前語言
  getLanguage(state) {
    return state.language;
  },
  //取得目前視窗寬度
  getWindowWidth(state) {
    return state.windowWidth;
  },
  //取得控制滾動調是否出現狀態
  getHandleScrollBar(state) {
    return state.handleScrollBar;
  },
  //取得共用api回傳物件
  getPublicObj(state) {
    return state.publicObj;
  },
  //取得側邊選單物件
  getSideMenuObj(state) {
    return state.sideMenuObj;
  },
  //取得控制10min時間重製狀態
  getControllTimerReset(state) {
    return state.controllTimerReset;
  },
  //取得總覽頁物件
  getFeatureObj(state) {
    return state.featureObj;
  },
  //取得所有title名稱物件
  getAllTitleMap(state) {
    return state.allTitleMap;
  },
  //取得錯誤訊息
  getErrorMessage(state) {
    return state.errorMessage;
  },
  //取得目前網址的首頁
  getNibUrl(state) {
    const aOriginalUrl = window.location.href.split("/");
    if (aOriginalUrl[2] === "ebank.yuantabank.com.tw") {
      return "https://ebank.yuantabank.com.tw/nib";
    } else if (aOriginalUrl[2].slice(0, 9) === "localhost") {
      state.nibUrl =
        aOriginalUrl[0] +
        "/" +
        aOriginalUrl[1] +
        "/" +
        aOriginalUrl[2] +
        process.env.VUE_APP_AXIOS_BASEURL;
    } else {
      //測試:請自行更換路徑
      state.nibUrl =
        aOriginalUrl[0] +
        "/" +
        aOriginalUrl[1] +
        "/" +
        aOriginalUrl[2] +
        process.env.VUE_APP_AXIOS_BASEURL;
    }
    return state.nibUrl;
  },
  //取得jsp回傳搜尋結果
  getJspSearchContent(state) {
    return state.jspSearchContent;
  },
  //取得懸浮總覽頁按鈕按下布林值
  getFoBtnClick(state) {
    return state.foBtnClick;
  },
  //取得開新分頁是否顯示HeaderFooter
  getShowHeaderFooter(state) {
    return state.showHeaderFooter;
  },
  //是否是開新分頁並導頁情況
  getAcrossPages(state) {
    return state.acrossPages;
  },
  //存入導頁的name
  getAcrossPagesName(state) {
    return state.acrossPagesName;
  },
};
