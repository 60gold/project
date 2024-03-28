<template>
  <!--表格-->
  <table class="formTable botM2" width="100%">
    <tr>
      <th width="180">
        <span class="mustfill">*</span
        >{{ $t("fxDollar.fxCurrency.thCurrencyAccountOut") }}
      </th>
      <td class="tdCurrencyAccountOut">
        <div class="two_col">
          <ElSelect
            propsId="selCurrencyOut"
            :propsSelectData="aCurrencyOut"
            :propsValue="sSelCurrencyOutDefault"
            :propsPlaceholder="$t('fxDollar.fxCurrency.txtPickCcy')"
            @emitChangeSelectFn="fnSelCurrencyOutChange"
          ></ElSelect>
          <ElSelect
            propsId="selAccountOut"
            :propsSelectData="aAccountOut"
            :propsValue="sSelAccountOutDefault"
            :propsPlaceholder="$t('fxDollar.fxCurrency.txtPickAcc')"
            :propsNoDataText="$t('fxDollar.fxCurrency.txtPickAcc')"
            @emitChangeSelectFn="fnSelAccountOutChange"
          ></ElSelect>
        </div>
        <div v-if="bBalanceIsShow">
          <p class="color_orange p_top_10" v-if="bLoadingBalanceOK">
            {{ $t("fxDollar.fxCurrency.txtBalance") }}{{ sBalanceShow }}
          </p>
          <p class="color_orange p_top_10 apiLoading" v-if="!bLoadingBalanceOK">
            {{ $t("fxDollar.fxCurrency.txtBalance")
            }}<img src="@/assets/images/gif/progress.gif" />
            {{ $t("fxDollar.fxCurrency.loading") }}
          </p>
        </div>
      </td>
    </tr>
    <tr>
      <th>
        <span class="mustfill">*</span
        >{{ $t("fxDollar.fxCurrency.thCurrencyIn") }}
      </th>
      <td class="tdCurrencyIn">
        <ElSelect
          propsId="selCurrencyIn"
          propsClass="fullwidthSelect selCurrencyIn"
          :propsSelectData="aSelCurrencyIn"
          :propsValue="sSelCurrencyInDefault"
          :propsPlaceholder="$t('fxDollar.fxCurrency.txtPickCcy')"
          @emitChangeSelectFn="fnSelCurrencyInChange"
        ></ElSelect>
      </td>
    </tr>
    <tr>
      <th>
        <span class="mustfill">*</span
        >{{ $t("fxDollar.fxCurrency.thTransAmount") }}
      </th>
      <td class="tdTransAmount">
        <div class="inputOption botM">
          <div class="inputOption_input">
            <input
              v-model="sTxtTransAmount"
              type="text"
              autocomplete="off"
              @change="fnTxtTransAmountChange"
              @focus="fnTxtTransAmountFocus"
              @blur="fnTxtTransAmountBlur"
            />
          </div>
          <div class="inputOption_info"></div>
        </div>
        <div class="rateArea tSmall" v-if="bCurrencyOutIsTWD">
          <div v-if="bLoadingRateOK">
            {{ $t("fxDollar.fxCurrency.txtRate", 1)
            }}<span class="color_red">{{ sTxtRate }}</span
            >{{ $t("fxDollar.fxCurrency.txtRate", 2) }}
          </div>
          <div class="apiLoading" v-if="!bLoadingRateOK">
            <img src="@/assets/images/gif/progress.gif" />
            {{ $t("fxDollar.fxCurrency.loading") }}
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <th class="th_button">
        <span class="mustfill">*</span>{{ $t("fxDollar.fxCurrency.thBranch") }}
        <div class="btn_bluelight m_block">
          <a target="_blank" :href="aBranchUrl">{{
            $t("fxDollar.fxCurrency.btBranchLocation")
          }}</a>
        </div>
      </th>
      <td class="tdBranch">
        <div class="td_button">
          <div class="branchNotice color_red tB">
            {{ $t("fxDollar.fxCurrency.txtCheckBranch") }}
          </div>
          <div class="btn_bluelight m_hide">
            <a target="_blank" :href="aBranchUrl">{{
              $t("fxDollar.fxCurrency.btBranchLocation")
            }}</a>
          </div>
        </div>
        <div class="two_col">
          <ElSelect
            propsId="selArea"
            :propsSelectData="aSelArea"
            :propsValue="aSelAreaDefault"
            :propsPlaceholder="$t('fxDollar.fxCurrency.txtPickArea')"
            :propsNoDataText="$t('fxDollar.fxCurrency.txtPickArea')"
            @emitChangeSelectFn="fnSelAreaChange"
          ></ElSelect>
          <ElSelect
            propsId="selBranch"
            :propsSelectData="aSelBranch"
            :propsValue="aSelBranchDefault"
            :propsPlaceholder="$t('fxDollar.fxCurrency.txtPickBranch')"
            :propsNoDataText="$t('fxDollar.fxCurrency.txtPickBranch')"
            @emitChangeSelectFn="fnSelBranchChange"
          ></ElSelect>
        </div>
      </td>
    </tr>
    <tr v-if="bShowAmountDetail">
      <th>
        <span class="mustfill">*</span
        >{{ $t("fxDollar.fxCurrency.thAmountDetail") }}
      </th>
      <td class="thAmountDetail">
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
            v-for="(list, index) in aAmountDetail"
            :key="list.Denomination"
            :id="index"
            :class="list.Sheet > 9 ? 'showDetail' : ''"
            v-show="list.Sheet > 9"
          >
            <td class="amountDetail_amount">{{ list.Denomination }}</td>
            <td>
              <input
                type="text"
                autocomplete="off"
                value="0"
                class="amountDetail_input"
                :data-index="index"
                :data-amount="list.Denomination"
                @change="fnTxtAmountDetailChange"
                @focus="fnTxtAmountDetailFocus"
                @blur="fnTxtAmountDetailBlur"
              />
            </td>
            <td class="amountDetail_total color_orange">{{ list.Total }}</td>
          </tr>
        </table>
        <p class="color_orange p_top_10">
          {{ $t("fxDollar.fxCurrency.txtAmountTotal") }}{{ sTotalAmount }}
        </p>
      </td>
    </tr>
    <tr>
      <th>
        <span class="mustfill">*</span
        >{{ $t("fxDollar.fxCurrency.thReserveDate") }}
      </th>
      <td>
        <div class="multiInput_item normalDate">
          <div class="dateInputBox">
            <el-date-picker
              v-model="sReserveDate"
              type="date"
              :placeholder="$t('fxDollar.fxCurrency.txtPickDate')"
              format="YYYY/MM/DD"
              value-format="YYYY/MM/DD"
              :disabled-date="disabledDate"
              :clearable="false"
            >
            </el-date-picker>
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <th>
        <span class="mustfill">*</span
        >{{ $t("fxDollar.fxCurrency.thTradeType") }}
      </th>
      <td class="tdTradeType">
        <ElSelect
          propsId="selTradeType"
          propsClass="fullwidthSelect"
          :propsSelectData="aSelTradeType"
          :propsValue="sSelTradeTypeDefault"
          :propsPlaceholder="$t('fxDollar.fxCurrency.txtPickTradeType')"
          @emitChangeSelectFn="fnSelTradeTypeChange"
        ></ElSelect>
      </td>
    </tr>
    <tr>
      <th>
        <span class="mustfill">*</span
        >{{ $t("fxDollar.fxCurrency.thTargetCountry") }}
      </th>
      <td class="tdTargetCountry">
        <ElSelect
          propsId="selTargetCountry"
          propsClass="fullwidthSelect"
          :propsSelectData="aTargetCountry"
          :propsValue="sSelTargetCountryDefault"
          :propsPlaceholder="$t('fxDollar.fxCurrency.txtPickTargetCountry')"
          @emitChangeSelectFn="fnSelTargetCountryChange"
        ></ElSelect>
      </td>
    </tr>
    <tr>
      <th>
        <span class="mustfill">*</span>{{ $t("fxDollar.fxCurrency.thConsent") }}
      </th>
      <td class="tdConsent">
        <div class="consentArea">
          <div class="input_bx">
            <input type="checkbox" name="consent1" id="consent1" />
            <label for="consent1"><span class="icon"></span></label>
          </div>
          <div class="color_red tB">
            {{ $t("fxDollar.fxCurrency.txtConsentContent1") }}
          </div>
        </div>
        <div class="consentArea">
          <div class="input_bx">
            <input type="checkbox" name="consent2" id="consent2" />
            <label for="consent2"><span class="icon"></span></label>
          </div>
          <div class="color_red tB">
            {{ $t("fxDollar.fxCurrency.txtConsentContent2") }}
          </div>
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

  <!-- 重複交易POPUP -->
  <ElDialog
    :propsDialogVisible="bTransDialogVisible"
    propsCustomClass="popup_showMessage"
    :propsShowClose="true"
    @emitCloseDialogFn="fnCloseTransDialog"
  >
    <template #body>
      <!-- 文字 -->
      <div class="popup_text">
        <p>{{ sTransPopupMessage }}</p>
      </div>
    </template>
    <template #footer>
      <!-- 按鈕 -->
      <div class="btn_check">
        <a
          class="m_color_back"
          href="javascript:void(0)"
          @click.prevent="fnGoConfirmPage"
          >{{ $t("fxDollar.fxCurrency.enter") }}</a
        >
        <a
          class="m_color_back"
          href="javascript:void(0)"
          @click.prevent="bTransDialogVisible = false"
          >{{ $t("fxDollar.fxCurrency.cancel") }}</a
        >
      </div>
    </template>
  </ElDialog>
</template>

<script>
export default {
  name: "FxCurrencyEnter",
};
</script>

<script setup>
import { ref, reactive, inject, onMounted } from "vue";
import ElSelect from "@/components/publicComponents/forms/ElSelectComponent.vue";
import SlotNote from "@/components/publicComponents/other/SlotNote.vue";
import ElDialog from "@/components/publicComponents/diolog_popup/SlotElDialogDefault.vue";
import {
  fnFormatDate,
  fnFormatPrice,
} from "@/common/methodCommon/publicMethod";
import {
  apiPostFxInit,
  apiPostFxGetExchangeBranch,
  apiPostFxGetTrans,
  apiPostFxConfirm,
  apiPostEquivFxTrans,
  apiPostAcctNoBalancsEx,
  apiPostAcctNoBalancsFmFxEx,
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

//步驟1
const updateNStep = inject("updateNStep");
updateNStep(1);

//查詢 轉出帳號,預約領取日,目的地國別
const fnGetApiInitData = async () => {
  fnShowElLoading();

  const request = { NoticeAgree: "Y", ApplyAgree: "Y" };
  (async () => {
    try {
      const response = await apiPostFxInit(qs.stringify(request));
      console.log("apiPostFxInit success");
      console.log(response);
      fnHideElLoading();
      fnApiPostFxInitOnSuccess(response);
    } catch (error) {
      console.log("apiPostFxInit error message => " + error);
      store.dispatch("publicStore/handSetErrorMessageState", {
        zh_tw: "交易不明，若為帳務性交易，請洽服務人員，勿重複操作!",
        en: "Unidentified transaction, if the transaction is for accounting purposes, please contact our customer service and do not repeat the transaction!",
      });
      router.push({ name: "errorDefalutPage" });
    }
  })();
};
onMounted(() => {
  fnGetApiInitData();
});

const aCurrencyOutTWD = reactive([]); //轉出幣別-台幣
const aCurrencyOutFD = reactive([]); //轉出幣別-外幣
const aOrderDates = reactive([]); //預約領取日
let aStartDate = ""; //預約領取日-起日
let aEndDate = ""; //預約領取日-迄日
const aTargetCountry = reactive([]); //目的地國別
const aBranchUrl = ref(""); //分行位置

const fnApiPostFxInitOnSuccess = (response) => {
  if (response.data.status === "200") {
    const data = response.data.rsData;
    if (data && data.Accts.length !== 0) {
      //存入-轉出幣別
      const AcctsData = data.Accts;
      AcctsData.forEach((item, i) => {
        if (item.Type === "TW") {
          aCurrencyOutTWD.push(item);
        } else if (item.Type === "FX") {
          aCurrencyOutFD.push(item);
        }
      });

      //存入-預約領取日
      Array.prototype.push.apply(aOrderDates, data.OrderDates);
      aStartDate = fnFormatDate(aOrderDates[0], "YYYY-MM-DD", "YYYYMMDD");
      aEndDate = fnFormatDate(
        aOrderDates[aOrderDates.length - 1],
        "YYYY-MM-DD",
        "YYYYMMDD"
      );
      sReserveDate.value = fnFormatDate(
        aOrderDates[0],
        "YYYY/MM/DD",
        "YYYYMMDD"
      );

      //存入-目的地國別
      const CountrysData = data.Countrys;
      CountrysData.forEach((item, i) => {
        let obj = {
          value: item.CountryID,
          label: item.CountryID + " " + item.CountryName,
        };
        if (item.CountryID !== "TW") {
          aTargetCountry.push(obj);
        }
      });

      //存入-分行位置
      aBranchUrl.value = data.BranchUrl;

      //置入-轉出幣別
      fnSetCurrencyOut();

      //清除checkbox狀態
      document.getElementById("consent1").checked = false;
      document.getElementById("consent2").checked = false;
    } else {
      store.dispatch("publicStore/handSetErrorMessageState", {
        zh_tw: "您無可轉出帳號，無法進行此交易！",
        en: "您無可轉出帳號，無法進行此交易！",
      });
      router.push({ name: "errorDefalutPage" });
    }
  } else if (response.data.status === "500") {
    console.log("apiPostFxInit error message => " + response.data.errMsg);
    store.dispatch("publicStore/handSetErrorMessageState", {
      zh_tw: response.data.errMsg,
      en: response.data.errMsg,
    });
    router.push({ name: "errorDefalutPage" });
  }
};

//轉出幣別
const aCurrencyOut = reactive([]); //轉出幣別
const sSelCurrencyOut = ref(""); //v-model
const sSelCurrencyOutDefault = ref(null);
let sNextSelCurrencyOut = ""; //存上一個轉出幣別
const bCurrencyOutIsTWD = ref(null);
const bBalanceIsShow = ref(false);
const bLoadingBalanceOK = ref(true);

//置入-轉出幣別
const fnSetCurrencyOut = () => {
  if (aCurrencyOutTWD.length > 0) {
    let obj = {
      value: "TWD",
      label: "TWD 新台幣",
    };
    aCurrencyOut.push(obj);
  }

  //暫存電文外幣幣別
  const aTempCcyFD = reactive([]);
  aCurrencyOutFD.forEach((item, i) => {
    let obj = {
      value: item.CCY,
      label: item.DispCCY,
    };
    let bool = true;
    for (var j = 0; j < aTempCcyFD.length; j++) {
      if (item.CCY === aTempCcyFD[j].value) {
        bool = false;
        break;
      }
    }
    //避免幣別重複
    if (bool) {
      aTempCcyFD.push(obj);
    }
  });
  aTempCcyFD.sort();
  Array.prototype.push.apply(aCurrencyOut, aTempCcyFD);
};

//變更-轉出幣別
const fnSelCurrencyOutChange = async (val) => {
  if (sSelCurrencyOut.value === "") {
    sSelCurrencyOutDefault.value = val;
  }

  sSelCurrencyOut.value = val;

  if (val === "TWD") {
    bCurrencyOutIsTWD.value = true;
  } else {
    bCurrencyOutIsTWD.value = false;
  }

  const clearDefaultSelected = () => {
    if (
      sSelCurrencyOut.value !== "USD" &&
      sSelCurrencyOut.value !== "EUR" &&
      sSelCurrencyOut.value !== "CNY" &&
      sSelCurrencyOut.value !== "HKD" &&
      sSelCurrencyOut.value !== "JPY" &&
      sSelCurrencyOut.value !== "TWD"
    ) {
      sSelCurrencyOutDefault.value = null;
    }
  };

  const changeSelected = (val) => {
    if (
      sSelCurrencyOut.value !== "USD" &&
      sSelCurrencyOut.value !== "EUR" &&
      sSelCurrencyOut.value !== "CNY" &&
      sSelCurrencyOut.value !== "HKD" &&
      sSelCurrencyOut.value !== "JPY" &&
      sSelCurrencyOut.value !== "TWD"
    ) {
      sPopupMessage.value = t("fxDollar.fxCurrency.alertCurrencyOut");
      bDialogVisible.value = true;
      sSelCurrencyOut.value = sNextSelCurrencyOut;
      sSelCurrencyOutDefault.value = sNextSelCurrencyOut;
      return;
    }

    //隱藏可用餘額
    bBalanceIsShow.value = false;
    sTxtRate.value = "臺幣0元(TWD)";
    //存入上一次選擇幣別
    sNextSelCurrencyOut = val;

    //更換申購現鈔幣別
    if (
      sSelCurrencyOut.value === "USD" ||
      sSelCurrencyOut.value === "EUR" ||
      sSelCurrencyOut.value === "CNY" ||
      sSelCurrencyOut.value === "HKD" ||
      sSelCurrencyOut.value === "JPY"
    ) {
      if (sSelCurrencyOut.value === sSelCurrencyIn.value) {
        document
          .querySelector(".selCurrencyIn")
          .classList.add("input_disabled");
      } else {
        //清空申購現鈔金額
        sTxtTransAmount.value = 0;

        document
          .querySelector(".selCurrencyIn")
          .classList.add("input_disabled");
        fnSelCurrencyInChange(sSelCurrencyOut.value);
      }
    } else {
      if (
        document
          .querySelector(".selCurrencyIn")
          .classList.contains("input_disabled")
      ) {
        document
          .querySelector(".selCurrencyIn")
          .classList.remove("input_disabled");
      }
      if (sSelCurrencyIn.value !== "USD") {
        //清空申購現鈔金額
        sTxtTransAmount.value = 0;

        fnSelCurrencyInChange("USD");
      }
    }

    fnSetAccountOut(val);
  };

  await clearDefaultSelected();
  changeSelected(val);
};

//轉出帳號
const aAccountOut = reactive([]); //轉出帳號
const sSelAccountOut = ref(""); //v-model
const sSelAccountOutDefault = ref(null);

//置入-轉出帳號
const fnSetAccountOut = (val) => {
  //依幣別從對應帳號列取得該幣別帳號
  aAccountOut.length = 0;
  if (val === "TWD") {
    aCurrencyOutTWD.forEach((item, i) => {
      let obj = {
        value: item.Acctno,
        label: item.DisplayAcct,
      };
      aAccountOut.push(obj);
    });
  } else {
    aCurrencyOutFD.forEach((item, i) => {
      let obj = {
        value: item.Acctno,
        label: item.DisplayAcct,
      };
      if (item.CCY === val) {
        aAccountOut.push(obj);
      }
    });
  }
  fnSelAccountOutChange(aAccountOut[0].value);
};

//變更-轉出帳號
const fnSelAccountOutChange = async (val) => {
  sSelAccountOut.value = val;

  const clearDefaultSelected = () => {
    sSelAccountOutDefault.value = null;
  };

  const changeSelected = (val) => {
    sSelAccountOutDefault.value = val;
    fnSetBalance();
  };

  await clearDefaultSelected();
  changeSelected(val);
};

const sBalanceShow = ref(""); //可用餘額(顯示)
let sBalance = ""; //可用餘額

//置入帳號餘額
const fnSetBalance = async () => {
  //發api查詢可用餘額
  const fnApiGetBalance = () => {
    const sAccountNo = sSelAccountOut.value;
    const sAccountCcy = sSelCurrencyOut.value;
    if (sAccountCcy === "TWD") {
      //查詢台幣帳戶可用餘額
      const request = { acctno: sAccountNo };
      (async () => {
        try {
          const response = await apiPostAcctNoBalancsEx(qs.stringify(request));
          console.log("apiPostAcctNoBalancsEx success");
          console.log(response);
          if (response.status === 200) {
            if (response.data) {
              const code = response.data.substr(0, 1);
              sBalance = response.data.substr(1);
              if (code === "E") {
                sBalanceShow.value = sBalance;
              } else {
                sBalanceShow.value = fnFormatPrice(sBalance) + "元(TWD)";
              }
              bLoadingBalanceOK.value = true;
              bBalanceIsShow.value = true;
            } else {
              bBalanceIsShow.value = false;
            }
          } else if (response.status === 500) {
            bBalanceIsShow.value = false;
          }
        } catch (error) {
          console.log("apiPostAcctNoBalancsEx error message => " + error);
          bBalanceIsShow.value = false;
        }
      })();
    } else {
      //查詢外幣帳戶可用餘額
      const request = { acctno: sAccountNo, currency: sAccountCcy };
      (async () => {
        try {
          const response = await apiPostAcctNoBalancsFmFxEx(
            qs.stringify(request)
          );
          console.log("apiPostAcctNoBalancsFmFxEx success");
          console.log(response);
          if (response.status === 200) {
            if (response.data) {
              const code = response.data.substr(0, 1);
              sBalance = response.data.substr(1);
              if (code === "E") {
                sBalanceShow.value = sBalance;
              } else {
                sBalanceShow.value = sBalance;
              }
              bLoadingBalanceOK.value = true;
              bBalanceIsShow.value = true;
            } else {
              bBalanceIsShow.value = false;
            }
          } else if (response.status === 500) {
            bBalanceIsShow.value = false;
          }
        } catch (error) {
          console.log("apiPostAcctNoBalancsFmFxEx error message => " + error);
          bBalanceIsShow.value = false;
        }
      })();
    }
  };

  bLoadingBalanceOK.value = false;
  fnApiGetBalance();
};

//申購現鈔幣別
const aSelCurrencyIn = reactive([
  {
    value: "USD",
    label: "USD 美元",
  },
  {
    value: "EUR",
    label: "EUR 歐元",
  },
  {
    value: "CNY",
    label: "CNY 人民幣",
  },
  {
    value: "HKD",
    label: "HKD 港幣",
  },
  {
    value: "JPY",
    label: "JPY 日圓",
  },
]);
const sSelCurrencyIn = ref(""); //v-model
const sSelCurrencyInDefault = ref(null);

const fnSelCurrencyInChange = async (val) => {
  sSelCurrencyIn.value = val;
  sTotalAmount.value = "0元(" + sSelCurrencyIn.value + ")";

  const clearDefaultSelected = () => {
    sSelCurrencyInDefault.value = null;
  };

  const changeSelected = () => {
    sSelCurrencyInDefault.value = val;
    sTxtTransAmount.value = 0;
    sTxtRate.value = "臺幣0元(TWD)";
    fnGetApiExchangeBranchData(val);
  };

  await clearDefaultSelected();
  changeSelected();
};

//申購現鈔金額
const sTxtTransAmount = ref(0);
const sTxtRate = ref("臺幣0元(TWD)");
const bLoadingRateOK = ref(true);

//變更-申購現鈔金額
const fnTxtTransAmountChange = async () => {
  bLoadingRateOK.value = true;
  let amount = sTxtTransAmount.value;
  let exchange = 1;
  if (
    amount.toString().length > 1 &&
    amount.toString().substring(0, 1) === "0"
  ) {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertOnlyNumber");
    bDialogVisible.value = true;
    sTxtTransAmount.value = 0;
    sTxtRate.value = "臺幣0元(TWD)";
  } else if (
    isNaN(amount) ||
    amount < 0 ||
    amount.toString().indexOf(".") !== -1
  ) {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertOnlyNumber");
    bDialogVisible.value = true;
    sTxtTransAmount.value = 0;
    sTxtRate.value = "臺幣0元(TWD)";
  } else if (+amount === 0) {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertEnterTransAmount");
    bDialogVisible.value = true;
    sTxtTransAmount.value = 0;
    sTxtRate.value = "臺幣0元(TWD)";
  } else if (sSelCurrencyIn.value === "USD" && +amount < 100) {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertMinUSD");
    bDialogVisible.value = true;
    sTxtTransAmount.value = 0;
    sTxtRate.value = "臺幣0元(TWD)";
  } else if (sSelCurrencyIn.value === "USD" && +amount > 5000) {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertMaxUSD");
    bDialogVisible.value = true;
    sTxtTransAmount.value = 0;
    sTxtRate.value = "臺幣0元(TWD)";
  } else if (sSelCurrencyIn.value === "EUR" && +amount < 100) {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertMinEUR");
    bDialogVisible.value = true;
    sTxtTransAmount.value = 0;
    sTxtRate.value = "臺幣0元(TWD)";
  } else if (sSelCurrencyIn.value === "EUR" && +amount > 5000) {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertMaxEUR");
    bDialogVisible.value = true;
    sTxtTransAmount.value = 0;
    sTxtRate.value = "臺幣0元(TWD)";
  } else if (sSelCurrencyIn.value === "CNY" && +amount < 500) {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertMinCNY");
    bDialogVisible.value = true;
    sTxtTransAmount.value = 0;
    sTxtRate.value = "臺幣0元(TWD)";
  } else if (sSelCurrencyIn.value === "CNY" && +amount > 20000) {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertMaxCNY");
    bDialogVisible.value = true;
    sTxtTransAmount.value = 0;
    sTxtRate.value = "臺幣0元(TWD)";
  } else if (sSelCurrencyIn.value === "HKD" && +amount < 500) {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertMinHKD");
    bDialogVisible.value = true;
    sTxtTransAmount.value = 0;
    sTxtRate.value = "臺幣0元(TWD)";
  } else if (sSelCurrencyIn.value === "HKD" && +amount > 20000) {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertMaxHKD");
    bDialogVisible.value = true;
    sTxtTransAmount.value = 0;
    sTxtRate.value = "臺幣0元(TWD)";
  } else if (sSelCurrencyIn.value === "JPY" && +amount < 10000) {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertMinJPY");
    bDialogVisible.value = true;
    sTxtTransAmount.value = 0;
    sTxtRate.value = "臺幣0元(TWD)";
  } else if (sSelCurrencyIn.value === "JPY" && +amount > 500000) {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertMaxJPY");
    bDialogVisible.value = true;
    sTxtTransAmount.value = 0;
    sTxtRate.value = "臺幣0元(TWD)";
  } else {
    if (sSelCurrencyOut.value === "TWD") {
      fnApiPostEquivFxTrans();
    }
  }
};

//幣轉
const fnApiPostEquivFxTrans = async () => {
  bLoadingRateOK.value = false;

  const request = {
    amt: sTxtTransAmount.value,
    iCcy: "TWD",
    oCcy: sSelCurrencyIn.value,
  };
  (async () => {
    try {
      const response = await apiPostEquivFxTrans(qs.stringify(request));
      console.log("apiPostEquivFxTrans success");
      console.log(response);
      if (response.status === 200) {
        if (response.data) {
          let amount = response.data.toString();
          if (amount.indexOf(".") !== -1) {
            let arr = amount.split(".");
            amount = arr[0];
          }
          sTxtRate.value = "臺幣" + amount + "元(TWD)";
          bLoadingRateOK.value = true;
        } else {
          bCurrencyOutIsTWD.value = false;
        }
      } else if (response.status === 500) {
        bCurrencyOutIsTWD.value = false;
      }
    } catch (error) {
      console.log("apiPostEquivFxTrans error message => " + error);
      bCurrencyOutIsTWD.value = false;
    }
  })();
};

//聚焦-申購現鈔金額
const fnTxtTransAmountFocus = () => {
  sTxtTransAmount.value = "";
};

//離開-申購現鈔金額
const fnTxtTransAmountBlur = () => {
  if (sTxtTransAmount.value === "") {
    sTxtTransAmount.value = 0;
    sTxtRate.value = "臺幣0元(TWD)";
  }
};

//領取行政區
let aExchangeBranch = {}; //api取回分行資料
const aSelArea = reactive([]); //選擇行政區資料
const sSelArea = ref(""); //v-model
const aSelAreaDefault = ref(null);

//置入指定現鈔明細(領取分行)
const fnGetApiExchangeBranchData = async (val) => {
  fnShowElLoading();

  const request = { Getccy: val };
  (async () => {
    try {
      const response = await apiPostFxGetExchangeBranch(qs.stringify(request));
      console.log("apiPostFxGetExchangeBranch success");
      console.log(response);
      fnHideElLoading();
      fnApiPostFxGetExchangeBranchOnSuccess(response);
    } catch (error) {
      console.log("apiPostFxGetExchangeBranch error message => " + error);
      store.dispatch("publicStore/handSetErrorMessageState", {
        zh_tw: "交易不明，若為帳務性交易，請洽服務人員，勿重複操作!",
        en: "Unidentified transaction, if the transaction is for accounting purposes, please contact our customer service and do not repeat the transaction!",
      });
      router.push({ name: "errorDefalutPage" });
    }
  })();
};

const fnApiPostFxGetExchangeBranchOnSuccess = (response) => {
  if (response.data.status === "200") {
    const data = response.data.rsData;
    if (data && Object.keys(data).length !== 0) {
      aExchangeBranch = data;
      fnSetArea(data);
    } else {
      store.dispatch("publicStore/handSetErrorMessageState", {
        zh_tw: "交易不明，若為帳務性交易，請洽服務人員，勿重複操作!",
        en: "Unidentified transaction, if the transaction is for accounting purposes, please contact our customer service and do not repeat the transaction!",
      });
      router.push({ name: "errorDefalutPage" });
    }
  } else if (response.data.status === "500") {
    console.log(
      "apiPostFxGetExchangeBranch error message => " + response.data.errMsg
    );
    store.dispatch("publicStore/handSetErrorMessageState", {
      zh_tw: response.data.errMsg,
      en: response.data.errMsg,
    });
    router.push({ name: "errorDefalutPage" });
  }
};

//置入-領取行政區
const fnSetArea = (data) => {
  aSelArea.length = 0;
  const oBranch = Object.keys(data);
  const nLength = oBranch.length;
  for (let i = 0; i < nLength; i++) {
    const branchData = data[oBranch[i]];
    let obj = {};
    obj.value = branchData.Zone;
    obj.label = branchData.Zone;
    const cityName = branchData.Zone.substr(0, 3);
    if (cityName === "基隆市") {
      obj.index = "0";
    } else if (cityName === "台北市") {
      obj.index = "1";
    } else if (cityName === "新北市") {
      obj.index = "2";
    } else if (cityName === "桃園市") {
      obj.index = "3";
    } else if (cityName === "新竹市") {
      obj.index = "4";
    } else if (cityName === "新竹縣") {
      obj.index = "5";
    } else if (cityName === "苗栗縣") {
      obj.index = "6";
    } else if (cityName === "台中市") {
      obj.index = "7";
    } else if (cityName === "南投縣") {
      obj.index = "8";
    } else if (cityName === "彰化縣") {
      obj.index = "9";
    } else if (cityName === "雲林縣") {
      obj.index = "10";
    } else if (cityName === "嘉義市") {
      obj.index = "11";
    } else if (cityName === "嘉義縣") {
      obj.index = "12";
    } else if (cityName === "台南市") {
      obj.index = "13";
    } else if (cityName === "高雄市") {
      obj.index = "14";
    } else if (cityName === "屏東縣") {
      obj.index = "15";
    } else if (cityName === "台東縣") {
      obj.index = "16";
    } else if (cityName === "花蓮縣") {
      obj.index = "17";
    } else if (cityName === "宜蘭縣") {
      obj.index = "18";
    } else if (cityName === "金門縣") {
      obj.index = "19";
    } else {
      obj.index = "20";
    }
    let bool = true;
    for (let j = 0; j < aSelArea.length; j++) {
      if (branchData.Zone === aSelArea[j].value) {
        bool = false;
        break;
      }
    }
    //避免行政區重複
    if (bool) {
      aSelArea.push(obj);
    }
  }
  aSelArea.sort(function (a, b) {
    return a.index - b.index;
  });

  aSelAreaDefault.value = "";
  sSelArea.value = "";
  aSelBranchDefault.value = "";
  sSelBranch.value = "";
  bShowAmountDetail.value = false;
};

//變更-領取行政區
const fnSelAreaChange = async (val) => {
  sSelArea.value = val;

  const clearDefaultSelected = () => {
    aSelAreaDefault.value = null;
  };

  const changeSelected = () => {
    aSelAreaDefault.value = val;
    fnSetBranch(val);
  };

  await clearDefaultSelected();
  changeSelected();
};

//領取分行
const aSelBranch = reactive([]);
const sSelBranch = ref(""); //v-model
const aSelBranchDefault = ref(null);

//置入-領取分行
const fnSetBranch = (val) => {
  aSelBranch.length = 0;

  const oBranch = Object.keys(aExchangeBranch);
  const nLength = oBranch.length;
  for (let i = 0; i < nLength; i++) {
    const branchData = aExchangeBranch[oBranch[i]];
    let obj = {
      value: oBranch[i],
      label: oBranch[i] + " " + branchData.Name,
      Denomination1: branchData.Denomination1,
      Sheet1: branchData.Sheet1,
      Denomination2: branchData.Denomination2,
      Sheet2: branchData.Sheet2,
      Denomination3: branchData.Denomination3,
      Sheet3: branchData.Sheet3,
      Denomination4: branchData.Denomination4,
      Sheet4: branchData.Sheet4,
      Denomination5: branchData.Denomination5,
      Sheet5: branchData.Sheet5,
      Denomination6: branchData.Denomination6,
      Sheet6: branchData.Sheet6,
    };
    if (branchData.Zone === val) {
      aSelBranch.push(obj);
    }
  }
  aSelBranchDefault.value = "";
  sSelBranch.value = "";
  bShowAmountDetail.value = false;
};

//變更-領取分行
const fnSelBranchChange = async (val) => {
  sSelBranch.value = val;

  const clearDefaultSelected = () => {
    aSelBranchDefault.value = null;
  };

  const changeSelected = () => {
    aSelBranchDefault.value = val;
    sTotalAmount.value = "0元(" + sSelCurrencyIn.value + ")";
    nTotalAmount = 0;
    fnSetAmountDetail(val);
  };

  await clearDefaultSelected();
  changeSelected();
};

//指定現鈔明細
const aAmountDetail = reactive([]); //現鈔明細
const sTotalAmount = ref("0元(" + sSelCurrencyIn.value + ")");
let nTotalAmount = 0;
const bShowAmountDetail = ref(false);

const fnSetAmountDetail = (branch) => {
  aAmountDetail.length = 0;

  const aBranchDetail = aSelBranch.filter(function (item) {
    return item.value === branch;
  });
  let obj = [
    {
      Denomination: aBranchDetail[0].Denomination1,
      Sheet: aBranchDetail[0].Sheet1,
      Total: "0",
    },
    {
      Denomination: aBranchDetail[0].Denomination2,
      Sheet: aBranchDetail[0].Sheet2,
      Total: "0",
    },
    {
      Denomination: aBranchDetail[0].Denomination3,
      Sheet: aBranchDetail[0].Sheet3,
      Total: "0",
    },
    {
      Denomination: aBranchDetail[0].Denomination4,
      Sheet: aBranchDetail[0].Sheet4,
      Total: "0",
    },
    {
      Denomination: aBranchDetail[0].Denomination5,
      Sheet: aBranchDetail[0].Sheet5,
      Total: "0",
    },
    {
      Denomination: aBranchDetail[0].Denomination6,
      Sheet: aBranchDetail[0].Sheet6,
      Total: "0",
    },
  ];
  Array.prototype.push.apply(aAmountDetail, obj);

  if (
    document.querySelector(".amountDetail_input") !== null &&
    document.querySelector(".amountDetail_input") !== undefined
  ) {
    const inputDOM = document.querySelectorAll(".amountDetail_input");
    for (let i = 0; i < 6; i++) {
      inputDOM[i].value = "0";
    }
  }
  bShowAmountDetail.value = true;
};

//變更-指定現鈔明細
const fnTxtAmountDetailChange = (e) => {
  nTotalAmount = 0;
  let sNumber = e.target.value;
  const i = e.target.dataset.index;
  const sAmount = e.target.dataset.amount;

  if (
    sNumber.toString().length > 1 &&
    sNumber.toString().substring(0, 1) === "0"
  ) {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertEnterDetail");
    bDialogVisible.value = true;
    e.target.value = 0;
    sNumber = 0;
  } else {
    if (
      isNaN(sNumber) ||
      Number(sNumber) < 0 ||
      sNumber.toString().indexOf(".") !== -1
    ) {
      sPopupMessage.value = t("fxDollar.fxCurrency.alertEnterDetail");
      bDialogVisible.value = true;
      e.target.value = 0;
      sNumber = 0;
    }
  }

  //非最大面額張數不可大於10
  if (i !== "0" && Number(sNumber) > 10) {
    sPopupMessage.value =
      t("fxDollar.fxCurrency.alertAmount") +
      sAmount +
      t("fxDollar.fxCurrency.alertAmountMoreThan10");
    bDialogVisible.value = true;
    e.target.value = 0;
    sNumber = 0;
  }

  //置入小計欄位
  const nTotal = parseInt(sAmount) * parseInt(sNumber);
  aAmountDetail[i].Total = fnFormatPrice(nTotal.toString());

  //置入現鈔總額欄位
  for (let i = 0; i < aAmountDetail.length; i++) {
    nTotalAmount =
      nTotalAmount + parseInt(aAmountDetail[i].Total.replace(/,/g, ""));
  }
  sTotalAmount.value =
    fnFormatPrice(nTotalAmount.toString()) + "元(" + sSelCurrencyIn.value + ")";
};

//聚焦-指定現鈔明細
const fnTxtAmountDetailFocus = (e) => {
  const i = e.target.dataset.index;
  const inputDOM = document.querySelectorAll(".amountDetail_input");
  inputDOM[i].value = "";
};

//離開-指定現鈔明細
const fnTxtAmountDetailBlur = (e) => {
  const i = e.target.dataset.index;
  const inputDOM = document.querySelectorAll(".amountDetail_input");
  if (inputDOM[i].value === "") {
    inputDOM[i].value = "0";
    fnTxtAmountDetailChange(e);
  }
};

//預約領取日
const sReserveDate = ref("");

const disabledDate = (time) => {
  const newStartDate = new Date(aStartDate + "T00:00:00");
  const newEndDate = new Date(aEndDate + "T00:00:00");
  return (
    time.getTime() < newStartDate.getTime() ||
    time.getTime() > newEndDate.getTime()
  );
};

//交易性質
const aSelTradeType = reactive([
  {
    value: "131",
    label: "131-商務支出",
  },
  {
    value: "132",
    label: "132-觀光支出",
  },
  {
    value: "133",
    label: "133-探親支出",
  },
  {
    value: "134",
    label: "134-留學支出",
  },
]);
const sSelTradeType = ref("");
const sSelTradeTypeDefault = ref(null);

const fnSelTradeTypeChange = async (val) => {
  sSelTradeType.value = val;

  const clearDefaultSelected = () => {
    sSelTradeTypeDefault.value = null;
  };

  const changeSelected = () => {
    sSelTradeTypeDefault.value = val;
  };

  await clearDefaultSelected();
  changeSelected();
};

//目的地國別
const sSelTargetCountry = ref("");
const sSelTargetCountryDefault = ref(null);

const fnSelTargetCountryChange = async (val) => {
  sSelTargetCountry.value = val;

  const clearDefaultSelected = () => {
    sSelTargetCountryDefault.value = null;
  };

  const changeSelected = () => {
    sSelTargetCountryDefault.value = val;
  };

  await clearDefaultSelected();
  changeSelected();
};

//回上一頁
const fnReturnPage = () => {
  router.push({ name: "fxccyApply" });
};

//確認送出
const fnGoNextPage = () => {
  console.log("領取分行：" + sSelBranch.value);

  const domCheckbox1 = document.getElementById("consent1");
  const domCheckbox2 = document.getElementById("consent2");
  let balance = sBalance.toString();
  if (balance.indexOf("元") !== -1) {
    let arr = balance.split("元");
    balance = arr[0];
  }
  balance = balance.replace(/,/g, "");

  const aSelectDate = sReserveDate.value.split("/");
  const dSelectDate = new Date(
    aSelectDate[0] + "-" + aSelectDate[1] + "-" + aSelectDate[2] + "T00:00:00"
  );
  const dStartDate = new Date(aStartDate + "T00:00:00");
  const dEndDate = new Date(aEndDate + "T00:00:00");

  //指定現鈔明細檢核
  let nCheckNumber = true;
  if (bShowAmountDetail.value) {
    const numberDOM = document.querySelectorAll(".amountDetail_input");
    aAmountDetail.forEach((item, i) => {
      if (parseInt(numberDOM[i].value) > item.Sheet) {
        sPopupMessage.value =
          t("fxDollar.fxCurrency.alertAmount") +
          item.Denomination +
          t("fxDollar.fxCurrency.alertAmountNotEnough");
        bDialogVisible.value = true;
        nCheckNumber = false;
      }
    });
  }

  //頁面欄位檢核
  if (sSelCurrencyOut.value === "") {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertEnterCurrencyOut");
    bDialogVisible.value = true;
  } else if (sSelAccountOut.value === "") {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertEnterAccountOut");
    bDialogVisible.value = true;
  } else if (sSelCurrencyIn.value === "") {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertEnterCurrencyIn");
    bDialogVisible.value = true;
  } else if (
    sTxtTransAmount.value === "" ||
    sTxtTransAmount.value === 0 ||
    sTxtTransAmount.value === "0"
  ) {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertEnterTransAmount");
    bDialogVisible.value = true;
  } else if (sSelBranch.value === "") {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertEnterBranch");
    bDialogVisible.value = true;
  } else if (sReserveDate.value === "") {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertEnterReserveDate");
    bDialogVisible.value = true;
  } else if (sSelTradeType.value === "") {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertEnterTradeType");
    bDialogVisible.value = true;
  } else if (sSelTargetCountry.value === "") {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertEnterTargetCountry");
    bDialogVisible.value = true;
  } else if (domCheckbox1.checked === false || domCheckbox2.checked === false) {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertConsentNotice");
    bDialogVisible.value = true;
  } else if (+dSelectDate < +dStartDate) {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertDateLess");
    bDialogVisible.value = true;
  } else if (+dSelectDate > +dEndDate) {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertDateMore");
    bDialogVisible.value = true;
  } else if (
    fnFormatDate(sReserveDate.value, "YYYYMMDD", "YYYY/MM/DD") !==
      aOrderDates[0] &&
    fnFormatDate(sReserveDate.value, "YYYYMMDD", "YYYY/MM/DD") !==
      aOrderDates[1] &&
    fnFormatDate(sReserveDate.value, "YYYYMMDD", "YYYY/MM/DD") !==
      aOrderDates[2] &&
    fnFormatDate(sReserveDate.value, "YYYYMMDD", "YYYY/MM/DD") !==
      aOrderDates[3] &&
    fnFormatDate(sReserveDate.value, "YYYYMMDD", "YYYY/MM/DD") !==
      aOrderDates[4]
  ) {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertDateNot");
    bDialogVisible.value = true;
  } else if (sTxtTransAmount.value !== nTotalAmount.toString()) {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertNotTheSame");
    bDialogVisible.value = true;
  } else if (parseInt(sTxtTransAmount.value) > parseInt(balance)) {
    sPopupMessage.value = t("fxDollar.fxCurrency.alertBalance");
    bDialogVisible.value = true;
  } else if (nCheckNumber) {
    fnCheckTrans();
  }
};

//檢查重覆交易
const fnCheckTrans = async () => {
  fnShowElLoading();
  const request = {
    OrderDate: fnFormatDate(sReserveDate.value, "YYYYMMDD", "YYYY/MM/DD"),
    Getccy: sSelCurrencyIn.value,
    TakeAmt: sTxtTransAmount.value,
  };
  (async () => {
    try {
      const response = await apiPostFxGetTrans(qs.stringify(request));
      console.log("apiPostFxGetTrans success");
      console.log(response);
      fnHideElLoading();
      if (response.data.status === "200") {
        const data = response.data.rsData;
        if (data) {
          sTransPopupMessage.value =
            t("fxDollar.fxCurrency.alertEnter1") +
            data.DateTime +
            t("fxDollar.fxCurrency.alertEnter2") +
            fnFormatPrice(data.TakeAmt) +
            " 元(" +
            sSelCurrencyIn.value +
            ")" +
            t("fxDollar.fxCurrency.alertEnter3");
          bTransDialogVisible.value = true;
        } else {
          fnGoConfirmPage();
        }
      } else if (response.data.status === "500") {
        console.log(
          "apiPostFxGetTrans error message => " + response.data.errMsg
        );
        fnGoConfirmPage();
      }
    } catch (error) {
      console.log("apiPostFxGetTrans error message => " + error);
      store.dispatch("publicStore/handSetErrorMessageState", {
        zh_tw: "交易不明，若為帳務性交易，請洽服務人員，勿重複操作!",
        en: "Unidentified transaction, if the transaction is for accounting purposes, please contact our customer service and do not repeat the transaction!",
      });
      router.push({ name: "errorDefalutPage" });
    }
  })();
};

//資料確認(首段發送)
const setCurrencyData = inject("setCurrencyData");
const fnGoConfirmPage = async () => {
  bTransDialogVisible.value = false;

  const inputDOM = document.querySelectorAll(".amountDetail_input");
  const request = {
    Outccy: sSelCurrencyOut.value,
    Getccy: sSelCurrencyIn.value,
    AcctNo: sSelAccountOut.value,
    TakeAmt: sTxtTransAmount.value,
    Branch: sSelBranch.value,
    OrderDate: fnFormatDate(sReserveDate.value, "YYYYMMDD", "YYYY/MM/DD"),
    Sheet1: inputDOM[0].value,
    Sheet2: inputDOM[1].value,
    Sheet3: inputDOM[2].value,
    Sheet4: inputDOM[3].value,
    Sheet5: inputDOM[4].value,
    Sheet6: inputDOM[5].value,
    CBApplyCode: sSelTradeType.value,
    TradeCountry: sSelTargetCountry.value,
  };
  if (document.getElementById("consent1").checked) {
    request.Agree1 = "Y";
  } else {
    request.Agree1 = "N";
  }
  if (document.getElementById("consent2").checked) {
    request.Agree2 = "Y";
  } else {
    request.Agree2 = "N";
  }
  let obj = {};

  fnShowElLoading();

  (async () => {
    try {
      const response = await apiPostFxConfirm(qs.stringify(request));
      console.log("apiPostFxConfirm success");
      console.log(response);
      fnHideElLoading();
      if (response.data.status === "200") {
        const data = response.data.rsData;
        if (data && Object.keys(data).length !== 0) {
          obj.request = request;
          obj.response = data;
          //inject到爸爸
          setCurrencyData(obj);
          router.push({ name: "fxCurrencyConfirm" });
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
};

//關閉POPUP
const bDialogVisible = ref(false);
const sPopupMessage = ref("");
const fnCloseDialog = () => {
  bDialogVisible.value = false;
};

//關閉重複交易POPUP
const bTransDialogVisible = ref(false);
const sTransPopupMessage = ref("");
const fnCloseTransDialog = () => {
  bTransDialogVisible.value = false;
};
</script>

<style lang="scss" scoped>
.two_col {
  display: flex;
  div:first-child {
    flex: 0 0 30%;
  }
  div:last-child {
    flex: 0 0 70%;
  }
}

.tdCurrencyIn div {
  width: 30%;
}

.tdTransAmount .inputOption {
  width: 70%;
}

.tdTransAmount .rateArea {
  width: calc(70% - 10px);
  padding: 5px 15px;
  background: #e5ebf3;
  border-radius: 5px;
}

.tdConsent div:first-child {
  margin-bottom: 25px;
}

.consentArea {
  display: flex;
  div:first-child {
    flex: 0 0 7%;
  }
  div:last-child {
    flex: 0 0 93%;
  }
}

.input_bx {
  input[type="checkbox"] {
    display: none;
  }
  input[type="checkbox"] + label {
    cursor: pointer;
    vertical-align: middle;
  }
  input[type="checkbox"] + label .icon {
    width: 1em;
    height: 1em;
    display: inline-block;
    vertical-align: middle;
    margin: 0 5px 0 0;
    background: #fff;
    background-size: 100%;
    border: solid 1px #83c1e4;
  }
  input[type="checkbox"]:checked + label .icon {
    background: url("~@/assets/images/commonIcon/checkbox_checked_03.jpg")
      center no-repeat;
    background-size: 100%;
  }
}

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

.td_button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.btn_bluelight a {
  display: inline-block;
  padding: 0 10px;
  margin-right: 20px;
  line-height: 30px;
  font-size: 0.89em;
  font-weight: 400;
  color: #fff;
  background-color: #1bc1d5;
  border-radius: 14px;
}

.p_top_10 {
  padding-top: 10px;
}

.apiLoading img {
  vertical-align: sub;
}

@media screen and (max-width: 768px) {
  .two_col {
    display: block;
    div:first-child {
      margin-bottom: 10px;
    }
  }
  .tdCurrencyIn div,
  .tdTransAmount .inputOption,
  .tdTransAmount .rateArea {
    width: 100%;
  }
  .tdTransAmount .rateArea {
    padding: 0;
    color: #1e8ece;
    background: transparent;
  }
  .tableAmountDetail {
    width: 100%;
    tr {
      display: flex;
      align-items: center;
    }
    tr.showDetail ~ tr.showDetail {
      border-top: 1px solid #aaa;
    }
    th,
    td {
      margin-top: 10px;
      margin-bottom: 0px;
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
  .consentArea {
    div:first-child {
      flex: 0 0 10%;
      margin-left: 5px;
      display: flex;
      align-items: center;
    }
    div:last-child {
      flex: 0 0 90%;
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
}
</style>
