<template>
  <div
    id="tableArea"
    class="tableArea"
    :class="{
      isEdge: isEdge,
      isChrome: isChrome,
      isFirefox: isFirefox,
      isSafari: isSafari,
    }"
    v-if="bLoading"
  >
    <table class="titleTable">
      <tr>
        <td colspan="18">
          <div class="tC" v-html="$t('fxDollar.fxCurrency.thTitle')"></div>
          <div class="spaceBetween">
            <span>{{ $t("fxDollar.fxCurrency.thDepartment") }}</span>
            <span
              >{{ $t("fxDollar.fxCurrency.thDate")
              }}<span
                v-formatDate="{
                  date: aPrintData[0].TransDate,
                  changeFormat: 'YYYY/MM/DD',
                  originalFormat: 'YYYYMMDD',
                }"
              ></span
            ></span>
          </div>
        </td>
      </tr>
    </table>
    <table class="fxTable">
      <tr>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr1_1") }}</td>
        <td colspan="6">{{ aPrintData[0].CBRefNo }}</td>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr1_2") }}</td>
        <td colspan="6">{{ sDebitAmount }}</td>
      </tr>
      <tr>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr2_1") }}</td>
        <td colspan="6">
          {{ aPrintData[0].Country }}-{{ aPrintData[0].CountryName }}
        </td>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr2_2") }}</td>
        <td colspan="6"></td>
      </tr>
      <tr>
        <td colspan="3" class="lowspace">
          {{ $t("fxDollar.fxCurrency.tr3_1") }}
        </td>
        <td colspan="6">{{ sCustName }}</td>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr3_2") }}</td>
        <td colspan="1">{{ $t("fxDollar.fxCurrency.tr23_2") }}</td>
        <td colspan="5"></td>
      </tr>
      <tr>
        <td colspan="3" class="lowspace">
          {{ $t("fxDollar.fxCurrency.tr4_1") }}
        </td>
        <td colspan="6">{{ sRomaName }}</td>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr4_2") }}</td>
        <td colspan="1">{{ $t("fxDollar.fxCurrency.tr23_2") }}</td>
        <td colspan="5"></td>
      </tr>
      <tr>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr5_1") }}</td>
        <td colspan="6">{{ aPrintData[0].CustId }}</td>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr5_2") }}</td>
        <td colspan="1">{{ $t("fxDollar.fxCurrency.tr23_2") }}</td>
        <td colspan="5"></td>
      </tr>
      <tr>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr6_1") }}</td>
        <td colspan="6">{{ sCBApplyCode }}</td>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr6_2") }}</td>
        <td colspan="1">{{ $t("fxDollar.fxCurrency.tr23_2") }}</td>
        <td colspan="5">
          {{ aPrintData[0].Getccy
          }}{{ fnAdd00(fnFormatPrice(aPrintData[0].TakeAmt)) }}
        </td>
      </tr>
      <tr>
        <td colspan="9" v-html="$t('fxDollar.fxCurrency.tr7_1')"></td>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr7_2") }}</td>
        <td colspan="1">{{ $t("fxDollar.fxCurrency.tr23_2") }}</td>
        <td colspan="5"></td>
      </tr>
      <tr>
        <td
          colspan="3"
          class="lowspace"
          v-html="$t('fxDollar.fxCurrency.tr8_1')"
        ></td>
        <td colspan="6" v-html="$t('fxDollar.fxCurrency.tr8_2')"></td>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr8_3") }}</td>
        <td colspan="1">{{ $t("fxDollar.fxCurrency.tr23_2") }}</td>
        <td colspan="5"></td>
      </tr>
      <tr>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr9_1") }}</td>
        <td colspan="6"></td>
        <td colspan="3"></td>
        <td colspan="1"></td>
        <td colspan="5"></td>
      </tr>
      <tr>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr10_1") }}</td>
        <td colspan="6"></td>
        <td colspan="3"></td>
        <td colspan="1"></td>
        <td colspan="5"></td>
      </tr>
      <tr>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr11_1") }}</td>
        <td colspan="6"></td>
        <td colspan="3"></td>
        <td colspan="1"></td>
        <td colspan="5"></td>
      </tr>
      <tr>
        <td colspan="3" rowspan="2">{{ $t("fxDollar.fxCurrency.tr12_1") }}</td>
        <td colspan="2" rowspan="2">{{ sExchangRate }}</td>
        <td colspan="4">{{ $t("fxDollar.fxCurrency.tr12_2") }}</td>
        <td colspan="3"></td>
        <td colspan="1"></td>
        <td colspan="5"></td>
      </tr>
      <tr>
        <td colspan="4">{{ sWithdrawTwd }}</td>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr13_1") }}</td>
        <td colspan="6"></td>
      </tr>
      <tr>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr14_1") }}</td>
        <td colspan="6"></td>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr14_2") }}</td>
        <td colspan="1">{{ $t("fxDollar.fxCurrency.tr23_2") }}</td>
        <td colspan="5">{{ sTwdAmt }}</td>
      </tr>
      <tr>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr15_1") }}</td>
        <td colspan="6">{{ sTrxFee }}</td>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr16_1") }}</td>
        <td colspan="1"></td>
        <td colspan="5">{{ sTwdAcc }}</td>
      </tr>
      <tr>
        <td colspan="3"></td>
        <td colspan="6"></td>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr17_1") }}</td>
        <td colspan="1">{{ $t("fxDollar.fxCurrency.tr23_2") }}</td>
        <td colspan="5">{{ sFxAmt }}</td>
      </tr>
      <tr>
        <td colspan="3"></td>
        <td colspan="6"></td>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr18_1") }}</td>
        <td colspan="1"></td>
        <td colspan="5">{{ sFxAcc }}</td>
      </tr>
      <tr>
        <td colspan="3"></td>
        <td colspan="6"></td>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr19_1") }}</td>
        <td colspan="1">{{ $t("fxDollar.fxCurrency.tr23_2") }}</td>
        <td colspan="5"></td>
      </tr>
      <tr>
        <td colspan="3"></td>
        <td colspan="6"></td>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr20_1") }}</td>
        <td colspan="1">{{ $t("fxDollar.fxCurrency.tr23_2") }}</td>
        <td colspan="5"></td>
      </tr>
      <tr>
        <td colspan="3"></td>
        <td colspan="6"></td>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr21_1") }}</td>
        <td colspan="1">{{ $t("fxDollar.fxCurrency.tr23_2") }}</td>
        <td colspan="5"></td>
      </tr>
      <tr>
        <td colspan="3"></td>
        <td colspan="6"></td>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr12_1") }}</td>
        <td colspan="1"></td>
        <td colspan="5"></td>
      </tr>
      <tr>
        <td colspan="3"></td>
        <td colspan="6"></td>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr22_1") }}</td>
        <td colspan="1">{{ $t("fxDollar.fxCurrency.tr23_2") }}</td>
        <td colspan="5"></td>
      </tr>
      <tr>
        <td colspan="3"></td>
        <td colspan="6"></td>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr8_3") }}</td>
        <td colspan="1">{{ $t("fxDollar.fxCurrency.tr23_2") }}</td>
        <td colspan="5"></td>
      </tr>
      <tr>
        <td colspan="3"></td>
        <td colspan="6"></td>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr23_1") }}</td>
        <td colspan="1"></td>
        <td colspan="5"></td>
      </tr>
      <tr>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr24_1") }}</td>
        <td colspan="6">{{ sTotal }}</td>
        <td colspan="3"></td>
        <td colspan="1"></td>
        <td colspan="5"></td>
      </tr>
      <tr>
        <td colspan="3">{{ $t("fxDollar.fxCurrency.tr25_1") }}</td>
        <td colspan="6">{{ sAllTotal }}</td>
        <td colspan="3"></td>
        <td colspan="1"></td>
        <td colspan="5"></td>
      </tr>
    </table>
    <table class="titleTable mtop10">
      <tr>
        <td class="verTop" width="25%">
          <table class="footerTable lowspace">
            <tr>
              <td colspan="3">{{ $t("fxDollar.fxCurrency.txTax1") }}</td>
            </tr>
            <tr>
              <td colspan="3">{{ $t("fxDollar.fxCurrency.txTax2") }}</td>
            </tr>
            <tr>
              <td colspan="1">{{ $t("fxDollar.fxCurrency.txTax3") }}</td>
              <td colspan="2">
                {{ $t("fxDollar.fxCurrency.txTax4")
                }}<span v-html="sBoss"></span>
              </td>
            </tr>
          </table>
        </td>
        <td class="verTop" width="40%" align="left">
          <div v-if="aPrintData[0].CBLargeNo !== ''">
            {{ $t("fxDollar.fxCurrency.txNote1") }}{{ aPrintData[0].CBLargeNo }}
          </div>
          <div v-html="$t('fxDollar.fxCurrency.txNote2')"></div>
        </td>
        <td class="verTop" width="25%" align="left">
          <table class="detailTable lowspace">
            <tr>
              <td class="tC">{{ $t("fxDollar.fxCurrency.txtAmount") }}</td>
              <td class="tC">{{ $t("fxDollar.fxCurrency.trNum") }}</td>
              <td class="tC">{{ $t("fxDollar.fxCurrency.trTotal") }}</td>
            </tr>
            <tr
              v-for="(list, index) in aCurrencyDetail"
              :key="list.Denomination"
              :id="index"
              v-show="list.Denomination !== '0'"
            >
              <td>{{ list.Denomination }}</td>
              <td>{{ list.Sheet }}</td>
              <td v-formatPrice="list.Total"></td>
            </tr>
            <tr>
              <td class="tC" colspan="2">
                {{ $t("fxDollar.fxCurrency.tr24_1") }}
              </td>
              <td v-formatPrice="aPrintData[0].TakeAmt"></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <div class="buttonArea">
      <a class="simple_btn" href="javascript:void(0)" @click="fnPrint">{{
        $t("fxDollar.fxCurrency.txPrint")
      }}</a>
      <a class="simple_btn" href="javascript:void(0)" @click="fnClose">{{
        $t("fxDollar.fxCurrency.txClose")
      }}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "FxCurrencyPrint",
};
</script>

<script setup>
import { ref, reactive, computed, inject, onMounted } from "vue";
import {
  fnFormatPrice,
  fnFormatPriceSub00,
  fnFormatPriceFx,
  fnFormatRate,
} from "@/common/methodCommon/publicMethod";
import { apiPostFxPrint } from "@/api/axios/fxDollar/fxCurrency.js"; //水單列印
import {
  fnShowElLoading,
  fnHideElLoading,
} from "@/common/methodCommon/publicMethod";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

//不顯示步驟
const updateNStep = inject("updateNStep");
updateNStep(0);

//取得水單資訊
const fnGetPrint = async () => {
  fnShowElLoading();

  (async () => {
    try {
      const response = await apiPostFxPrint();
      console.log("apiPostFxPrint success");
      console.log(response);
      fnHideElLoading();
      if (response.data.status === "200") {
        const data = response.data.rsData;
        if (data) {
          fnInitPage(data);
        } else {
          store.dispatch("publicStore/handSetErrorMessageState", {
            zh_tw: "交易不明，若為帳務性交易，請洽服務人員，勿重複操作!",
            en: "Unidentified transaction, if the transaction is for accounting purposes, please contact our customer service and do not repeat the transaction!",
          });
          router.push({ name: "errorDefalutPage" });
        }
      } else if (response.data.status === "500") {
        console.log("apiPostFxPrint error message => " + response.data.errMsg);
        store.dispatch("publicStore/handSetErrorMessageState", {
          zh_tw: response.data.errMsg,
          en: response.data.errMsg,
        });
        router.push({ name: "errorDefalutPage" });
      }
    } catch (error) {
      console.log("apiPostFxPrint error message => " + error);
      store.dispatch("publicStore/handSetErrorMessageState", {
        zh_tw: "交易不明，若為帳務性交易，請洽服務人員，勿重複操作!",
        en: "Unidentified transaction, if the transaction is for accounting purposes, please contact our customer service and do not repeat the transaction!",
      });
      router.push({ name: "errorDefalutPage" });
    }
  })();
};
onMounted(() => {
  fnGetPrint();
});

const bLoading = ref(false);
const aPrintData = reactive([]); //水單資訊
const aCurrencyDetail = reactive([]); //指定現鈔明細
const sDebitAmount = ref(""); //扣款總額
const sCustName = ref(""); //姓名(中文)
const sRomaName = ref(""); //姓名(英文)
const sCBApplyCode = ref(""); //交易性質
const sExchangRate = ref(""); //匯率
const sWithdrawTwd = ref(""); //折合台幣
const sTwdAmt = ref(""); //以新台幣結構
const sTwdAcc = ref(""); //新台幣帳號
const sFxAmt = ref(""); //外匯存款提出
const sFxAcc = ref(""); //原幣帳號
const sTrxFee = ref(""); //手續費(外幣)
const sTotal = ref(""); //總計
const sAllTotal = ref(""); //合計
const sBoss = computed(() => {
  return store.getters["publicStore/getBoss"];
}); //負責總繳人
const isEdge = ref(false);
const isChrome = ref(false);
const isFirefox = ref(false);
const isSafari = ref(false);

//處理水單資訊
const fnInitPage = (data) => {
  aPrintData.push(data);

  //置入指定現鈔明細
  let obj = [
    {
      Denomination: data.Denomination1,
      Sheet: data.Sheet1,
      Total: (+data.Denomination1 * +data.Sheet1).toString(),
    },
    {
      Denomination: data.Denomination2,
      Sheet: data.Sheet2,
      Total: (+data.Denomination2 * +data.Sheet2).toString(),
    },
    {
      Denomination: data.Denomination3,
      Sheet: data.Sheet3,
      Total: (+data.Denomination3 * +data.Sheet3).toString(),
    },
    {
      Denomination: data.Denomination4,
      Sheet: data.Sheet4,
      Total: (+data.Denomination4 * +data.Sheet4).toString(),
    },
    {
      Denomination: data.Denomination5,
      Sheet: data.Sheet5,
      Total: (+data.Denomination5 * +data.Sheet5).toString(),
    },
    {
      Denomination: data.Denomination6,
      Sheet: data.Sheet6,
      Total: (+data.Denomination6 * +data.Sheet6).toString(),
    },
  ];
  Array.prototype.push.apply(aCurrencyDetail, obj);

  //依幣別置入扣款總額/匯率/折合台幣
  if (data.Outccy === "TWD") {
    sDebitAmount.value = data.Getccy + fnFormatPrice(data.TakeAmt);
    sExchangRate.value = fnFormatRate(data.ExchangRate);
    sWithdrawTwd.value = fnFormatPriceSub00(data.WithdrawTwd);
    sTwdAmt.value = data.Getccy + fnFormatPrice(data.TakeAmt);
    sTwdAcc.value = data.AcctNo;
    sFxAmt.value = "";
    sFxAcc.value = "";
    sTrxFee.value = "";
    sTotal.value = "";
    sAllTotal.value = data.Outccy + fnFormatPriceSub00(data.WithdrawTwd);
  } else {
    sDebitAmount.value = data.Getccy + fnFormatPrice(data.TakeAmt);
    sExchangRate.value = "";
    sWithdrawTwd.value = "";
    sTwdAmt.value = "";
    sTwdAcc.value = "";
    sFxAmt.value = data.Getccy + fnFormatPriceFx(data.WithdrawAmt);
    sFxAcc.value = data.AcctNo;
    sTrxFee.value = data.Getccy + fnFormatPriceFx(data.TrxFee);
    sTotal.value = data.Getccy + fnFormatPriceFx(data.TrxFee);
    sAllTotal.value = data.Getccy + fnFormatPriceFx(data.WithdrawAmt);
  }

  //置入姓名隱碼
  if (data.CustName.length > 2) {
    let utilCustName = data.CustName;
    for (let i = 0; i < data.CustName.length - 2; i++) {
      utilCustName = utilCustName.replace(utilCustName.charAt(i + 1), "○");
    }
    sCustName.value = utilCustName;
  } else if (data.CustName.length === 2) {
    sCustName.value = data.CustName.replace(data.CustName.charAt(1), "○");
  } else if (data.CustName.length === 1) {
    sCustName.value = data.CustName;
  } else {
    sCustName.value = "";
  }
  if (data.RomaName.length > 2) {
    let utilRomaName = data.RomaName;
    for (let i = 0; i < data.RomaName.length - 2; i++) {
      utilRomaName = utilRomaName.replace(utilRomaName.charAt(i + 1), "○");
    }
    sRomaName.value = utilRomaName;
  } else if (data.RomaName.length === 2) {
    sRomaName.value = data.RomaName.replace(data.RomaName.charAt(1), "○");
  } else if (data.RomaName.length === 1) {
    sRomaName.value = data.RomaName;
  } else {
    sRomaName.value = "";
  }

  //置入交易性質
  if (data.CBApplyCode === "131") {
    sCBApplyCode.value = "131 - 商務支出";
  } else if (data.CBApplyCode === "132") {
    sCBApplyCode.value = "132 - 觀光支出";
  } else if (data.CBApplyCode === "133") {
    sCBApplyCode.value = "133 - 探親支出";
  } else if (data.CBApplyCode === "134") {
    sCBApplyCode.value = "134 - 留學支出";
  }

  //完成資料處理
  bLoading.value = true;

  //瀏覽器支援
  const isEdgeBrowser = navigator.userAgent.match("Edg");
  const isChromeBrowser = navigator.userAgent.match("Chrome");
  const isFirefoxBrowser = navigator.userAgent.match("Firefox");
  const isSafariBrowser = navigator.userAgent.match("Safari");
  if (isEdgeBrowser) {
    isEdge.value = true;
  } else if (isChromeBrowser) {
    isChrome.value = true;
  } else if (isFirefoxBrowser) {
    isFirefox.value = true;
  } else if (isSafariBrowser) {
    isSafari.value = true;
  }
};

//數字加上.00
const fnAdd00 = (val) => {
  return val + ".00";
};

const fnPrint = () => {
  window.print();
};

const fnClose = () => {
  window.close();
};
</script>

<style lang="scss" scoped>
.tableArea {
  font-family: "標楷體", "細明體", "Arial", "Times New Roman";
}

.titleTable {
  display: table;
  width: 98%;
  margin: 0 auto;
  table-layout: fixed;
  font-size: 0.88em;
  border-collapse: collapse;
  tr {
    display: table-row;
  }
  td {
    display: table-cell;
    padding: 2px 5px;
    &.verTop {
      vertical-align: top;
    }
  }
  .spaceBetween {
    display: flex;
    justify-content: space-between;
  }
  &.mtop10 {
    margin-top: 10px;
  }
}

.fxTable {
  display: table;
  width: 98%;
  margin: 0 auto;
  table-layout: fixed;
  font-size: 0.88em;
  word-break: break-all;
  border-collapse: collapse;
  border: 1px solid #000;
  tr {
    display: table-row;
  }
  td {
    display: table-cell;
    padding: 2px 5px;
    border: 1px solid #000;
  }
}

.footerTable {
  display: table;
  table-layout: fixed;
  width: 4cm;
  height: 3cm;
  font-size: 0.8em;
  text-align: center;
  word-break: break-all;
  border-collapse: collapse;
  border: 1px solid #000;
  tr {
    display: table-row;
  }
  td {
    display: table-cell;
    padding: 2px 5px;
    border: 1px solid #000;
  }
}

.detailTable {
  display: table;
  width: 100%;
  table-layout: fixed;
  text-align: right;
  font-size: 0.8em;
  word-break: break-all;
  border-collapse: collapse;
  border: 1px solid #000;
  tr {
    line-height: 1.8;
  }
  td {
    padding: 0 5px;
    border: 1px solid #000;
  }
}

.lowspace {
  letter-spacing: -1px;
}

.buttonArea {
  text-align: center;
  .simple_btn {
    margin: 0px 15px;
    padding: 4px 9px;
    font-family: "Noto Sans TC", Helvetica, "微軟正黑體";
    background: #e5e5e5;
    color: #000;
    border: 1px solid #000;
    border-radius: 4px;
  }
}

@media screen and (max-width: 768px) {
  .tableArea {
    margin-top: -85px;
    zoom: 40%;
  }
}

@media print {
  .tableArea {
    font-size: 10px;
    line-height: 1;
    .footerTable {
      font-size: 11px;
    }
    .buttonArea {
      display: none;
    }
    .detailTable tr {
      line-height: 1.2;
    }
  }
  .tableArea.isEdge {
    font-size: 8px;
    line-height: 1;
    .footerTable {
      font-size: 8px;
    }
    .detailTable tr {
      line-height: 1.2;
    }
  }
  .tableArea.isChrome {
    font-weight: 700;
  }
  .tableArea.isFirefox {
    .fxTable,
    .footerTable,
    .detailTable {
      border-collapse: separate;
    }
  }
}
</style>

<style lang="scss">
@page {
  margin: 1cm;
}
</style>
