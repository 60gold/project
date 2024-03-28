<template>
  <!--表格-->
  <table class="formTable botM2" width="100%">
    <tr>
      <th width="180">
        <span class="mustfill">*</span
        >{{ $t("fxDollar.fxCurrencyQuery.tradeType") }}
      </th>
      <td>
        <ElSelect
          propsId="selTradeType"
          :propsSelectData="aSelTradeType"
          :propsValue="sSelTradeTypeDefault"
          @emitChangeSelectFn="fnSelTradeTypeChange"
        ></ElSelect>
      </td>
    </tr>
    <tr>
      <th>
        <span class="mustfill">*</span
        >{{ $t("fxDollar.fxCurrencyQuery.searchDate") }}
      </th>
      <td>
        <!--選擇日期起訖-->
        <div class="inputSwitcher">
          <div class="inputSwitcher_inner">
            <div class="radioArea">
              <div class="radioItem">
                <input
                  type="radio"
                  id="radio1"
                  name="select"
                  checked="checked"
                />
                <label for="radio1"
                  ><span class="icon"></span
                  ><span>{{
                    $t("fxDollar.fxCurrencyQuery.tradeDate")
                  }}</span></label
                >
              </div>
              <div class="radioItem">
                <input type="radio" id="radio2" name="select" />
                <label for="radio2"
                  ><span class="icon"></span
                  ><span>{{
                    $t("fxDollar.fxCurrencyQuery.reserveDate")
                  }}</span></label
                >
              </div>
            </div>
            <div class="tabArea">
              <input
                type="radio"
                id="tab0"
                name="tab"
                checked="checked"
                @change="fnChangeRadio"
              />
              <label for="tab0">{{
                $t("fxDollar.fxCurrencyQuery.custom")
              }}</label>
              <input
                type="radio"
                id="tab1"
                name="tab"
                @change="fnChangeRadio"
              />
              <label for="tab1">{{
                $t("fxDollar.fxCurrencyQuery.1week")
              }}</label>
              <input
                type="radio"
                id="tab2"
                name="tab"
                @change="fnChangeRadio"
              />
              <label for="tab2">{{
                $t("fxDollar.fxCurrencyQuery.1month")
              }}</label>
              <input
                type="radio"
                id="tab3"
                name="tab"
                @change="fnChangeRadio"
              />
              <label for="tab3">{{
                $t("fxDollar.fxCurrencyQuery.3month")
              }}</label>
            </div>
            <div class="multiInput" v-if="bIsCustom">
              <div class="multiInput_item normalDate">
                <div class="dateInputBox">
                  <el-date-picker
                    v-model="sStartDate"
                    type="date"
                    :placeholder="$t('fxDollar.fxCurrencyQuery.startDate')"
                    format="YYYY/MM/DD"
                    value-format="YYYY/MM/DD"
                    :clearable="false"
                    @change="fnStartDateChange"
                  >
                  </el-date-picker>
                </div>
              </div>
              <div class="multiInput_item normalDate">
                <div class="dateInputBox">
                  <el-date-picker
                    v-model="sEndDate"
                    type="date"
                    :placeholder="$t('fxDollar.fxCurrencyQuery.endDate')"
                    format="YYYY/MM/DD"
                    value-format="YYYY/MM/DD"
                    :clearable="false"
                    @change="fnEndDateChange"
                  >
                  </el-date-picker>
                </div>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  </table>
  <!--按鈕-->
  <div class="btn_check botM3">
    <a
      class="m_color_check"
      href="javascript:void(0)"
      @click.prevent="fnQuery"
      >{{ $t("fxDollar.fxCurrencyQuery.btnSureEnter") }}</a
    >
  </div>
  <div class="QueryArea" v-if="bClickQuery">
    <!--查詢結果-->
    <div class="searchTitle">
      <h2 class="title">{{ $t("fxDollar.fxCurrencyQuery.searchResult") }}</h2>
      <p class="notice">
        {{ $t("fxDollar.fxCurrencyQuery.searchTime") }}{{ sQueryTime }}
      </p>
    </div>
    <!--大網表格-->
    <div class="m_hide" v-if="bHasQueryDate">
      <table class="normalTable botM2" width="100%">
        <tr>
          <th class="tL"></th>
          <th class="tL">{{ $t("fxDollar.fxCurrencyQuery.thNo") }}</th>
          <th class="tL">{{ $t("fxDollar.fxCurrencyQuery.thTradeDate") }}</th>
          <th class="tL">{{ $t("fxDollar.fxCurrencyQuery.thRefNo") }}</th>
          <th class="tL">{{ $t("fxDollar.fxCurrencyQuery.thCcy") }}</th>
          <th class="tL">{{ $t("fxDollar.fxCurrencyQuery.thAmt") }}</th>
          <th class="tL">{{ $t("fxDollar.fxCurrencyQuery.thBranch") }}</th>
          <th class="tL">{{ $t("fxDollar.fxCurrencyQuery.thTakeDate") }}</th>
          <th class="tL">{{ $t("fxDollar.fxCurrencyQuery.thStatus") }}</th>
          <th class="tL">{{ $t("fxDollar.fxCurrencyQuery.thDetail") }}</th>
        </tr>
        <tr
          v-for="(list, index) in aQueryData"
          :key="list.RefNo"
          :data-index="index"
        >
          <td class="detailRadio">
            <div v-if="list.Status === '1' && list.ChangeDate === ''">
              <input
                type="radio"
                :id="'detail' + (index + 1)"
                name="detail"
                :data-refno="list.RefNo"
              />
              <label :for="'detail' + (index + 1)"
                ><span class="icon"></span
              ></label>
            </div>
          </td>
          <td>{{ index + 1 }}</td>
          <td
            v-formatDate="{
              date: list.TrxDate,
              changeFormat: 'YYYY/MM/DD',
              originalFormat: 'YYYYMMDD',
            }"
          ></td>
          <td>{{ list.RefNo }}</td>
          <td>{{ list.CCY }}</td>
          <td v-formatPriceSub00="list.TxAmt"></td>
          <td>{{ list.BranchDisplay }}</td>
          <td
            v-formatDate="{
              date: list.TakeDate,
              changeFormat: 'YYYY/MM/DD',
              originalFormat: 'YYYYMMDD',
            }"
          ></td>
          <td>{{ list.StatusDisplay }}</td>
          <td
            class="tdDetail color_bluelight02"
            :data-refno="list.RefNo"
            @click="fnShowDetail"
          >
            {{ $t("fxDollar.fxCurrencyQuery.thDetail") }}
          </td>
        </tr>
      </table>
    </div>
    <!--大網表格 查無資料-->
    <div class="m_hide" v-if="!bHasQueryDate">
      <table class="normalTable botM2" width="100%">
        <tr>
          <th class="tL"></th>
          <th class="tL">{{ $t("fxDollar.fxCurrencyQuery.thNo") }}</th>
          <th class="tL">{{ $t("fxDollar.fxCurrencyQuery.thTradeDate") }}</th>
          <th class="tL">{{ $t("fxDollar.fxCurrencyQuery.thRefNo") }}</th>
          <th class="tL">{{ $t("fxDollar.fxCurrencyQuery.thCcy") }}</th>
          <th class="tL">{{ $t("fxDollar.fxCurrencyQuery.thAmt") }}</th>
          <th class="tL">{{ $t("fxDollar.fxCurrencyQuery.thBranch") }}</th>
          <th class="tL">{{ $t("fxDollar.fxCurrencyQuery.thTakeDate") }}</th>
          <th class="tL">{{ $t("fxDollar.fxCurrencyQuery.thStatus") }}</th>
          <th class="tL">{{ $t("fxDollar.fxCurrencyQuery.thDetail") }}</th>
        </tr>
        <tr>
          <td colspan="10" class="tC">
            <p class="color_reddark02">
              {{ $t("fxDollar.fxCurrencyQuery.noData") }}
            </p>
          </td>
        </tr>
      </table>
    </div>
    <!--小網表格-->
    <div class="m_block" v-if="bHasQueryDate">
      <ul
        class="transferList"
        v-for="(list, index) in aQueryData"
        :key="list.RefNo"
        :data-index="index"
      >
        <li>
          <div
            class="transferList_title transferList_title_chk"
            :data-index="index"
            @click="fnClickOpenButton"
          >
            <div v-if="list.Status === '1' && list.ChangeDate === ''">
              <input
                type="radio"
                :id="'s_detail' + (index + 1)"
                name="s_detail"
                :data-refno="list.RefNo"
              />
              <label :for="'s_detail' + (index + 1)"
                ><span class="icon"></span
              ></label>
            </div>
          </div>
          <div class="transferList_inner">
            <div class="transferList_detail">
              <li>
                <p class="title">{{ $t("fxDollar.fxCurrencyQuery.thNo") }}</p>
                <p class="item tSmall">{{ index + 1 }}</p>
              </li>
              <li>
                <p class="title">
                  {{ $t("fxDollar.fxCurrencyQuery.thTradeDate") }}
                </p>
                <p
                  class="item tSmall"
                  v-formatDate="{
                    date: list.TrxDate,
                    changeFormat: 'YYYY/MM/DD',
                    originalFormat: 'YYYYMMDD',
                  }"
                ></p>
              </li>
              <li v-if="bIsOpen[index]">
                <p class="title">
                  {{ $t("fxDollar.fxCurrencyQuery.thRefNo") }}
                </p>
                <p class="item tSmall">{{ list.RefNo }}</p>
              </li>
              <li v-if="bIsOpen[index]">
                <p class="title">{{ $t("fxDollar.fxCurrencyQuery.thCcy") }}</p>
                <p class="item tSmall">{{ list.CCY }}</p>
              </li>
              <li v-if="bIsOpen[index]">
                <p class="title">{{ $t("fxDollar.fxCurrencyQuery.thAmt") }}</p>
                <p class="item tSmall" v-formatPriceSub00="list.TxAmt"></p>
              </li>
              <li v-if="bIsOpen[index]">
                <p class="title">
                  {{ $t("fxDollar.fxCurrencyQuery.thBranch") }}
                </p>
                <p class="item tSmall">{{ list.BranchDisplay }}</p>
              </li>
              <li v-if="bIsOpen[index]">
                <p class="title">
                  {{ $t("fxDollar.fxCurrencyQuery.thTakeDate") }}
                </p>
                <p
                  class="item tSmall"
                  v-formatDate="{
                    date: list.TakeDate,
                    changeFormat: 'YYYY/MM/DD',
                    originalFormat: 'YYYYMMDD',
                  }"
                ></p>
              </li>
              <li v-if="bIsOpen[index]">
                <p class="title">
                  {{ $t("fxDollar.fxCurrencyQuery.thStatus") }}
                </p>
                <p class="item tSmall">{{ list.StatusDisplay }}</p>
              </li>
              <li v-if="bIsOpen[index]">
                <p class="title">
                  {{ $t("fxDollar.fxCurrencyQuery.thDetail") }}
                </p>
                <p
                  class="item tSmall tdDetail color_bluelight02"
                  :data-refno="list.RefNo"
                  @click="fnShowDetail"
                >
                  {{ $t("fxDollar.fxCurrencyQuery.thDetail") }}
                </p>
              </li>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!--資料表格-查無資料 小網-->
    <div class="m_block botM3" v-if="!bHasQueryDate">
      <p class="color_reddark02">
        {{ $t("fxDollar.fxCurrencyQuery.noData") }}
      </p>
    </div>
    <!--按鈕-->
    <div class="btn_check botM2">
      <a
        class="order_2 m_color_check web"
        href="javascript:void(0)"
        @click.prevent="fnChangeReserveDate"
        >{{ $t("fxDollar.fxCurrencyQuery.btnChangeDate") }}</a
      >
      <a
        class="order_2 color_menu"
        href="javascript:void(0)"
        @click.prevent="fnBackPage"
        >{{ $t("fxDollar.fxCurrencyQuery.btnHomePage") }}
      </a>
    </div>
  </div>
  <!--注意事項-->
  <SlotNote>
    <div v-html="$t('fxDollar.fxCurrencyQuery.note1')"></div>
  </SlotNote>

  <!-- 申購現鈔明細POPUP -->
  <ElDialog
    :propsDialogVisible="bDetailDialogVisible"
    propsCustomClass="popup_showMessage"
    :propsShowClose="true"
    @emitCloseDialogFn="fnCloseDetailDialog"
  >
    <template #body>
      <!-- 表格 -->
      <div class="detailTitle">
        {{ $t("fxDollar.fxCurrencyQuery.txCurrencyDetail") }}
      </div>
      <!-- 大版 -->
      <table class="normalTable botM2 detailTable">
        <tr>
          <th>{{ $t("fxDollar.fxCurrencyQuery.thAmount") }}</th>
          <th>{{ $t("fxDollar.fxCurrencyQuery.thNumber") }}</th>
          <th>{{ $t("fxDollar.fxCurrencyQuery.thTotal") }}</th>
        </tr>
        <tr
          v-for="list in aCurrencyDetail"
          :key="list.Denomination"
          v-show="list.Denomination !== '0000000'"
        >
          <td v-formatPriceRemove0="list.Denomination"></td>
          <td v-formatPriceRemove0="list.Sheet"></td>
          <td v-formatPrice="list.Total"></td>
        </tr>
      </table>
      <!-- 小版 -->
      <div class="m_block">
        <ul
          class="transferList"
          v-for="list in aCurrencyDetail"
          :key="list.Denomination"
          v-show="list.Denomination !== '0000000'"
        >
          <li>
            <div class="transferList_inner">
              <div class="transferList_detail">
                <li>
                  <p class="title">
                    {{ $t("fxDollar.fxCurrencyQuery.thAmount") }}
                  </p>
                  <p
                    class="item tSmall"
                    v-formatPriceRemove0="list.Denomination"
                  ></p>
                </li>
                <li>
                  <p class="title">
                    {{ $t("fxDollar.fxCurrencyQuery.thNumber") }}
                  </p>
                  <p class="item tSmall" v-formatPriceRemove0="list.Sheet"></p>
                </li>
                <li>
                  <p class="title">
                    {{ $t("fxDollar.fxCurrencyQuery.thTotal") }}
                  </p>
                  <p class="item tSmall" v-formatPrice="list.Total"></p>
                </li>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </template>
    <template #footer>
      <!-- 按鈕 -->
      <div class="btn_check">
        <a
          class="m_color_back"
          href="javascript:void(0)"
          @click.prevent="bDetailDialogVisible = false"
          >{{ $t("fxDollar.fxCurrencyQuery.btnClose") }}</a
        >
      </div>
    </template>
  </ElDialog>
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
  name: "fxccyQuery",
};
</script>

<script setup>
import { ref, reactive, onMounted, onUnmounted, inject } from "vue";
import ElSelect from "@/components/publicComponents/forms/ElSelectComponent.vue";
import SlotNote from "@/components/publicComponents/other/SlotNote.vue";
import ElDialog from "@/components/publicComponents/diolog_popup/SlotElDialogDefault.vue";
import { fnFormatDate } from "@/common/methodCommon/publicMethod";
import {
  apiPostFxCheck,
  apiPostFxQuery,
} from "@/api/axios/fxDollar/fxCurrencyQuery.js";
import {
  fnShowElLoading,
  fnHideElLoading,
} from "@/common/methodCommon/publicMethod";
import qs from "qs";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
dayjs.extend(customParseFormat);

const store = useStore();
const router = useRouter();
const { t } = useI18n();

//頁面檢核
const fnApiCheck = async () => {
  fnShowElLoading();

  (async () => {
    try {
      const response = await apiPostFxCheck();
      console.log("apiPostFxCheck success");
      console.log(response);
      fnHideElLoading();
      if (response.data.status !== "200") {
        store.dispatch("publicStore/handSetErrorMessageState", {
          zh_tw: response.data.errMsg,
          en: response.data.errMsg,
        });
        router.push({ name: "errorDefalutPage" });
      }
    } catch (error) {
      console.log("apiPostFxCheck error message => " + error);
      store.dispatch("publicStore/handSetErrorMessageState", {
        zh_tw: "交易不明，若為帳務性交易，請洽服務人員，勿重複操作!",
        en: "Unidentified transaction, if the transaction is for accounting purposes, please contact our customer service and do not repeat the transaction!",
      });
      router.push({ name: "errorDefalutPage" });
    }
  })();
};
onMounted(() => {
  fnApiCheck();
});

//交易狀態
const aSelTradeType = reactive([
  {
    value: "0",
    label: "全部",
  },
  {
    value: "1",
    label: "未領鈔",
  },
  {
    value: "2",
    label: "已領鈔",
  },
  {
    value: "3",
    label: "逾期未取鈔",
  },
  {
    value: "4",
    label: "逾期已回售",
  },
  {
    value: "5",
    label: "回售交易處理中",
  },
]);
const sSelTradeType = ref(""); //v-model
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
onMounted(() => {
  fnSelTradeTypeChange(aSelTradeType[0].value);
});

//是否顯示日期選擇區域
const bIsCustom = ref(true);
const fnChangeRadio = () => {
  if (!document.getElementById("tab0").checked) {
    bIsCustom.value = false;
  } else {
    bIsCustom.value = true;
  }
};

//查詢日期
const sStartDate = ref(""); //查詢日期(起)
const sEndDate = ref(""); //查詢日期(迄)
sStartDate.value = fnFormatDate(new Date(), "YYYY/MM/DD");
sEndDate.value = fnFormatDate(new Date(), "YYYY/MM/DD");

const fnStartDateChange = (val) => {
  console.log("查詢日期(起): " + sStartDate.value);
};

const fnEndDateChange = (val) => {
  console.log("查詢日期(迄): " + sEndDate.value);
};

const bClickQuery = ref(false); //顯示查詢結果
const bHasQueryDate = ref(null); //是否有查詢資料
const sQueryTime = ref(""); //查詢時間
const aQueryData = reactive([]); //查詢結果資料-整理過
let aApiQueryData = {}; //查詢結果資料-API查回
const bIsOpen = reactive([]); //小網表格開關

//點擊確認送出-查詢
const fnQuery = async () => {
  bClickQuery.value = false;
  aQueryData.length = 0;
  bIsOpen.length = 0;
  const listButton = document.querySelectorAll(".transferList_title");
  if (listButton.length > 0) {
    listButton.forEach((item, i) => {
      if (listButton[i].classList.contains("open")) {
        listButton[i].classList.remove("open");
      }
    });
  }

  sQueryTime.value = fnFormatDate(new Date(), "YYYY/MM/DD HH:mm:ss");

  //查詢時間限6個月內
  const sixMonths = dayjs(new Date()).subtract(6, "month").format("YYYY-MM-DD");
  const sixMonthsDate = new Date(sixMonths);
  const selectStart = fnFormatDate(
    sStartDate.value,
    "YYYY-MM-DD",
    "YYYY/MM/DD"
  );
  const selectStartDate = new Date(selectStart);

  if (document.getElementById("tab0").checked) {
    if (+selectStartDate < +sixMonthsDate) {
      sPopupMessage.value = t("fxDollar.fxCurrencyQuery.alertSearchDate");
      bDialogVisible.value = true;
    } else {
      fnApiQuery();
    }
  } else {
    fnApiQuery();
  }
};

//發送查詢api
const fnApiQuery = async () => {
  fnShowElLoading();

  const request = {};
  request.Status = sSelTradeType.value;
  if (document.getElementById("radio1").checked) {
    request.Kind = "1";
  } else if (document.getElementById("radio2").checked) {
    request.Kind = "2";
  }
  if (document.getElementById("tab0").checked) {
    request.StartDate = fnFormatDate(
      sStartDate.value,
      "YYYYMMDD",
      "YYYY/MM/DD"
    );
    request.EndDate = fnFormatDate(sEndDate.value, "YYYYMMDD", "YYYY/MM/DD");
  } else if (document.getElementById("tab1").checked) {
    request.StartDate = dayjs(new Date())
      .subtract(1, "week")
      .format("YYYYMMDD");
    request.EndDate = fnFormatDate(new Date(), "YYYYMMDD");
  } else if (document.getElementById("tab2").checked) {
    request.StartDate = dayjs(new Date())
      .subtract(1, "month")
      .format("YYYYMMDD");
    request.EndDate = fnFormatDate(new Date(), "YYYYMMDD");
  } else if (document.getElementById("tab3").checked) {
    request.StartDate = dayjs(new Date())
      .subtract(3, "month")
      .format("YYYYMMDD");
    request.EndDate = fnFormatDate(new Date(), "YYYYMMDD");
  }

  (async () => {
    try {
      const response = await apiPostFxQuery(qs.stringify(request));
      fnHideElLoading();
      if (response.data.status === "200") {
        console.log("apiPostFxQuery success");
        console.log(response);
        const data = response.data.rsData;
        if (data && Object.keys(data).length > 0) {
          aApiQueryData = data;
          fnApiPostFxQueryOnSuccess(data);
        } else {
          bHasQueryDate.value = false;
          bClickQuery.value = true;
        }
      } else if (response.data.status === "500") {
        store.dispatch("publicStore/handSetErrorMessageState", {
          zh_tw: response.data.errMsg,
          en: response.data.errMsg,
        });
        router.push({ name: "errorDefalutPage" });
      }
    } catch (error) {
      console.log("apiPostFxQuery error message => " + error);
      store.dispatch("publicStore/handSetErrorMessageState", {
        zh_tw: "交易不明，若為帳務性交易，請洽服務人員，勿重複操作!",
        en: "Unidentified transaction, if the transaction is for accounting purposes, please contact our customer service and do not repeat the transaction!",
      });
      router.push({ name: "errorDefalutPage" });
    }
  })();
};

const fnApiPostFxQueryOnSuccess = (data) => {
  const nowDate = new Date();
  const dNowDate = new Date(
    nowDate.getFullYear() +
      "-" +
      (nowDate.getMonth() + 1) +
      "-" +
      nowDate.getDate()
  );

  const oRefNo = Object.keys(data);
  const nLength = oRefNo.length;
  for (let i = 0; i < nLength; i++) {
    const currencyData = data[oRefNo[i]];
    let obj = currencyData;
    obj.RefNo = oRefNo[i];

    const takeDate = currencyData.TakeDate;
    const dTakeDate = new Date(
      takeDate.substr(0, 4) +
        "-" +
        takeDate.substr(4, 2) +
        "-" +
        takeDate.substr(6, 2) +
        "T00:00:00"
    );

    if (currencyData.Status === "1") {
      if (+dTakeDate >= +dNowDate) {
        obj.StatusDisplay = "未領鈔";
      } else {
        obj.StatusDisplay = "逾期未取鈔";
      }
    } else if (currencyData.Status === "2") {
      obj.StatusDisplay = "已領鈔";
    } else if (currencyData.Status === "3" || currencyData.Status === "5") {
      obj.StatusDisplay = "逾期已回售";
    } else if (currencyData.Status === "4") {
      obj.StatusDisplay = "回售交易處理中";
    } else {
      obj.StatusDisplay = "";
    }

    aQueryData.push(obj);
    bIsOpen.push(false);
  }

  //由日期新至舊排序
  if (document.getElementById("radio1").checked) {
    //以交易日期排序
    aQueryData.sort((a, b) => {
      return b.TrxDate - a.TrxDate;
    });
  } else if (document.getElementById("radio2").checked) {
    //以預約領取日排序
    aQueryData.sort((a, b) => {
      return b.TakeDate - a.TakeDate;
    });
  }

  bHasQueryDate.value = true;
  bClickQuery.value = true;
};

//現鈔明細POPUP
const aCurrencyDetail = reactive([]);

//點擊現鈔明細
const fnShowDetail = (e) => {
  const i = e.target.dataset.refno;
  const aData = aApiQueryData[i];
  aCurrencyDetail.length = 0;

  let obj = [
    {
      Denomination: aData.Denomination1,
      Sheet: aData.Sheet1,
      Total: (+aData.Denomination1 * +aData.Sheet1).toString(),
    },
    {
      Denomination: aData.Denomination2,
      Sheet: aData.Sheet2,
      Total: (+aData.Denomination2 * +aData.Sheet2).toString(),
    },
    {
      Denomination: aData.Denomination3,
      Sheet: aData.Sheet3,
      Total: (+aData.Denomination3 * +aData.Sheet3).toString(),
    },
    {
      Denomination: aData.Denomination4,
      Sheet: aData.Sheet4,
      Total: (+aData.Denomination4 * +aData.Sheet4).toString(),
    },
    {
      Denomination: aData.Denomination5,
      Sheet: aData.Sheet5,
      Total: (+aData.Denomination5 * +aData.Sheet5).toString(),
    },
    {
      Denomination: aData.Denomination6,
      Sheet: aData.Sheet6,
      Total: (+aData.Denomination6 * +aData.Sheet6).toString(),
    },
  ];
  Array.prototype.push.apply(aCurrencyDetail, obj);

  bDetailDialogVisible.value = true;
};

//計算當前螢幕寬度
const nWindowWidth = ref(window.innerWidth);
const fnOnWidthChange = () => {
  nWindowWidth.value = window.innerWidth;
  if (bHasQueryDate.value) {
    const listButton = document.querySelectorAll(".transferList_title");
    bIsOpen.forEach((item, i) => {
      bIsOpen[i] = false;
      if (listButton[i].classList.contains("open")) {
        listButton[i].classList.remove("open");
      }
    });
  }
};

//小網表格-點擊開啟
const fnClickOpenButton = (e) => {
  const i = e.currentTarget.dataset.index;
  bIsOpen[i] = !bIsOpen[i];
  if (bIsOpen[i]) {
    e.currentTarget.classList.add("open");
  } else {
    e.currentTarget.classList.remove("open");
  }
};

//點擊變更取鈔日
const fnChangeReserveDate = () => {
  let sSelectedRefNo = "";
  if (nWindowWidth.value > 768) {
    if (document.querySelector("input[name='detail']:checked") !== null) {
      sSelectedRefNo = document.querySelector("input[name='detail']:checked")
        .dataset.refno;
      fnGoEnterPage(sSelectedRefNo);
    } else {
      sPopupMessage.value = t("fxDollar.fxCurrencyQuery.alertSelect");
      bDialogVisible.value = true;
    }
  } else {
    if (document.querySelector("input[name='s_detail']:checked") !== null) {
      sSelectedRefNo = document.querySelector("input[name='s_detail']:checked")
        .dataset.refno;
      fnGoEnterPage(sSelectedRefNo);
    } else {
      sPopupMessage.value = t("fxDollar.fxCurrencyQuery.alertSelect");
      bDialogVisible.value = true;
    }
  }
};

//前往變更輸入頁
const setCurrencyData = inject("setCurrencyData");
const fnGoEnterPage = (selectRefNo) => {
  const obj = aApiQueryData[selectRefNo];
  //inject到爸爸
  setCurrencyData(obj);
  router.push({ name: "fxCurrencyQueryEnter" });
};

//回功能頁
const fnBackPage = () => {
  //清除搜尋結果
  bClickQuery.value = false;
  fnSelTradeTypeChange(aSelTradeType[0].value);
  document.getElementById("radio1").checked = true;
  document.getElementById("tab0").checked = true;
  bIsCustom.value = true;
  sStartDate.value = fnFormatDate(new Date(), "YYYY/MM/DD");
  sEndDate.value = fnFormatDate(new Date(), "YYYY/MM/DD");
};

//關閉申購現鈔明細POPUP
const bDetailDialogVisible = ref(false);
const fnCloseDetailDialog = () => {
  bDetailDialogVisible.value = false;
};

//關閉POPUP
const bDialogVisible = ref(false);
const sPopupMessage = ref("");
const fnCloseDialog = () => {
  bDialogVisible.value = false;
};

onMounted(() => {
  window.addEventListener("resize", fnOnWidthChange);
});

onUnmounted(() => {
  window.removeEventListener("resize", fnOnWidthChange);
});
</script>

<style lang="scss" scoped>
.formTable {
  :deep(.el-input.el-input--default.el-date-editor) {
    width: 100%;
  }
}

.radioArea {
  display: flex;
  width: 50%;
  margin-bottom: 10px;
  .radioItem {
    flex: 1 1 auto;
    label {
      display: flex;
      align-items: center;
    }
  }
}

.tabArea {
  display: flex;
  background: #e6ecef;
  border-radius: 6px;
  margin-bottom: 10px;
  label {
    flex: 1 1 auto;
    line-height: 50px;
    text-align: center;
    color: #7994a2;
    background: #e6ecef;
    border-radius: 6px;
    cursor: pointer;
  }
}

.tabArea input[type="radio"]:checked + label {
  color: #fff;
  background: #1e8ece;
}

.tdDetail {
  text-decoration: underline;
  cursor: pointer;
}

.detailRadio {
  label {
    display: flex;
  }
  input[type="radio"] + label .icon {
    margin: 0;
  }
}

.detailTitle {
  margin-bottom: 25px;
  text-align: center;
  font-size: 1.1em;
  font-weight: 700;
}

.detailTable.normalTable {
  margin-left: auto;
  margin-right: auto;
  width: 70%;
  text-align: center;
}

@media screen and (max-width: 768px) {
  .radioArea {
    width: 100%;
    margin-bottom: 20px;
    padding-top: 5px;
  }
  .tabArea {
    flex-wrap: wrap;
    margin-right: -10px;
    margin-bottom: 0;
    background: none;
    label {
      display: flex;
      flex: 0 0 calc(25% - 10px);
      margin-bottom: 10px;
      margin-right: 10px;
      min-height: 50px;
      align-items: center;
      justify-content: center;
      line-height: 1.2;
    }
  }
  .detailTable.normalTable {
    display: none;
  }
}
</style>
