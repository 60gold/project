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
      <th>{{ $t("fxDollar.fxCurrencyQuery.thTakeDate") }}</th>
      <td>
        <span
          v-formatDate="{
            date: aCurrencyData[0].TakeDate,
            changeFormat: 'YYYY/MM/DD',
            originalFormat: 'YYYYMMDD',
          }"
        ></span>
        <div class="arrow"></div>
        <span
          class="color_blue"
          v-formatDate="{
            date: aCurrencyData[0].NewTakeDate,
            changeFormat: 'YYYY/MM/DD',
            originalFormat: 'YYYYMMDD',
          }"
        ></span>
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
</template>

<script>
export default {
  name: "FxCurrencyQueryConfirm",
};
</script>

<script setup>
import { reactive, onMounted, inject } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import {
  apiPostFxChange, //修改 領鈔日
} from "@/api/axios/fxDollar/fxCurrencyQuery.js";
import {
  fnShowElLoading,
  fnHideElLoading,
} from "@/common/methodCommon/publicMethod";
import qs from "qs";

const store = useStore();
const router = useRouter();

//取得輸入頁資料
const aCurrencyData = inject("getCurrencyData");
console.log("aCurrencyData------------------------------");
console.log(aCurrencyData);

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
onMounted(() => {
  fnSetCurrencyDetail();
});

//回上一頁
const fnReturnPage = () => {
  router.push({ name: "fxCurrencyQueryEnter" });
};

//確認送出
const setCurrencyData = inject("setCurrencyData");
const fnGoNextPage = async () => {
  fnShowElLoading();

  const request = {
    RefNo: aCurrencyData[0].RefNo,
    NewTakeDate: aCurrencyData[0].NewTakeDate,
  };

  (async () => {
    try {
      const response = await apiPostFxChange(qs.stringify(request));
      console.log("apiPostFxChange success");
      console.log(response);
      fnHideElLoading();
      const obj = response.data;
      //inject到爸爸
      setCurrencyData(obj);
      router.push({ name: "fxCurrencyQueryResult" });
    } catch (error) {
      console.log("apiPostFxChange error message => " + error);
      store.dispatch("publicStore/handSetErrorMessageState", {
        zh_tw: "交易不明，若為帳務性交易，請洽服務人員，勿重複操作!",
        en: "Unidentified transaction, if the transaction is for accounting purposes, please contact our customer service and do not repeat the transaction!",
      });
      router.push({ name: "errorDefalutPage" });
    }
  })();
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

.arrow {
  display: inline-block;
  width: 16.5px;
  height: 11.5px;
  margin: 0 5px;
  background: url("~@/assets/images/commonIcon/icon_arrow.png") no-repeat;
  background-size: cover;
  filter: brightness(0);
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
}
</style>
