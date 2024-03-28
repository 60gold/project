<template>
  <div class="ElDialogComponent">
    <el-dialog
      v-model="bDialogVisible"
      :custom-class="props.propsCustomClass"
      :lock-scroll="props.propsLockScroll"
      :close-on-click-modal="props.propsCloseOnClickModal"
      :close-on-press-escape="props.propsCloseOnPressEscape"
      :show-close="props.propsShowClose"
      :width="props.propsWidth"
      @close="fnCloseDialog"
    >
      <slot name="body"></slot>
      <slot name="footer"></slot>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SlotElDialogDefault",
};
</script>

<script setup>
const props = defineProps({
  propsLockScroll: {
    type: Boolean,
    default: true,
  },
  propsShowClose: {
    type: Boolean,
    default: false,
  },
  propsCloseOnPressEscape: {
    type: Boolean,
    default: false,
  },
  propsCloseOnClickModal: {
    type: Boolean,
    default: false,
  },
  propsWidth: {
    type: String,
    default: "",
  },
  propsCustomClass: {
    type: String,
    default: "popup_area",
  },
  propsDialogVisible: {
    type: Boolean,
    default: false,
  },
});

import { ref, watch } from "vue";

const bDialogVisible = ref(false);
// 實踐 props 傳值給 v-model 使用
watch(
  () => props.propsDialogVisible,
  (val) => {
    bDialogVisible.value = val;
  }
);

//show-close=true情況，需在父元件做close事件，同步v-model顯示設定
const emit = defineEmits(["emitCloseDialogFn"]);
const fnCloseDialog = () => {
  emit("emitCloseDialogFn", false);
};
</script>

<style lang="scss" scoped>
.ElDialogComponent {
  //el-dialog basic layout
  :deep(.el-dialog) {
    max-height: calc(100vh - 180px);
  }
  :deep(.el-dialog__header) {
    display: none;
  }
  :deep(.el-dialog__body) {
    padding: 0;
    max-height: calc(100vh - 260px);
    overflow-y: scroll;
    font-size: 16px;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  :deep(.el-dialog__headerbtn) {
    top: 0px;
    background: url("~@/assets/images/commonIcon/icon_close_01.png");
    background-size: cover;
    background-size: 20px;
    background-repeat: no-repeat;
    background-position: center;
  }
  :deep(.el-dialog__headerbtn i) {
    display: none;
  }

  //props class
  :deep(.popup_showMessage) {
    position: relative;
    width: 990px;
    max-width: calc(100% - 40px);
    margin: 120px auto 60px;
    padding: 40px;
    background: #fff;
    z-index: 1001;
    border-radius: 15px;
    .popup_text {
      padding: 60px 0 80px;
      text-align: center;
      font-size: 20px;
    }
  }
}
</style>
