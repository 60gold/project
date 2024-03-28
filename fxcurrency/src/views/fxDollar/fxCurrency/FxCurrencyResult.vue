<template>
  <!--交易成功-->
  <div v-if="aCurrencyData[0].status === '200'">
    <div v-if="aCurrencyData[0].rsData.TransResult === '200'">
      <div class="resultTitle resultTitle_sucess">
        <span>{{ $t("fxDollar.fxCurrency.onSuccess") }}</span>
      </div>
      <!--表格-->
      <table class="formTable botM2" width="100%">
        <tr>
          <th width="180">
            {{ $t("fxDollar.fxCurrency.thTradeDate") }}
          </th>
          <td
            v-formatDate="{
              date: aCurrencyData[0].rsData.TransDate,
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
            {{ aCurrencyData[0].rsData.DisplayAcct }}
          </td>
        </tr>
        <tr>
          <th>
            {{ $t("fxDollar.fxCurrency.thTransAmount") }}
          </th>
          <td class="transAmount">
            <span v-formatPrice="aCurrencyData[0].rsData.TakeAmt"></span>
            {{ aCurrencyData[0].rsData.Getccy }}
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
        <tr v-if="aCurrencyData[0].rsData.Outccy === 'TWD'">
          <th>
            {{ $t("fxDollar.fxCurrency.thFixedRate") }}
          </th>
          <td v-formatRate="aCurrencyData[0].rsData.BillRate"></td>
        </tr>
        <tr v-if="aCurrencyData[0].rsData.Outccy === 'TWD'">
          <th>
            {{ $t("fxDollar.fxCurrency.thDealRate") }}
          </th>
          <td v-formatRate="aCurrencyData[0].rsData.ExchangRate"></td>
        </tr>
        <tr v-if="aCurrencyData[0].rsData.Outccy !== 'TWD'">
          <th>
            {{ $t("fxDollar.fxCurrency.thWithdrawalFee") }}
          </th>
          <td>
            <span
              class="color_red"
              v-formatPriceFx="aCurrencyData[0].rsData.TrxFee"
            ></span
            >元 {{ aCurrencyData[0].rsData.Getccy }}
          </td>
        </tr>
        <tr>
          <th>
            {{ $t("fxDollar.fxCurrency.thDebitAmount") }}
          </th>
          <td>
            <span class="color_red" v-formatPriceFx="sDebitAmount"></span>元
            {{ aCurrencyData[0].rsData.Outccy }}
          </td>
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
            {{ aCurrencyData[0].rsData.Country }}
            {{ aCurrencyData[0].rsData.CountryName }}
          </td>
        </tr>
      </table>
      <!--提領資訊-->
      <h4 class="deTitle">{{ $t("fxDollar.fxCurrency.thReserveInfo") }}</h4>
      <table class="formTable botM2" width="100%">
        <tr>
          <th width="180" class="th_button">
            {{ $t("fxDollar.fxCurrency.thBranch") }}
            <div class="btn_bluelight m_block">
              <a target="_blank" :href="aCurrencyData[0].rsData.BranchMap">{{
                $t("fxDollar.fxCurrency.btBranchLocation")
              }}</a>
            </div>
          </th>
          <td class="td_button">
            <div>
              {{ aCurrencyData[0].rsData.DisplayBranch }}<br /><span
                class="color_gray"
                >{{ aCurrencyData[0].rsData.Telno }}<br />{{
                  aCurrencyData[0].rsData.Address
                }}<br />{{ aCurrencyData[0].rsData.Opentime }}<br
              /></span>
            </div>
            <div class="btn_bluelight m_hide">
              <a target="_blank" :href="aCurrencyData[0].rsData.BranchMap">{{
                $t("fxDollar.fxCurrency.btBranchLocation")
              }}</a>
            </div>
          </td>
        </tr>
        <tr>
          <th>{{ $t("fxDollar.fxCurrency.thReserveDate") }}</th>
          <td
            v-formatDate="{
              date: aCurrencyData[0].rsData.OrderDate,
              changeFormat: 'YYYY/MM/DD',
              originalFormat: 'YYYYMMDD',
            }"
          ></td>
        </tr>
        <tr>
          <th class="th_button">
            {{ $t("fxDollar.fxCurrency.thReserveNumber") }}
            <div class="btn_bluelight m_block">
              <a href="javascript:void(0)" @click.prevent="fnBranchInfo">{{
                $t("fxDollar.fxCurrency.btBranchInfo")
              }}</a>
            </div>
          </th>
          <td class="td_button">
            <div>{{ aCurrencyData[0].rsData.CBRefNo }}</div>
            <div class="btn_bluelight m_hide">
              <a href="javascript:void(0)" @click.prevent="fnBranchInfo">{{
                $t("fxDollar.fxCurrency.btBranchInfo")
              }}</a>
            </div>
          </td>
        </tr>
      </table>
      <!--按鈕-->
      <div class="btn_check botM3">
        <a
          class="order_3 m_color_check icon_calender"
          href="javascript:void(0)"
          @click.prevent="fnAddNotice(sTitle)"
          >{{ $t("fxDollar.fxCurrency.addCalender") }}</a
        >
        <a
          class="order_2 m_color_check"
          href="javascript:void(0)"
          @click.prevent="fnGoPrintPage"
          >{{ $t("fxDollar.fxCurrency.print") }}</a
        >
        <a
          class="order_2 m_color_check"
          href="javascript:void(0)"
          @click.prevent="fnCurrencySearch"
          >{{ $t("fxDollar.fxCurrency.currencySearch") }}</a
        >
        <a
          class="order_1 color_menu"
          href="javascript:void(0)"
          @click.prevent="router.push({ name: 'fxccyApply' })"
          >{{ $t("fxDollar.fxCurrency.backToHomePage") }}
        </a>
      </div>
    </div>
    <div v-else>
      <!--交易失敗-->
      <div class="resultTitle resultTitle_fail">
        <span>{{ $t("fxDollar.fxCurrency.onFail") }}</span>
      </div>
      <!--表格-->
      <table class="formTable botM2" width="100%">
        <tr>
          <th width="180">
            {{ $t("fxDollar.fxCurrency.thFailReason") }}
          </th>
          <td class="color_orange">
            {{ aCurrencyData[0].rsData.TransMsg }}({{
              aCurrencyData[0].rsData.TransResult
            }})
          </td>
        </tr>
        <tr>
          <th>
            {{ $t("fxDollar.fxCurrency.thTradeDate") }}
          </th>
          <td
            v-formatDate="{ date: new Date(), changeFormat: 'YYYY/MM/DD' }"
          ></td>
        </tr>
      </table>
    </div>
  </div>
  <!--交易失敗-->
  <div v-else>
    <div class="resultTitle resultTitle_fail">
      <span>{{ $t("fxDollar.fxCurrency.onFail") }}</span>
    </div>
    <!--表格-->
    <table class="formTable botM2" width="100%">
      <tr>
        <th width="180">
          {{ $t("fxDollar.fxCurrency.thFailReason") }}
        </th>
        <td class="color_orange">{{ aCurrencyData[0].errMsg }}</td>
      </tr>
      <tr>
        <th>
          {{ $t("fxDollar.fxCurrency.thTradeDate") }}
        </th>
        <td
          v-formatDate="{ date: new Date(), changeFormat: 'YYYY/MM/DD' }"
        ></td>
      </tr>
    </table>
  </div>
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
        <div class="qrArea">
          <div>
            <span>{{ $t("fxDollar.fxCurrency.reserveCode") }}</span>
            <span class="color_bluelight bookNumber">{{
              aCurrencyData[0].rsData.BookNumber
            }}</span>
          </div>
          <div class="qrcode">
            <img :src="qrcodeUrl" />
          </div>
          <div>{{ $t("fxDollar.fxCurrency.tip1") }}</div>
          <div
            class="qrNotice color_red"
            v-html="$t('fxDollar.fxCurrency.tip2')"
          ></div>
          <!--注意事項-->
          <SlotNote>
            <ol>
              <li
                class="color_orange"
                v-html="$t('fxDollar.fxCurrency.note3_1')"
              ></li>
              <li
                class="color_orange"
                v-html="$t('fxDollar.fxCurrency.note3_2')"
              ></li>
            </ol>
          </SlotNote>
        </div>
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
  name: "FxCurrencyResult",
};
</script>

<script setup>
import { ref, reactive, watch, computed, inject, onMounted } from "vue";
import ElDialog from "@/components/publicComponents/diolog_popup/SlotElDialogDefault.vue";
import SlotNote from "@/components/publicComponents/other/SlotNote.vue";
import QRCode from "qrcode";
import { fnAddNotice } from "@/common/methodCommon/publicMethod/formSubmit.js";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

//步驟3
const updateNStep = inject("updateNStep");
updateNStep(3);

//取得確認頁資料
const aCurrencyData = inject("getCurrencyData");
console.log("aCurrencyData------------------------------");
console.log(aCurrencyData);

const aCurrencyDetail = reactive([]); //指定現鈔明細
const aDisplayCcy = ref(""); //轉出幣別
const sDebitAmount = ref(""); //扣款總額
const sCBApplyCode = ref(""); //交易性質
const sTitle = ref("外幣現鈔申購"); //加入行事曆
const sLanguage = computed(() => {
  return store.getters["publicStore/getLanguage"];
});
const qrcodeUrl = ref(""); //QRCODE

const fnInitPage = () => {
  if (
    aCurrencyData[0].status === "200" &&
    aCurrencyData[0].rsData.TransResult === "200"
  ) {
    //置入指定現鈔明細
    let obj = [
      {
        Denomination: aCurrencyData[0].rsData.Denomination1,
        Sheet: aCurrencyData[0].rsData.Sheet1,
        Total: (
          +aCurrencyData[0].rsData.Denomination1 *
          +aCurrencyData[0].rsData.Sheet1
        ).toString(),
      },
      {
        Denomination: aCurrencyData[0].rsData.Denomination2,
        Sheet: aCurrencyData[0].rsData.Sheet2,
        Total: (
          +aCurrencyData[0].rsData.Denomination2 *
          +aCurrencyData[0].rsData.Sheet2
        ).toString(),
      },
      {
        Denomination: aCurrencyData[0].rsData.Denomination3,
        Sheet: aCurrencyData[0].rsData.Sheet3,
        Total: (
          +aCurrencyData[0].rsData.Denomination3 *
          +aCurrencyData[0].rsData.Sheet3
        ).toString(),
      },
      {
        Denomination: aCurrencyData[0].rsData.Denomination4,
        Sheet: aCurrencyData[0].rsData.Sheet4,
        Total: (
          +aCurrencyData[0].rsData.Denomination4 *
          +aCurrencyData[0].rsData.Sheet4
        ).toString(),
      },
      {
        Denomination: aCurrencyData[0].rsData.Denomination5,
        Sheet: aCurrencyData[0].rsData.Sheet5,
        Total: (
          +aCurrencyData[0].rsData.Denomination5 *
          +aCurrencyData[0].rsData.Sheet5
        ).toString(),
      },
      {
        Denomination: aCurrencyData[0].rsData.Denomination6,
        Sheet: aCurrencyData[0].rsData.Sheet6,
        Total: (
          +aCurrencyData[0].rsData.Denomination6 *
          +aCurrencyData[0].rsData.Sheet6
        ).toString(),
      },
    ];
    Array.prototype.push.apply(aCurrencyDetail, obj);

    //置入轉出幣別
    if (aCurrencyData[0].rsData.Outccy === "TWD") {
      aDisplayCcy.value = "TWD 新臺幣";
    } else if (aCurrencyData[0].rsData.Outccy === "USD") {
      aDisplayCcy.value = "USD 美元";
    } else if (aCurrencyData[0].rsData.Outccy === "EUR") {
      aDisplayCcy.value = "EUR 歐元";
    } else if (aCurrencyData[0].rsData.Outccy === "CNY") {
      aDisplayCcy.value = "CNY 人民幣";
    } else if (aCurrencyData[0].rsData.Outccy === "HKD") {
      aDisplayCcy.value = "HKD 港幣";
    } else if (aCurrencyData[0].rsData.Outccy === "JPY") {
      aDisplayCcy.value = "JPY 日圓";
    }

    //若轉出幣別為TWD，不顯示提領手續費 / 依幣別置入扣款總額
    if (aCurrencyData[0].rsData.Outccy === "TWD") {
      sDebitAmount.value = aCurrencyData[0].rsData.WithdrawTwd;
    } else {
      sDebitAmount.value = aCurrencyData[0].rsData.WithdrawAmt;
    }

    //置入交易性質
    if (aCurrencyData[0].rsData.CBApplyCode === "131") {
      sCBApplyCode.value = "131 - 商務支出";
    } else if (aCurrencyData[0].rsData.CBApplyCode === "132") {
      sCBApplyCode.value = "132 - 觀光支出";
    } else if (aCurrencyData[0].rsData.CBApplyCode === "133") {
      sCBApplyCode.value = "133 - 探親支出";
    } else if (aCurrencyData[0].rsData.CBApplyCode === "134") {
      sCBApplyCode.value = "134 - 留學支出";
    }

    //產生QRCODE
    QRCode.toDataURL(aCurrencyData[0].rsData.QRcode)
      .then((url) => {
        console.log(url);
        qrcodeUrl.value = url;
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
onMounted(() => {
  fnInitPage();
});

//關閉POPUP
const bDialogVisible = ref(false);
const fnCloseDialog = () => {
  bDialogVisible.value = false;
};

//分行取號資訊
const fnBranchInfo = () => {
  bDialogVisible.value = true;
};

//加入行事曆
watch(sLanguage, (val) => {
  if (val === "zh_tw") {
    sTitle.value = "外幣現鈔申購";
  } else if (val === "en") {
    sTitle.value = "外幣現鈔申購";
  }
});

//列印水單
const fnGoPrintPage = () => {
  const sNibUrl = computed(() => {
    return store.getters["publicStore/getNibUrl"];
  });
  const url = sNibUrl.value + "/pages/vnib/index.html";

  let createWindow = window.open(url);
  createWindow.addEventListener("load", () => {
    createWindow.postMessage(
      {
        acrossPages: true,
        routerName: "fxCurrencyPrint",
        showHeaderFooter: false,
      },
      window.location.origin
    );
  });
};

//前往外幣現鈔申購查詢/變更頁面
const fnCurrencySearch = () => {
  router.push({ name: "fxccyQuery" });
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

h4.deTitle {
  display: block;
  width: 100%;
  max-width: 940px;
  margin: 0 auto 20px;
}

.td_button {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn_bluelight a {
  display: inline-block;
  padding: 0 10px;
  line-height: 30px;
  font-size: 0.89em;
  font-weight: 400;
  color: #fff;
  background-color: #1bc1d5;
  border-radius: 14px;
}

.btn_check a.icon_calender {
  padding: 0 20px 0 40px;
  background-image: url("~@/assets/images/commonIcon/icon_btn_icon_08.png");
  background-size: auto 23px;
  background-position: 12px center;
  background-repeat: no-repeat;
}

.qrArea {
  font-size: 16px;
  .bookNumber {
    margin-left: 15px;
    font-size: 1.4em;
  }
  .qrNotice {
    margin-bottom: 45px;
  }
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
  .td_button {
    display: block;
  }
  .th_button {
    display: flex;
  }
  .btn_bluelight a {
    margin-left: 25px;
  }
  .block_span {
    display: block;
  }
}
</style>
