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
          <th width="180">{{ $t("fxDollar.fxCurrencyQuery.thRefNo") }}</th>
          <td>{{ aCurrencyData[0].rsData.RefNo }}</td>
        </tr>
        <tr>
          <th>{{ $t("fxDollar.fxCurrencyQuery.thCcy") }}</th>
          <td>{{ aCurrencyData[0].rsData.CCY }}</td>
        </tr>
        <tr>
          <th>{{ $t("fxDollar.fxCurrencyQuery.thAmt") }}</th>
          <td v-formatPriceSub00="aCurrencyData[0].rsData.TxAmt"></td>
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
          <td>{{ aCurrencyData[0].rsData.BranchDisplay }}</td>
        </tr>
        <tr>
          <th class="th_button">
            {{ $t("fxDollar.fxCurrencyQuery.thTakeDate") }}
            <div class="btn_bluelight m_block">
              <a href="javascript:void(0)" @click.prevent="fnBranchInfo">{{
                $t("fxDollar.fxCurrencyQuery.btBranchInfo")
              }}</a>
            </div>
          </th>
          <td class="td_button">
            <div class="dateArea">
              <span
                v-formatDate="{
                  date: aCurrencyData[0].rsData.OldTakeDate,
                  changeFormat: 'YYYY/MM/DD',
                  originalFormat: 'YYYYMMDD',
                }"
              ></span>
              <div class="arrow"></div>
              <span
                class="color_blue"
                v-formatDate="{
                  date: aCurrencyData[0].rsData.NewTakeDate,
                  changeFormat: 'YYYY/MM/DD',
                  originalFormat: 'YYYYMMDD',
                }"
              ></span>
            </div>
            <div class="btn_bluelight m_hide">
              <a href="javascript:void(0)" @click.prevent="fnBranchInfo">{{
                $t("fxDollar.fxCurrencyQuery.btBranchInfo")
              }}</a>
            </div>
          </td>
        </tr>
      </table>
    </div>
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
          <td class="color_orange">
            {{ aCurrencyData[0].rsData.TransMsg }} ({{
              aCurrencyData[0].rsData.TransResult
            }})
          </td>
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
        <td class="color_orange">{{ aCurrencyData[0].rsData.TransMsg }}</td>
      </tr>
    </table>
  </div>
  <!--按鈕-->
  <div class="btn_check botM3">
    <a
      class="order_1 color_menu"
      href="javascript:void(0)"
      @click.prevent="router.push({ name: 'fxccyQuery' })"
      >{{ $t("fxDollar.fxCurrencyQuery.btnHomePage") }}
    </a>
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
  name: "FxCurrencyQueryResult",
};
</script>

<script setup>
import { ref, reactive, onMounted, inject } from "vue";
import ElDialog from "@/components/publicComponents/diolog_popup/SlotElDialogDefault.vue";
import SlotNote from "@/components/publicComponents/other/SlotNote.vue";
import QRCode from "qrcode";
import { useRouter } from "vue-router";

const router = useRouter();

//取得輸入頁資料
const aCurrencyData = inject("getCurrencyData");
console.log("aCurrencyData------------------------------");
console.log(aCurrencyData);

const aCurrencyDetail = reactive([]); //置入指定現鈔明細
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
