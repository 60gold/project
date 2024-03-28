export default {
  language: "zh_tw",
  windowWidth: 0, //視窗寬度
  handleScrollBar: "inherit", //控制滾輪出現
  publicObj: {}, //共用API取回的物件
  featureObj: {}, //功能總覽依此物件動態產生
  sideMenuObj: {}, //側邊選單依此物件動態產生
  allTitleMap: {}, //分類title的中文(或英文)
  controllTimerReset: false, //控制10min計時器重製
  errorMessage: {
    zh_tw: "系統錯誤",
    en: "System Error",
  }, // 顯示於錯誤頁的訊息
  nibUrl: "", //目前網址的首頁
  jspSearchContent: "", //jsp按下搜尋回傳的搜尋內容
  foBtnClick: false, //當懸浮總覽頁按鈕按下
  showHeaderFooter: true, //開新分頁是否顯示HeaderFooter
  acrossPages: false, //是否是開新分頁並導頁情況
  acrossPagesName: "", //存入導頁的name
};
