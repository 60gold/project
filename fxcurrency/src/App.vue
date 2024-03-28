<template>
  <!-- 導回jsp須提交此表單 -->
  <form
    name="mform"
    id="mform"
    method="POST"
    action=""
    onSubmit="return false;"
    ondblclick="return false;"
  >
    <input type="hidden" name="menutype" id="menutype" value="" />
    <input type="hidden" name="iconid" id="iconid" value="" />
    <input type="hidden" name="title" id="title" value="" />
  </form>
  <el-config-provider :locale="localeElement">
    <div class="allContainer" :style="{ overflow: sHandleScroll }" v-loading>
      <HeaderComponent
        v-if="route.params.showHeaderFooter === 'false' ? false : true"
      />
      <div class="containerInner" :style="{ 'min-height': nContainerH + 'px' }">
        <div class="inner">
          <HeaderContainerComponent
            v-if="route.params.showHeaderFooter === 'false' ? false : true"
          />
          <router-view />
        </div>
      </div>
      <FooterComponent
        v-if="route.params.showHeaderFooter === 'false' ? false : true"
      />
    </div>
  </el-config-provider>
</template>

<script>
export default {
  name: "App",
};
</script>

<script setup>
import HeaderComponent from "./components/publicComponents/header/HeaderComponent.vue";
import FooterComponent from "./components/publicComponents/footer/FooterComponent.vue";
import HeaderContainerComponent from "./components/publicComponents/header/HeaderContainerComponent.vue";

import { ref, computed, watch, onMounted, nextTick } from "vue";
import zhTwElement from "element-plus/lib/locale/lang/zh-tw";
import enElement from "element-plus/lib/locale/lang/en";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import router from "./router";

const store = useStore();
const route = useRoute();
const localeElement = ref(zhTwElement);
const sLanguage = computed(() => {
  return store.getters["publicStore/getLanguage"];
});
const sHandleScroll = computed(() => {
  return store.getters["publicStore/getHandleScrollBar"];
});

const fnChangeLanguage = () => {
  if (sLanguage.value === "en") {
    localeElement.value = enElement;
  } else if (sLanguage.value === "zh_tw") {
    localeElement.value = zhTwElement;
  }
};

watch(
  () => sLanguage.value,
  () => {
    fnChangeLanguage();
  }
);
const nContainerH = ref();
//計算containerInner最小高度
const fnComputeMinHeight = () => {
  let nWindowHeight = window.innerHeight;
  let nWindowWidth = window.innerWidth;
  store.dispatch("publicStore/handSetWindowWidthState", window.innerWidth);
  let domFooter = document.querySelector("footer");
  let nFooterH = domFooter.clientHeight;
  let domHeader = document.querySelector("header");
  let nHeaderH = domHeader.clientHeight;
  if (nWindowWidth > 768) {
    nContainerH.value = nWindowHeight - nFooterH - nHeaderH;
  }
  console.log(nContainerH.value);
  window.onresize = () => {
    nWindowHeight = window.innerHeight;
    nWindowWidth = window.innerWidth;
    store.dispatch("publicStore/handSetWindowWidthState", window.innerWidth);
    nFooterH = domFooter.clientHeight;
    nHeaderH = domHeader.clientHeight;
    if (nWindowWidth > 768) {
      nContainerH.value = nWindowHeight - nFooterH - nHeaderH;
    } else {
      nContainerH.value = nWindowHeight - nFooterH - nHeaderH + 35;
    }
  };
};

// 鎖滑鼠右鍵 & 鍵盤觸發 browser 行為
const fnLockEvents = () => {
  // 滑鼠右鍵
  document.oncontextmenu = () => {
    return false;
  };

  // 鍵盤觸發 browser 行為
  document.body.onkeydown = (e) => {
    let keyCode = e.keyCode;
    //F3 搜尋
    if (keyCode == 114) {
      keyCode = 0;
      return false;
    }
    //F5 重整
    if (keyCode == 116) {
      keyCode = 0;
      return false;
    }
    //F6 browser tab
    if (keyCode == 117) {
      keyCode = 0;
      return false;
    }
    //F11 全螢幕
    if (keyCode == 122) {
      keyCode = 0;
      return false;
    }
    //ctrl + r
    if (e.ctrlKey && keyCode == 82) {
      return false;
    }
  };
};

watch(
  () => route.name,
  (routeVal, oldRouteVal) => {
    const sAcrossPagesName = computed(() => {
      return store.getters["publicStore/getAcrossPagesName"];
    });
    if (oldRouteVal === sAcrossPagesName.value) {
      store.dispatch("publicStore/handSetShowHeaderFooterState", true);
    }
  }
);

onMounted(() => {
  nextTick(() => {
    fnComputeMinHeight();
  });
  fnLockEvents();

  //另開新分頁，接收routerName並導頁
  window.addEventListener("message", (e) => {
    if (e.origin !== window.location.origin) return;
    if (e.data.acrossPages) {
      store.dispatch("publicStore/handSetAcrossPagesState", true);
      store.dispatch(
        "publicStore/handSetAcrossPagesNameState",
        e.data.routerName
      );
      if (!e.data.showHeaderFooter) {
        store.dispatch("publicStore/handSetShowHeaderFooterState", false);
        router.push({
          name: e.data.routerName,
          params: { showHeaderFooter: "false" },
        });
      } else {
        router.push({ name: e.data.routerName });
      }
      console.log("router go page: " + e.data.routerName);
    }
  });
});
</script>

<style lang="scss">
.inner {
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  max-width: 1440px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.containerInner {
  padding: 20px 0 85px;
}
.allContainer {
  height: 100vh;
}
// 全局el loading設定
.el-loading-mask.is-fullscreen {
  .el-loading-spinner {
    background: url("~@/assets/images/gif/loading.gif");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 80px 80px;
    height: 100%;
    width: 100%;
    top: 0;
    .circular {
      display: none;
    }
    .el-loading-text {
      margin: 100px 0;
    }
  }
}

@media screen and (max-width: 1280px) {
  .inner {
    max-width: 100%;
    padding: 0 20px;
  }
}
@media screen and (max-width: 768px) {
  .containerInner {
    padding: 70px 15px 20px;
    min-height: calc(100vh - 120px);
  }
  .inner {
    padding: 0;
    max-width: 100%;
  }
}
</style>
