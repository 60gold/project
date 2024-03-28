<template>
  <!--表格-->
  <table class="formTable botM2" width="100%">
    <tr>
      <th width="180">{{ $t("fxDollar.fxCurrencyQuery.thRefNo") }}</th>
      <td>{{ aCurrencyData[0].RefNo }}</td>
    </tr>
    <tr>
      <th>{{ $t("fxDollar.fxCurrencyQuery.thCcy") }}</th>
      <td>{{ aCurrencyData[0].CCY }}</td>
    </tr>
    <tr>
      <th>{{ $t("fxDollar.fxCurrencyQuery.thAmt") }}</th>
      <td v-formatPriceSub00="aCurrencyData[0].TxAmt"></td>
    </tr>
    <tr>
      <th>{{ $t("fxDollar.fxCurrencyQuery.thCurrencyDetail") }}</th>
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
            :class="list.Denomination !== '0000000' ? 'showDetail' : ''"
            v-show="list.Denomination !== '0000000'"
          >
            <td v-formatPriceRemove0="list.Denomination"></td>
            <td v-formatPriceRemove0="list.Sheet"></td>
            <td class="color_orange" v-formatPrice="list.Total"></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <th>{{ $t("fxDollar.fxCurrencyQuery.thBranch") }}</th>
      <td>{{ aCurrencyData[0].BranchDisplay }}</td>
    </tr>
    <tr>
      <th>
        <span class="mustfill">*</span
        >{{ $t("fxDollar.fxCurrencyQuery.thTakeDate") }}
      </th>
      <td>
        <div class="color_red tB p_bot_10">
          {{ $t("fxDollar.fxCurrencyQuery.txChangeNotice") }}
        </div>
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
              @change="fnSelReserveDateChange"
            >
            </el-date-picker>
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
      >{{ $t("fxDollar.fxCurrencyQuery.btnReturnPage") }}</a
    >
    <a
      class="order_1 m_color_back"
      href="javascript:void(0)"
      @click.prevent="fnGoNextPage"
      >{{ $t("fxDollar.fxCurrencyQuery.btnSureEnter") }}</a
    >
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
  name: "FxCurrencyQueryEnter",
};
</script>

<script setup>
import { ref, reactive, onMounted, inject } from "vue";
import ElDialog from "@/components/publicComponents/diolog_popup/SlotElDialogDefault.vue";
import { fnFormatDate } from "@/common/methodCommon/publicMethod";
import { apiPostFxGetDate } from "@/api/axios/fxDollar/fxCurrencyQuery.js";
import {
  fnShowElLoading,
  fnHideElLoading,
} from "@/common/methodCommon/publicMethod";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const store = useStore();
const router = useRouter();
const { t } = useI18n();

//取得輸入頁資料
const aCurrencyData = inject("getCurrencyData");
console.log("aCurrencyData------------------------------");
console.log(aCurrencyData);

//檢核交易時間 & 查詢 取鈔日
const fnApiGetDate = async () => {
  fnShowElLoading();

  (async () => {
    try {
      const response = await apiPostFxGetDate();
      console.log("apiPostFxGetDate success");
      console.log(response);
      fnHideElLoading();
      fnApiPostFxGetDateOnSuccess(response);
    } catch (error) {
      console.log("apiPostFxGetDate error message => " + error);
      store.dispatch("publicStore/handSetErrorMessageState", {
        zh_tw: "交易不明，若為帳務性交易，請洽服務人員，勿重複操作!",
        en: "Unidentified transaction, if the transaction is for accounting purposes, please contact our customer service and do not repeat the transaction!",
      });
      router.push({ name: "errorDefalutPage" });
    }
  })();
};
onMounted(() => {
  fnApiGetDate();
});

const sReserveDate = ref(""); //預約領取日
const aOrderDates = reactive([]); //可選擇的預約領取日
let aStartDate = ""; //預約領取日-起日
let aEndDate = ""; //預約領取日-迄日

const fnApiPostFxGetDateOnSuccess = (response) => {
  if (response.data.status === "200") {
    const data = response.data.rsData;
    if (data && data.length !== 0) {
      Array.prototype.push.apply(aOrderDates, data);
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
      fnSetCurrencyDetail();
    } else {
      store.dispatch("publicStore/handSetErrorMessageState", {
        zh_tw: "交易不明，若為帳務性交易，請洽服務人員，勿重複操作!",
        en: "Unidentified transaction, if the transaction is for accounting purposes, please contact our customer service and do not repeat the transaction!",
      });
      router.push({ name: "errorDefalutPage" });
    }
  } else if (response.data.status === "500") {
    store.dispatch("publicStore/handSetErrorMessageState", {
      zh_tw: response.data.errMsg,
      en: response.data.errMsg,
    });
    router.push({ name: "errorDefalutPage" });
  }
};

//置入指定現鈔明細
const aCurrencyDetail = reactive([]);
const fnSetCurrencyDetail = () => {
  let obj = [
    {
      Denomination: aCurrencyData[0].Denomination1,
      Sheet: aCurrencyData[0].Sheet1,
      Total: (
        +aCurrencyData[0].Denomination1 * +aCurrencyData[0].Sheet1
      ).toString(),
    },
    {
      Denomination: aCurrencyData[0].Denomination2,
      Sheet: aCurrencyData[0].Sheet2,
      Total: (
        +aCurrencyData[0].Denomination2 * +aCurrencyData[0].Sheet2
      ).toString(),
    },
    {
      Denomination: aCurrencyData[0].Denomination3,
      Sheet: aCurrencyData[0].Sheet3,
      Total: (
        +aCurrencyData[0].Denomination3 * +aCurrencyData[0].Sheet3
      ).toString(),
    },
    {
      Denomination: aCurrencyData[0].Denomination4,
      Sheet: aCurrencyData[0].Sheet4,
      Total: (
        +aCurrencyData[0].Denomination4 * +aCurrencyData[0].Sheet4
      ).toString(),
    },
    {
      Denomination: aCurrencyData[0].Denomination5,
      Sheet: aCurrencyData[0].Sheet5,
      Total: (
        +aCurrencyData[0].Denomination5 * +aCurrencyData[0].Sheet5
      ).toString(),
    },
    {
      Denomination: aCurrencyData[0].Denomination6,
      Sheet: aCurrencyData[0].Sheet6,
      Total: (
        +aCurrencyData[0].Denomination6 * +aCurrencyData[0].Sheet6
      ).toString(),
    },
  ];
  Array.prototype.push.apply(aCurrencyDetail, obj);
};

//預約領取日
const disabledDate = (time) => {
  const newStartDate = new Date(aStartDate + "T00:00:00");
  const newEndDate = new Date(aEndDate + "T00:00:00");

  return (
    time.getTime() < newStartDate.getTime() ||
    time.getTime() > newEndDate.getTime()
  );
};

const fnSelReserveDateChange = () => {
  console.log("預約領取日: " + sReserveDate.value);
};

//回上一頁
const fnReturnPage = () => {
  router.push({ name: "fxccyQuery" });
};

//確認送出
const setCurrencyData = inject("setCurrencyData");
const fnGoNextPage = () => {
  const aSelectDate = sReserveDate.value.split("/");
  const dSelectDate = new Date(
    aSelectDate[0] + "-" + aSelectDate[1] + "-" + aSelectDate[2] + "T00:00:00"
  );
  const dStartDate = new Date(aStartDate + "T00:00:00");
  const dEndDate = new Date(aEndDate + "T00:00:00");

  if (+dSelectDate < +dStartDate) {
    sPopupMessage.value = t("fxDollar.fxCurrencyQuery.alertDateLess");
    bDialogVisible.value = true;
  } else if (+dSelectDate > +dEndDate) {
    sPopupMessage.value = t("fxDollar.fxCurrencyQuery.alertDateMore");
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
    sPopupMessage.value = t("fxDollar.fxCurrencyQuery.alertDateNot");
    bDialogVisible.value = true;
  } else {
    let obj = aCurrencyData[0];
    obj.NewTakeDate = fnFormatDate(
      sReserveDate.value,
      "YYYYMMDD",
      "YYYY/MM/DD"
    );
    //inject到爸爸
    setCurrencyData(obj);
    router.push({ name: "fxCurrencyQueryConfirm" });
  }
};

//關閉POPUP
const bDialogVisible = ref(false);
const sPopupMessage = ref("");
const fnCloseDialog = () => {
  bDialogVisible.value = false;
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

.formTable {
  :deep(.el-input.el-input--default.el-date-editor) {
    width: 80%;
  }
}

.p_bot_10 {
  padding-bottom: 10px;
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
  }
  .formTable {
    :deep(.el-input.el-input--default.el-date-editor) {
      width: 100%;
    }
  }
}
</style>
