<template>
  <!--表格-->
  <table class="formTable botM2" width="100%">
    <tr>
      <th width="180">
        {{ $t("fxDollar.fxCurrency.thTradeDate") }}
      </th>
      <td
        v-formatDate="{
          date: aCurrencyData[0].response.TransDate,
          changeFormat: 'YYYY/MM/DD',
          originalFormat: 'YYYYMMDD',
        }"
      ></td>
    </tr>
    <tr>
      <th>
        {{ $t("fxDollar.fxCurrency.thCurrencyAccountOut") }}
      </th>
      <td>
        <span class="color_blue block_span">{{ aDisplayCcy }} </span>
        {{ aCurrencyData[0].response.DisplayAcct }}
      </td>
    </tr>
    <tr>
      <th>
        {{ $t("fxDollar.fxCurrency.thTransAmount") }}
      </th>
      <td>
        <span v-formatPrice="aCurrencyData[0].response.TakeAmt"></span>
        {{ aCurrencyData[0].response.Getccy }}
      </td>
    </tr>
    <tr>
      <th>
        {{ $t("fxDollar.fxCurrency.thAmountDetail") }}
      </th>
      <td>
        <table class="tableAmountDetail">
          <tr>
            <th>
              {{ $t("fxDollar.fxCurrency.txtAmount") }}
            </th>
            <th>
              {{ $t("fxDollar.fxCurrency.txtNumber") }}
            </th>
            <th>{{ $t("fxDollar.fxCurrency.txtTotal") }}</th>
          </tr>
          <tr
            v-for="(list, index) in aCurrencyDetail"
            :key="list.Denomination"
            :id="index"
            :class="list.Denomination !== '0' ? 'showDetail' : ''"
            v-show="list.Denomination !== '0'"
          >
            <td>{{ list.Denomination }}</td>
            <td>{{ list.Sheet }}</td>
            <td class="color_orange" v-formatPrice="list.Total"></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr v-if="aCurrencyData[0].response.Outccy === 'TWD'">
      <th>
        {{ $t("fxDollar.fxCurrency.thFixedRate") }}
      </th>
      <td v-formatRate="aCurrencyData[0].response.BillRate"></td>
    </tr>
    <tr v-if="aCurrencyData[0].response.Outccy === 'TWD'">
      <th>
        {{ $t("fxDollar.fxCurrency.thDealRate") }}
      </th>
      <td>
        <div v-if="bLoadingRateOK">
          <span v-formatRate="sDealRate"></span>
          <span
            >(<span class="color_red">{{ sSencond }} </span
            >{{ $t("fxDollar.fxCurrency.txtRefleshRate") }})</span
          >
        </div>
        <div class="apiLoading" v-if="!bLoadingRateOK">
          <img src="@/assets/images/gif/progress.gif" />
          {{ $t("fxDollar.fxCurrency.loading") }}
        </div>
      </td>
    </tr>
    <tr v-if="aCurrencyData[0].response.Outccy !== 'TWD'">
      <th>
        {{ $t("fxDollar.fxCurrency.thWithdrawalFee") }}
      </th>
      <td>
        <span
          class="color_red"
          v-formatPriceFx="aCurrencyData[0].response.TrxFee"
        ></span
        >元
        {{ aCurrencyData[0].response.Outccy }}
      </td>
    </tr>
    <tr>
      <th>
        {{ $t("fxDollar.fxCurrency.thDebitAmount") }}
      </th>
      <td>
        <span class="color_red" v-formatPriceFx="sDebitAmount"></span>元
        {{ aCurrencyData[0].response.Outccy }}
      </td>
    </tr>
    <tr>
      <th>
        {{ $t("fxDollar.fxCurrency.thReserveBranch") }}
      </th>
      <td>
        {{ aCurrencyData[0].response.DisplayBranch }}
      </td>
    </tr>
    <tr>
      <th>
        {{ $t("fxDollar.fxCurrency.thReserveDate") }}
      </th>
      <td
        v-formatDate="{
          date: aCurrencyData[0].response.OrderDate,
          changeFormat: 'YYYY/MM/DD',
          originalFormat: 'YYYYMMDD',
        }"
      ></td>
    </tr>
    <tr>
      <th>
        {{ $t("fxDollar.fxCurrency.thTradeType") }}
      </th>
      <td>{{ sCBApplyCode }}</td>
    </tr>
    <tr>
      <th>
        {{ $t("fxDollar.fxCurrency.thTargetCountry") }}
      </th>
      <td>
        {{ aCurrencyData[0].response.Country }}
        {{ aCurrencyData[0].response.CountryName }}
      </td>
    </tr>
    <tr>
      <th>
        <span class="mustfill">*</span
        >{{ $t("fxDollar.fxCurrency.thTradeAuth") }}
      </th>
      <td>
        <div class="inputOption botM">
          <div class="inputOption_input">
            <input
              v-model="sTransAuth"
              type="password"
              autocomplete="off"
              maxlength="7"
              :placeholder="$t('fxDollar.fxCurrency.txtTransCheckDefault')"
            />
          </div>
          <div class="inputOption_info"></div>
        </div>
      </td>
    </tr>
  </table>
  <!--按鈕-->
  <div class="btn_check botM3">
    <a
      class="order_2 m_color_check"
      href="javascript:void(0)"
      @click.prevent="fnReturnPage"
      >{{ $t("fxDollar.fxCurrency.returnPage") }}</a
    >
    <a
      class="order_1 m_color_back"
      href="javascript:void(0)"
      @click.prevent="fnGoNextPage"
      >{{ $t("fxDollar.fxCurrency.sureEnter") }}</a
    >
  </div>
  <!--注意事項-->
  <SlotNote>
    <ol>
      <li v-html="$t('fxDollar.fxCurrency.note1_1')"></li>
      <li v-html="$t('fxDollar.fxCurrency.note1_2')"></li>
      <li v-html="$t('fxDollar.fxCurrency.note1_3')"></li>
      <li v-html="$t('fxDollar.fxCurrency.note1_4')"></li>
      <li v-html="$t('fxDollar.fxCurrency.note1_5')"></li>
      <li v-html="$t('fxDollar.fxCurrency.note1_6')"></li>
      <li v-html="$t('fxDollar.fxCurrency.note1_7')"></li>
      <li v-html="$t('fxDollar.fxCurrency.note1_8')"></li>
    </ol>
  </SlotNote>

  <!-- POPUP -->
  <ElDialog
    :propsDialogVisible="bDialogVisible"
    propsCustomClass="popup_showMessage"
    :propsShowClose="true"
    @emitCloseDialogFn="fnCloseDialog"
  >
    <template #body>
      <!-- 文字 -->
      <div class="popup_text">
        <p>{{ sPopupMessage }}</p>
      </div>
    </template>
    <template #footer>
      <!-- 按鈕 -->
      <div class="btn_check">
        <a
          class="m_color_back"
          href="javascript:void(0)"
          @click.prevent="bDialogVisible = false"
          >{{ $t("fxDollar.fxCurrency.close") }}</a
        >
      </div>
    </template>
  </ElDialog>
</template>

<script>
export default {
  name: "FxCurrencyConfirm",
};
</script>

<script setup>
import { ref, reactive, inject, onMounted, onBeforeUnmount } from "vue";
import ElDialog from "@/components/publicComponents/diolog_popup/SlotElDialogDefault.vue";
import {
  apiPostFxConfirm,
  apiPostFxResult,
} from "@/api/axios/fxDollar/fxCurrency.js";
import {
  fnShowElLoading,
  fnHideElLoading,
} from "@/common/methodCommon/publicMethod";
import qs from "qs";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const store = useStore();
const router = useRouter();
const { t } = useI18n();

//步驟2
const updateNStep = inject("updateNStep");
updateNStep(2);

//取得輸入頁資料
const aCurrencyData = inject("getCurrencyData");
console.log("aCurrencyData------------------------------");
console.log(aCurrencyData);

const sDealRate = ref(""); //成交匯率
const sSencond = ref(30); //成交匯率刷新倒數秒數
const bLoadingRateOK = ref(true); //顯示成交匯率
let limitCount = 0; //成交匯率刷新次數
let sLargeFlag = ""; //限額是否超過50萬(Y超過)

//成交匯率刷新
const timer = setInterval(() => {
  sSencond.value--;
  if (aCurrencyData[0].response.Outccy !== "TWD") {
    clearInterval(timer);
  } else {
    if (sSencond.value === 0) {
      setTimeout(() => {
        bLoadingRateOK.value = false;
        fnGetRate();
      }, 1000);
    }
  }
}, 1000);
onBeforeUnmount(() => {
  clearInterval(timer);
});

//取得匯率
const fnGetRate = async () => {
  limitCount++;
  if (limitCount >= 4) {
    //交易逾時
    sPopupMessage.value = t("fxDollar.fxCurrency.alertOverTime");
    bDialogVisible.value = true;
    clearInterval(timer);
    return;
  }

  const request = aCurrencyData[0].request;
  (async () => {
    try {
      const response = await apiPostFxConfirm(qs.stringify(request));
      console.log("apiPostFxConfirm success");
      console.log(response);
      if (response.data.status === "200") {
        const data = response.data.rsData;
        if (data) {
          sLargeFlag = data.LargeFlag;
          sDealRate.value = data.ExchangeRate;
          bLoadingRateOK.value = true;
        } else {
          store.dispatch("publicStore/handSetErrorMessageState", {
            zh_tw: "交易不明，若為帳務性交易，請洽服務人員，勿重複操作!",
            en: "Unidentified transaction, if the transaction is for accounting purposes, please contact our customer service and do not repeat the transaction!",
          });
          router.push({ name: "errorDefalutPage" });
        }
      } else if (response.data.status === "500") {
        console.log(
          "apiPostFxConfirm error message => " + response.data.errMsg
        );
        store.dispatch("publicStore/handSetErrorMessageState", {
          zh_tw: response.data.errMsg,
          en: response.data.errMsg,
        });
        router.push({ name: "errorDefalutPage" });
      }
    } catch (error) {
      console.log("apiPostFxConfirm error message => " + error);
      store.dispatch("publicStore/handSetErrorMessageState", {
        zh_tw: "交易不明，若為帳務性交易，請洽服務人員，勿重複操作!",
        en: "Unidentified transaction, if the transaction is for accounting purposes, please contact our customer service and do not repeat the transaction!",
      });
      router.push({ name: "errorDefalutPage" });
    }
  })();

  //重製倒數時間
  sSencond.value = 30;
};

const aCurrencyDetail = reactive([]); //指定現鈔明細
const aDisplayCcy = ref(""); //轉出幣別
const sDebitAmount = ref(""); //扣款總額
const sCBApplyCode = ref(""); //交易性質

const fnInitPage = () => {
  //置入指定現鈔明細
  let obj = [
    {
      Denomination: aCurrencyData[0].response.Denomination1,
      Sheet: aCurrencyData[0].response.Sheet1,
      Total: (
        +aCurrencyData[0].response.Denomination1 *
        +aCurrencyData[0].response.Sheet1
      ).toString(),
    },
    {
      Denomination: aCurrencyData[0].response.Denomination2,
      Sheet: aCurrencyData[0].response.Sheet2,
      Total: (
        +aCurrencyData[0].response.Denomination2 *
        +aCurrencyData[0].response.Sheet2
      ).toString(),
    },
    {
      Denomination: aCurrencyData[0].response.Denomination3,
      Sheet: aCurrencyData[0].response.Sheet3,
      Total: (
        +aCurrencyData[0].response.Denomination3 *
        +aCurrencyData[0].response.Sheet3
      ).toString(),
    },
    {
      Denomination: aCurrencyData[0].response.Denomination4,
      Sheet: aCurrencyData[0].response.Sheet4,
      Total: (
        +aCurrencyData[0].response.Denomination4 *
        +aCurrencyData[0].response.Sheet4
      ).toString(),
    },
    {
      Denomination: aCurrencyData[0].response.Denomination5,
      Sheet: aCurrencyData[0].response.Sheet5,
      Total: (
        +aCurrencyData[0].response.Denomination5 *
        +aCurrencyData[0].response.Sheet5
      ).toString(),
    },
    {
      Denomination: aCurrencyData[0].response.Denomination6,
      Sheet: aCurrencyData[0].response.Sheet6,
      Total: (
        +aCurrencyData[0].response.Denomination6 *
        +aCurrencyData[0].response.Sheet6
      ).toString(),
    },
  ];
  Array.prototype.push.apply(aCurrencyDetail, obj);

  //置入轉出幣別
  if (aCurrencyData[0].response.Outccy === "TWD") {
    aDisplayCcy.value = "TWD 新臺幣";
  } else if (aCurrencyData[0].response.Outccy === "USD") {
    aDisplayCcy.value = "USD 美元";
  } else if (aCurrencyData[0].response.Outccy === "EUR") {
    aDisplayCcy.value = "EUR 歐元";
  } else if (aCurrencyData[0].response.Outccy === "CNY") {
    aDisplayCcy.value = "CNY 人民幣";
  } else if (aCurrencyData[0].response.Outccy === "HKD") {
    aDisplayCcy.value = "HKD 港幣";
  } else if (aCurrencyData[0].response.Outccy === "JPY") {
    aDisplayCcy.value = "JPY 日圓";
  }

  //置入成交匯率
  sDealRate.value = aCurrencyData[0].response.ExchangeRate;

  //若轉出幣別為TWD，不顯示提領手續費 / 依幣別置入扣款總額
  if (aCurrencyData[0].response.Outccy === "TWD") {
    sDebitAmount.value = aCurrencyData[0].response.WithdrawAmTwd;
  } else {
    sDebitAmount.value = aCurrencyData[0].response.WithdrawAmt;
  }

  //置入交易性質
  if (aCurrencyData[0].response.CBApplyCode === "131") {
    sCBApplyCode.value = "131 - 商務支出";
  } else if (aCurrencyData[0].response.CBApplyCode === "132") {
    sCBApplyCode.value = "132 - 觀光支出";
  } else if (aCurrencyData[0].response.CBApplyCode === "133") {
    sCBApplyCode.value = "133 - 探親支出";
  } else if (aCurrencyData[0].response.CBApplyCode === "134") {
    sCBApplyCode.value = "134 - 留學支出";
  }
};
onMounted(() => {
  fnInitPage();
});

//交易認證
const sTransAuth = ref("");

//回上一頁
const fnReturnPage = () => {
  clearInterval(timer);
  router.push({ name: "fxCurrencyEnter" });
};

//確認送出
const fnGoNextPage = () => {
  clearInterval(timer);

  let LargeFlag = "";
  if (limitCount === 0) {
    LargeFlag = aCurrencyData[0].response.LargeFlag;
  } else {
    LargeFlag = sLargeFlag;
  }

  //檢核單筆不可超過台幣50萬元
  if (LargeFlag === "Y") {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertOnce");
    bDialogVisible.value = true;
  }

  fnGoResultPage();
};

//交易結果(次段發送)
const setCurrencyData = inject("setCurrencyData");
const fnGoResultPage = async () => {
  fnShowElLoading();

  const request = { Birthday: sTransAuth.value };
  (async () => {
    try {
      const response = await apiPostFxResult(qs.stringify(request));
      console.log("apiPostFxResult success");
      console.log(response);
      fnHideElLoading();
      let obj = response.data;
      //inject到爸爸
      setCurrencyData(obj);
      router.push({ name: "fxCurrencyResult" });
    } catch (error) {
      console.log("apiPostFxResult error message => " + error);
      store.dispatch("publicStore/handSetErrorMessageState", {
        zh_tw: "交易不明，若為帳務性交易，請洽服務人員，勿重複操作!",
        en: "Unidentified transaction, if the transaction is for accounting purposes, please contact our customer service and do not repeat the transaction!",
      });
      router.push({ name: "errorDefalutPage" });
    }
  })();
};

//關閉POPUP
const bDialogVisible = ref(false);
const sPopupMessage = ref("");
const fnCloseDialog = () => {
  clearInterval(timer);
  bDialogVisible.value = false;
  router.push({ name: "fxCurrencyEnter" });
};
</script>

<style lang="scss" scoped>
.tableAmountDetail {
  width: 70%;
  tr.showDetail {
    border-top: none;
  }
  tr.showDetail ~ tr.showDetail {
    border-top: 1px solid #1e8ece;
  }
  th,
  td {
    padding: 10px;
    text-align-last: center;
    &:first-child,
    &:last-child {
      width: 20%;
    }
  }
  th {
    background: transparent;
  }
  input {
    width: 50%;
    text-align-last: left;
  }
}

.apiLoading img {
  vertical-align: text-top;
}

@media screen and (max-width: 768px) {
  .tableAmountDetail {
    width: 100%;
    tr {
      display: flex;
      margin-bottom: 0;
      align-items: center;
    }
    tr.showDetail ~ tr.showDetail {
      border-top: 1px solid #aaa;
    }
    th,
    td {
      margin-top: 10px;
      margin-bottom: 10px;
      padding: 0;
      text-align: center;
      &:first-child,
      &:last-child {
        width: auto;
        flex: 0 0 25%;
      }
    }
    input {
      width: 70%;
    }
  }
  .block_span {
    display: block;
  }
}
</style>
