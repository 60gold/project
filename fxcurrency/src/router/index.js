import { createRouter, createWebHistory } from "vue-router"; // history Y
// import { createRouter, createWebHashHistory } from "vue-router"; // history F

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/featureOverview/FeatureOverview.vue"),
  },
  {
    path: "/feature-overview",
    name: "featureOverview", //總覽頁
    component: () => import("@/views/featureOverview/FeatureOverview.vue"),
  },
  //臺幣
  {
    path: "/twdollar/sa004/010",
    name: "salaryDetails", //臺幣>薪轉優惠專區>薪轉戶薪資明細查詢-同意頁
    component: () => import("@/views/twDollar/salaryDetails/SalaryDetails.vue"),
  },
  {
    path: "/twdollar/sa004/020",
    name: "salaryDetailsInquire", //臺幣>薪轉優惠專區>薪轉戶薪資明細查詢-查詢與結果頁
    component: () =>
      import("@/views/twDollar/salaryDetails/SalaryDetailsInquire.vue"),
  },
  {
    path: "/twdollar/sa005",
    name: "tahpFund", //臺幣>薪轉優惠專區>退撥基金專戶查詢
    component: () => import("@/views/twDollar/tahpFund/TahpFund.vue"),
  },
  //外幣
  {
    path: "/fxDollar/tq002",
    component: () =>
      import("@/views/fxDollar/fxCurrencyQuery/FxCurrencyQuery.vue"),
    children: [
      {
        path: "010",
        name: "fxccyQuery", //外幣>帳務查詢>外幣現鈔申購查詢/變更>查詢頁
        component: () =>
          import("@/views/fxDollar/fxCurrencyQuery/FxCurrencyQueryMain.vue"),
      },
      {
        path: "020",
        name: "fxCurrencyQueryEnter", //外幣>帳務查詢>外幣現鈔申購查詢/變更>輸入頁
        component: () =>
          import("@/views/fxDollar/fxCurrencyQuery/FxCurrencyQueryEnter.vue"),
      },
      {
        path: "030",
        name: "fxCurrencyQueryConfirm", //外幣>帳務查詢>外幣現鈔申購查詢/變更>確認頁
        component: () =>
          import("@/views/fxDollar/fxCurrencyQuery/FxCurrencyQueryConfirm.vue"),
      },
      {
        path: "040",
        name: "fxCurrencyQueryResult", //外幣>帳務查詢>外幣現鈔申購查詢/變更>結果頁
        component: () =>
          import("@/views/fxDollar/fxCurrencyQuery/FxCurrencyQueryResult.vue"),
      },
    ],
  },
  {
    path: "/fxDollar/tx006",
    component: () => import("@/views/fxDollar/fxCurrency/FxCurrency.vue"),
    children: [
      {
        path: "010",
        name: "fxccyApply", //外幣>轉帳/匯款>外幣現鈔申購>注意事項
        component: () =>
          import("@/views/fxDollar/fxCurrency/FxCurrencyNotice.vue"),
      },
      {
        path: "020",
        name: "fxCurrencyEnter", //外幣>轉帳/匯款>外幣現鈔申購>輸入頁
        component: () =>
          import("@/views/fxDollar/fxCurrency/FxCurrencyEnter.vue"),
      },
      {
        path: "030",
        name: "fxCurrencyConfirm", //外幣>轉帳/匯款>外幣現鈔申購>確認頁
        component: () =>
          import("@/views/fxDollar/fxCurrency/FxCurrencyConfirm.vue"),
      },
      {
        path: "040",
        name: "fxCurrencyResult", //外幣>轉帳/匯款>外幣現鈔申購>結果頁
        component: () =>
          import("@/views/fxDollar/fxCurrency/FxCurrencyResult.vue"),
      },
      {
        path: "050/:showHeaderFooter?",
        name: "fxCurrencyPrint", //外幣>轉帳/匯款>外幣現鈔申購>列印水單
        component: () =>
          import("@/views/fxDollar/fxCurrency/FxCurrencyPrint.vue"),
      },
    ],
  },
  //理財/保險
  {
    path: "/finance-insurance/in001",
    name: "insurancequery", //理財/保險>保險>保單查詢
    component: () =>
      import("@/views/financeInsurance/insurance/InsuranceQuery.vue"),
  },
  {
    path: "/carbonAcct",
    name: "carbonAcct", //我的碳帳戶
    component: () => import("@/views/carbonAcct/CarbonAcct.vue"),
  },
  //黃金
  {
    path: "/golden/go001",
    name: "goldensummary", //(全小寫) //黃金存摺總覽
    component: () => import("@/views/golden/goldenSummary/GoldenSummary.vue"),
  },
  {
    path: "/golden/go002",
    component: () =>
      import(
        "@/views/golden/goldSummaryTransDetails/GoldSummaryTransDetailsParent.vue"
      ),
    children: [
      {
        path: "010",
        name: "goldsummary", //(全小寫) //黃金存摺總覽>黃金存摺帳戶內容查詢
        component: () =>
          import("@/views/golden/goldSummaryTransDetails/Goldsummary.vue"),
      },
    ],
  },
  {
    path: "/golden/go003",
    component: () =>
      import(
        "@/views/golden/goldSummaryTransDetails/GoldSummaryTransDetailsParent.vue"
      ),
    children: [
      {
        path: "010",
        name: "goldtransDetails", //(小駝峰) //黃金存摺總覽>黃金存摺交易明細查詢
        component: () =>
          import("@/views/golden/goldSummaryTransDetails/GoldtransDetails.vue"),
      },
    ],
  },
  {
    path: "/golden/go004",
    component: () => import("@/views/golden/goldenBuy/GoldenBuyParent.vue"),
    children: [
      {
        path: "010",
        name: "GoldenBuy", //(大駝峰) //黃金存摺總覽>黃金存摺買進-注意事項
        component: () => import("@/views/golden/goldenBuy/GoldenBuy.vue"),
      },
      {
        path: "020",
        name: "goldenBuyDetail", //黃金存摺總覽>黃金存摺買進-資料輸入
        component: () => import("@/views/golden/goldenBuy/GoldenBuyDetail.vue"),
      },
      {
        path: "030",
        name: "goldenBuyCheck", //黃金存摺總覽>黃金存摺買進-資料確認
        component: () => import("@/views/golden/goldenBuy/GoldenBuyCheck.vue"),
      },
      {
        path: "040",
        name: "goldenBuyResult", //黃金存摺總覽>黃金存摺買進-交易結果
        component: () => import("@/views/golden/goldenBuy/GoldenBuyResult.vue"),
      },
    ],
  },
  {
    path: "/golden/go005",
    component: () => import("@/views/golden/goldenSell/GoldenSellParent.vue"),
    children: [
      {
        path: "010",
        name: "GoldenSell", //(大駝峰) //黃金存摺總覽>黃金存摺回售-注意事項
        component: () => import("@/views/golden/goldenSell/GoldenSell.vue"),
      },
      {
        path: "020",
        name: "goldenSellDetail", //黃金存摺總覽>黃金存摺回售-資料輸入
        component: () =>
          import("@/views/golden/goldenSell/GoldenSellDetail.vue"),
      },
      {
        path: "030",
        name: "goldenSellCheck", //黃金存摺總覽>黃金存摺回售-資料確認
        component: () =>
          import("@/views/golden/goldenSell/GoldenSellCheck.vue"),
      },
      {
        path: "040",
        name: "goldenSellResult", //黃金存摺總覽>黃金存摺回售-交易結果
        component: () =>
          import("@/views/golden/goldenSell/GoldenSellResult.vue"),
      },
    ],
  },
  {
    path: "/foreignETF/Summary",
    component: () =>
      import("@/views/foreignETF/foreignETFSummary/foreignETFSummary.vue"),
    children: [
      {
        path: "010",
        name: "OffshoreETFSummary", //境外股票ETF總覽-有庫存
        component: () =>
          import(
            "@/views/foreignETF/foreignETFSummary/foreignETFSummaryHasStocks.vue"
          ),
      },
      {
        path: "020",
        name: "foreignETFSummaryNoneStock", //境外股票ETF總覽-無庫存
        component: () => import("@/views/foreignETF/foreignETFNoneStock.vue"),
      },
      {
        path: "030",
        name: "foreignETFSummaryDetail", //境外股票ETF總覽-申購明細
        component: () =>
          import(
            "@/views/foreignETF/foreignETFSummary/foreignETFSummaryDetail.vue"
          ),
      },
      {
        path: "040",
        name: "foreignETFSummaryRegularAmount", //境外股票ETF總覽-定期定額查詢
        component: () =>
          import(
            "@/views/foreignETF/foreignETFSummary/foreignETFSummaryRegularAmount.vue"
          ),
      },
    ],
  },
  {
    path: "/foreignETF/Buy",
    component: () =>
      import("@/views/foreignETF/foreignETFBuy/foreignETFBuy.vue"),
    children: [
      {
        path: "010",
        name: "OffshoreETFApply", //境外股票ETF申購-輸入頁
        component: () =>
          import("@/views/foreignETF/foreignETFBuy/foreignETFBuyInput.vue"),
      },
      {
        path: "020",
        name: "foreignETFBuyArticle", //境外股票ETF申購-條文簽署頁
        component: () =>
          import("@/views/foreignETF/foreignETFBuy/foreignETFBuyArticle.vue"),
      },
      {
        path: "030",
        name: "foreignETFBuyConfirm", //境外股票ETF申購-確認頁
        component: () =>
          import("@/views/foreignETF/foreignETFBuy/foreignETFBuyConfirm.vue"),
      },
      {
        path: "040",
        name: "foreignETFBuyResult", //境外股票ETF申購-結果頁
        component: () =>
          import("@/views/foreignETF/foreignETFBuy/foreignETFBuyResult.vue"),
      },
    ],
  },
  {
    path: "/foreignETF/Sell",
    component: () =>
      import("@/views/foreignETF/foreignETFSell/foreignETFSell.vue"),
    children: [
      {
        path: "010",
        name: "OffshoreETFSell", //境外股票ETF賣出-輸入頁
        component: () =>
          import("@/views/foreignETF/foreignETFSell/foreignETFSellInput.vue"),
      },
      {
        path: "020",
        name: "foreignETFSellArticle", //境外股票ETF賣出-條文簽署頁
        component: () =>
          import("@/views/foreignETF/foreignETFSell/foreignETFSellArticle.vue"),
      },
      {
        path: "030",
        name: "foreignETFSellConfirm", //境外股票ETF賣出-確認頁
        component: () =>
          import("@/views/foreignETF/foreignETFSell/foreignETFSellConfirm.vue"),
      },
      {
        path: "040",
        name: "foreignETFSellResult", //境外股票ETF賣出-結果頁
        component: () =>
          import("@/views/foreignETF/foreignETFSell/foreignETFSellResult.vue"),
      },
      {
        path: "050",
        name: "foreignETFSellNoneStock", //境外股票ETF賣出-無庫存
        component: () => import("@/views/foreignETF/foreignETFNoneStock.vue"),
      },
    ],
  },
  {
    path: "/foreignETF/Query",
    component: () =>
      import("@/views/foreignETF/foreignETFQuery/foreignETFQuery.vue"),
    children: [
      {
        path: "010",
        name: "OffshoreETFQuery", //境外股票ETF成交結果交易明細查詢-輸入頁
        component: () =>
          import("@/views/foreignETF/foreignETFQuery/foreignETFQueryInput.vue"),
      },
      {
        path: "020",
        name: "foreignETFQueryResult", //境外股票ETF成交結果交易明細查詢-結果頁
        component: () =>
          import(
            "@/views/foreignETF/foreignETFQuery/foreignETFQueryResult.vue"
          ),
      },
      {
        path: "030",
        name: "foreignETFQueryDetail", //境外股票ETF成交結果交易明細查詢-委託明細
        component: () =>
          import(
            "@/views/foreignETF/foreignETFQuery/foreignETFQueryDetail.vue"
          ),
      },
    ],
  },
  {
    path: "/foreignETF/QAR",
    component: () =>
      import("@/views/foreignETF/foreignETFQueryAndRevoke/foreignETFQAR.vue"),
    children: [
      // {
      //   path: "010",
      //   name: "OffshoreETFQueryDelete", //境外股票ETF成交結果交易明細查詢與撤銷-搜尋輸入頁
      //   component: () =>
      //     import(
      //       "@/views/foreignETF/foreignETFQueryAndRevoke/foreignETFQARQueryInput.vue"
      //     ),
      // },
      {
        path: "020",
        name: "OffshoreETFQueryDelete", //境外股票ETF成交結果交易明細查詢與撤銷-搜尋結果頁
        component: () =>
          import(
            "@/views/foreignETF/foreignETFQueryAndRevoke/foreignETFQARQueryResult.vue"
          ),
      },
      {
        path: "030",
        name: "foreignETFQARRevoke", //境外股票ETF成交結果交易明細查詢與撤銷-委託撤銷頁
        component: () =>
          import(
            "@/views/foreignETF/foreignETFQueryAndRevoke/foreignETFQARRevoke.vue"
          ),
      },
      {
        path: "040",
        name: "foreignETFQARRevokeResult", //境外股票ETF成交結果交易明細查詢與撤銷-委託撤銷結果頁
        component: () =>
          import(
            "@/views/foreignETF/foreignETFQueryAndRevoke/foreignETFQARRevokeResult.vue"
          ),
      },
      {
        path: "050",
        name: "foreignETFQARDealChangeSelect", //境外股票ETF成交結果交易明細查詢與撤銷-約定變更查詢頁
        component: () =>
          import(
            "@/views/foreignETF/foreignETFQueryAndRevoke/foreignETFQARDealChangeSelect.vue"
          ),
      },
      {
        path: "060",
        name: "foreignETFQARDealChangeInput", //境外股票ETF成交結果交易明細查詢與撤銷-約定變更輸入頁
        component: () =>
          import(
            "@/views/foreignETF/foreignETFQueryAndRevoke/foreignETFQARDealChangeInput.vue"
          ),
      },
      {
        path: "070",
        name: "foreignETFQARDealChangeConfirm", //境外股票ETF成交結果交易明細查詢與撤銷-約定變更確認頁
        component: () =>
          import(
            "@/views/foreignETF/foreignETFQueryAndRevoke/foreignETFQARDealChangeConfirm.vue"
          ),
      },
      {
        path: "080",
        name: "foreignETFQARDealChangeResult", //境外股票ETF成交結果交易明細查詢與撤銷-約定變更結果頁
        component: () =>
          import(
            "@/views/foreignETF/foreignETFQueryAndRevoke/foreignETFQARDealChangeResult.vue"
          ),
      },
    ],
  },
  {
    path: "/PayrollAccountAction/familyShare", // 親屬同享薪轉優惠
    component: () => import("@/views/familyShare/familyShare.vue"),
    children: [
      {
        path: "010",
        name: "familyShareApply",
        component: () => import("@/views/familyShare/familyShareApply.vue"),
      },
      {
        path: "020",
        name: "familyShareQRCode",
        component: () => import("@/views/familyShare/familyShareQRCode.vue"),
      },
    ],
  },
  //ERROR PAGE錯誤頁
  {
    path: "/errorDefalutPage",
    name: "errorDefalutPage", //錯誤頁
    component: () => import("@/views/errorDefalutPage/ErrorDefalutPage.vue"),
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/errorDefalutPage/ErrorDefalutPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL), // history Y
  // history: createWebHashHistory(process.env.BASE_URL), // history F
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
  routes,
});

import {
  fnShowElLoading,
  fnHideElLoading,
} from "@/common/methodCommon/publicMethod";
import { apiPostGetMenuAuthApi } from "@/api/axios/publicAxios/publicAxios";
import store from "@/store/index.js";
import errorMapping from "@/api/json/publicJson/errorMapping.json";
let bFirstCallPubApi = false; //判斷是否有call過共用api
router.beforeEach(async (to) => {
  fnShowElLoading();
  store.dispatch("publicStore/handSetControllTimerResetState", true);
  //第一次call 共用api
  if (!bFirstCallPubApi) {
    bFirstCallPubApi = true;
    const oPublicObj = await store.dispatch("publicStore/publicApi");
    let routerName = oPublicObj.directRouterName;

    const bAcrossPages = store.getters["publicStore/getAcrossPages"];
    if (routerName === "" && bAcrossPages) {
      fnHideElLoading();
      return;
    } else {
      //如果routerName回傳FeaturesOverview例外判斷
      if (routerName === "FeaturesOverview") {
        routerName = "featureOverview";
      }
      console.log(routerName);
      fnHideElLoading();
      return { name: routerName };
    }
  }
  console.log(to.name);
  const reqData = JSON.stringify({
    routerName: to.name,
  });
  //權限api
  apiPostGetMenuAuthApi(reqData)
    .then((res) => {
      console.log(res.data);
      fnHideElLoading();
      //如果權限回傳false導錯誤頁
      if (!res.data.permission) {
        store.dispatch("publicStore/handSetErrorMessageState", {
          zh_tw: errorMapping[res.data.errorMessage],
          en: errorMapping[res.data.errorMessage],
        });
        return { name: "errorDefalutPage" };
      }
    })
    .catch((err) => {
      console.error("GetMenuAuthApi error:" + err);
      fnHideElLoading();
    });
});

export default router;
