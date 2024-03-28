<template>
  <div class="ElSelectComponent">
    <el-select
      v-model="sSelectvalue"
      :id="props.propsId"
      class="normalElSelect"
      :class="props.propsClass"
      :placeholder="props.propsPlaceholder"
      :no-data-text="props.propsNoDataText"
      @change="changeSelect(sSelectvalue)"
      :teleported="false"
      popper-class="normalElSelectPopper"
    >
      <el-option
        value="select"
        disabled
        v-if="props.propsSelectData.length != 0"
        >{{ props.propsPlaceholder }}</el-option
      >
      <el-option
        v-for="item in props.propsSelectData"
        :key="item.value + item.label"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "ElSelectComponent",
};
</script>

<script setup>
import { ref, toRef, watch } from "vue";

const props = defineProps({
  propsSelectData: {
    type: Array,
    default: () => [],
  },
  propsPlaceholder: {
    type: String,
    default: "請選擇",
  },
  propsNoDataText: {
    type: String,
    default: "無資料",
  },
  propsId: {
    type: String,
    default: "",
  },
  propsClass: {
    type: String,
    default: "",
  },
  propsSelected: {
    type: String,
    default: "",
  },
  propsValue: null,
});

const emit = defineEmits(["emitChangeSelectFn"]);

const changeSelect = (selectValue) => {
  emit("emitChangeSelectFn", selectValue);
};

//帶入props.propsSelected，置入select預設值
const sSelectvalue = ref(null);
const sSelected = toRef(props, "propsSelected");
if (props.propsSelected !== "") {
  sSelectvalue.value = sSelected.value;
}

//帶入props.propsValue，由父層改變v-model的值
const sValue = toRef(props, "propsValue");
watch(sValue, (val) => {
  console.log("sValue");
  if (val !== null) {
    sSelectvalue.value = val;
  }
});
</script>

<style lang="scss" scoped>
//props class：props帶進來的class請新增在以下
.ElSelectComponent .normalElSelect.fullwidthSelect {
  max-width: none;
}

.ElSelectComponent .normalElSelect.input_disabled {
  pointer-events: none;
  :deep(.el-input__inner) {
    background: #e7e7e7;
    border-color: #b3b3b3;
  }
  :deep(.el-input__suffix .el-input__suffix-inner::before) {
    display: none;
  }
}

//el-select basic layout
.ElSelectComponent {
  .normalElSelect {
    display: block;
    margin-right: 20px;
    max-width: 700px;
    --el-select-border-color-hover: #1e8ece;
    --el-select-font-size: 16px;
    --el-select-close-hover-color: #1e8ece;
    --el-select-input-color: #1e8ece;
    --el-select-multiple-input-color: #1e8ece;
    --el-select-input-focus-border-color: #1e8ece
    --el-select-input-font-size: 16px;
    :deep(.el-input) {
      --el-input-placeholder-color: #1e8ece;
    }
    :deep(.el-input__inner) {
      font-size: 16px;
      cursor: default;
    }
    :deep(.el-input__suffix .el-input__suffix-inner::before) {
      content: "";
      background: #fff url("~@/assets/images/commonIcon/icon_select_02.png")
        no-repeat scroll right 10px center;
      background-size: 10px auto;
      position: absolute;
      width: 20px;
      height: 14px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    :deep(.el-input__suffix
        .el-input__suffix-inner
        .el-icon) {
      display: none;
    }
    :deep(.el-select__popper.el-popper[role="tooltip"]) {
      border: 1px solid #545050;
    }
    :deep(.el-select-dropdown__wrap) {
      max-height: none;
    }
    :deep(.el-select-dropdown__empty) {
      padding: 0 32px 0 12px;
      text-align-last: left;
    }
    :deep(.el-popper) {
      border-radius: 0;
    }
    :deep(.el-popper.is-pure.is-light.el-select__popper.normalElSelectPopper) {
      top: 50px !important;
      left: 0 !important;
      width: 100%;
      max-height: 400px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    :deep(.el-popper__arrow) {
      display: none;
    }
    :deep(.normalElSelectPopper .el-select-dropdown__item) {
      padding-left: 12px;
      height: 20px;
      line-height: 20px;
      font-size: 16px;
      cursor: default;
      &:hover {
        background-color: #1e90ff;
        color: #fff;
      }
    }
    :deep(.normalElSelectPopper .el-select-dropdown__item.hover) {
      background-color: #1e90ff;
      color: #fff;
    }
    :deep(.el-select-dropdown__item.is-disabled:hover) {
      background-color: #fff;
      color: #c0c4cc;
    }
    :deep(.el-select-dropdown__item.selected) {
      font-weight: normal;
      background-color: #fff;
      color: #606266;
    }
  }
  :deep(.el-select .el-input.is-focus .el-input__inner) {
    border-color: #000 !important;
    border: 2px solid #000 !important;
  }
}

@media screen and (max-width: 768px) {
  .ElSelectComponent .normalElSelect {
    margin-right: 0;
    max-width: 100%;
    :deep(.normalElSelectPopper .el-select-dropdown__item) {
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
