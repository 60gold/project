import { apiPostPublicApi } from "@/api/axios/publicAxios/publicAxios.js";
import {
  fnSortFunc,
  fnSortTitle,
} from "@/common/methodCommon/publicMethod/sortFunc.js";
import { fnHideElLoading } from "@/common/methodCommon/publicMethod";
import router from "@/router/index.js";

export default {
  handSetLanguageState({ commit }, payload) {
    commit("setLanguageState", payload);
  },
  handSetWindowWidthState({ commit }, payload) {
    commit("setWindowWidthState", payload);
  },
  handSetHandleScrollBarState({ commit }, payload) {
    commit("setHandleScrollBarState", payload);
  },
  handSetPublicObjState({ commit }, payload) {
    commit("setPublicObjState", payload);
  },
  handSetSideMenuObjState({ commit }, payload) {
    commit("setSideMenuObjState", payload);
  },
  handSetControllTimerResetState({ commit }, payload) {
    commit("setControllTimerResetState", payload);
  },
  handSetFeatureObjState({ commit }, payload) {
    commit("setFeatureObjState", payload);
  },
  handSetAllTitleMapState({ commit }, payload) {
    commit("setAllTitleMapState", payload);
  },
  handSetErrorMessageState({ commit }, payload) {
    commit("setErrorMessageState", payload);
  },
  handSetNibUrlState({ commit }, payload) {
    commit("setNibUrlState", payload);
  },
  handSetJspSearchContentState({ commit }, payload) {
    commit("setJspSearchContentState", payload);
  },
  handSetFoBtnClickState({ commit }, payload) {
    commit("setFoBtnClickState", payload);
  },
  handSetShowHeaderFooterState({ commit }, payload) {
    commit("setShowHeaderFooterState", payload);
  },
  handSetAcrossPagesState({ commit }, payload) {
    commit("setAcrossPagesState", payload);
  },
  handSetAcrossPagesNameState({ commit }, payload) {
    commit("setAcrossPagesNameState", payload);
  },
  //共用api
  async publicApi({ commit }) {
    try {
      console.log(router.options.routes);
      const res = await apiPostPublicApi();
      const aNoExistFunc = [];
      //先判斷後端回傳的功能列表是否有在Vue router裡
      for (let foKey in res.data.featureOverview) {
        if (res.data.featureOverview[foKey].isVue) {
          let funcExist = false;
          for (let routerVal of router.options.routes) {
            if (
              routerVal.name &&
              res.data.featureOverview[foKey].routerName === routerVal.name
            ) {
              console.log(routerVal.name);
              funcExist = true;
            } else if (routerVal.children) {
              for (let childVal of routerVal.children) {
                if (
                  childVal.name === res.data.featureOverview[foKey].routerName
                ) {
                  funcExist = true;
                }
              }
            }
          }
          //如果只有db有功能資料但Vue router沒有則把此功能移除
          if (!funcExist) {
            aNoExistFunc.push(foKey);
          }
          funcExist = false;
        }
      }
      for (let removeKey of aNoExistFunc) {
        res.data.featureOverview.splice(removeKey, 1, "");
      }
      console.log(res.data);
      commit("setPublicObjState", res.data);
      if (res.data.searchContent) {
        commit("setJspSearchContentState", res.data.searchContent);
      }
      const oSideMenuObj = fnSortFunc(res.data.featureOverview);
      //如果回傳功能有 4:基金/信託
      if (oSideMenuObj.classify4) {
        //總覽頁的 4:基金/信託 要排序最後一項
        let { classify4, ...oFeatureObj } = oSideMenuObj;
        oFeatureObj.classify4 = classify4;
        commit("setFeatureObjState", oFeatureObj);
      } else {
        commit("setFeatureObjState", oSideMenuObj);
      }
      commit("setSideMenuObjState", oSideMenuObj);
      commit("setAllTitleMapState", fnSortTitle(res.data.featureOverview));
      commit("setLanguageState", res.data.userinfo.language);
      return res.data;
    } catch (err) {
      console.error(`publicApi error:${err}`);
      fnHideElLoading();
      commit("setErrorMessageState", {
        zh_tw: "狀態不明請稍後再試",
        en: "State Error",
      });
      router.push({ name: "errorDefalutPage" });
    }
  },
};
