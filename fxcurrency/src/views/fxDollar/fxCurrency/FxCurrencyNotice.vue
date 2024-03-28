<template>
  <!-- 表格 -->
  <div class="inner_mid botM3">
    <!-- 同意條款一 -->
    <div class="inner_mid botM">
      <div class="innerBgArea">
        <div class="scrlTit">
          {{ $t("fxDollar.fxCurrency.consentTitle1") }}
        </div>
        <div
          class="shortRd botM"
          v-html="$t('fxDollar.fxCurrency.consentContent1')"
        ></div>
      </div>
      <div class="chk_Big">
        <input type="checkbox" value="N" id="chkIsSelfUse1" name="isSelfUse1" />
        <label for="chkIsSelfUse1"
          ><span class="icon"></span
          ><span>{{ $t("fxDollar.fxCurrency.consentCheck1") }}</span></label
        >
      </div>
    </div>
    <!-- 同意條款二 -->
    <div class="inner_mid botM">
      <div class="innerBgArea">
        <div class="scrlTit">
          {{ $t("fxDollar.fxCurrency.consentTitle2") }}
        </div>
        <div
          class="shortRd botM"
          v-html="$t('fxDollar.fxCurrency.consentContent2')"
        ></div>
      </div>
      <div class="chk_Big">
        <input type="checkbox" value="N" id="chkIsSelfUse2" name="isSelfUse2" />
        <label for="chkIsSelfUse2"
          ><span class="icon"></span
          ><span>{{ $t("fxDollar.fxCurrency.consentCheck2") }}</span></label
        >
      </div>
    </div>
  </div>
  <!-- 按鈕 -->
  <div class="btn_check">
    <a
      @click.prevent="fnGoNextPage"
      class="order_1 m_color_check"
      href="javascript:void(0)"
      >{{ $t("fxDollar.fxCurrency.agree") }}</a
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
  name: "fxccyApply",
};
</script>

<script setup>
import { ref, computed, onMounted, inject } from "vue";
import ElDialog from "@/components/publicComponents/diolog_popup/SlotElDialogDefault.vue";
import { apiPostFxCheck } from "@/api/axios/fxDollar/fxCurrency.js";
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
const bDialogVisible = ref(false);
const sPopupMessage = ref("");
const sNibUrl = computed(() => {
  return store.getters["publicStore/getNibUrl"];
});
const sAltertranscheckURL = `${sNibUrl.value}/pages/altertranscheck.jsp`;

//步驟0
const updateNStep = inject("updateNStep");
updateNStep(0);

//頁面檢核
const fnInitPage = async () => {
  document.getElementById("chkIsSelfUse1").checked = false;
  document.getElementById("chkIsSelfUse2").checked = false;

  fnShowElLoading();
  (async () => {
    try {
      const response = await apiPostFxCheck();
      console.log("apiPostFxCheck success");
      console.log(response);
      fnHideElLoading();
      if (response.data.status === "A003") {
        location.href = sAltertranscheckURL;
      } else if (response.data.status !== "200") {
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
  fnInitPage();
});

//進入輸入頁前檢核
const fnGoNextPage = () => {
  const domCheckbox1 = document.getElementById("chkIsSelfUse1");
  const domCheckbox2 = document.getElementById("chkIsSelfUse2");

  if (!domCheckbox1.checked) {
    sPopupMessage.value = t("fxDollar.fxCurrency.consentNotice1");
    bDialogVisible.value = true;
  } else if (!domCheckbox2.checked) {
    sPopupMessage.value = t("fxDollar.fxCurrency.consentNotice2");
    bDialogVisible.value = true;
  } else {
    router.push({ name: "fxCurrencyEnter" });
  }
};

//關閉POPUP
const fnCloseDialog = () => {
  bDialogVisible.value = false;
};
</script>

<style lang="scss" scoped>
.shortRd::-webkit-scrollbar {
  width: 6px;
  background-color: transparent;
}

.shortRd::-webkit-scrollbar-track {
  background-color: transparent;
}

.shortRd::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background-color: #1e8ece;
}

.shortRd::-webkit-scrollbar-thumb:hover {
  border-radius: 2px;
  background-color: #0075b8;
}

:deep(.shortRd p) {
  line-height: 1.6em;
}

:deep(ol.numCustom) {
  line-height: 1.6;
}

:deep(ol.numCustom ul li) {
  margin-bottom: 0px;
}

:deep(.rateTB) {
  table {
    width: 100%;
    color: #666;
    border: 0;
    border-top: 1px solid #e5ebf3;
    border-left: 1px solid #e5ebf3;
  }
  th,
  td {
    padding: 18px 0;
    text-align: center;
    border-right: 1px solid #e5ebf3;
    border-bottom: 1px solid #e5ebf3;
  }
  th {
    color: #566374;
    background: #e5ebf3;
  }
  th.bg_blueDark {
    color: #566374;
    background: #d0dae8;
  }
}

@media screen and (max-width: 768px) {
  .shortRd {
    max-height: 300px;
    overflow: hidden;
    overflow-y: scroll;
  }
}
</style>
