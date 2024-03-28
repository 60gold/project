import { oBaseUrl } from "./config.js";
import axios from "axios";
import store from "@/store/index.js";
import { fnHideElLoading } from "@/common/methodCommon/publicMethod";

const nibRequset = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? oBaseUrl.nibBaseUrl.PROD
      : oBaseUrl.nibBaseUrl.DEV,
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
});

// 攔截 API request 的請求
nibRequset.interceptors.request.use(
  (request) => {
    // API送出前可以做最後的處理
    return request;
  },
  (error) => {
    // 如果送出前失敗了，這邊就可以做一些處理
    return Promise.reject(error);
  }
);

// 攔截 API response 的回傳
nibRequset.interceptors.response.use(
  (response) => {
    // 這邊可以對回來的資料先進行驗證處理，再來決定要不要把資料給吐出去
    return response;
  },
  (error) => {
    // 這邊當API發生錯誤的時候就可以處理 Error handling
    fnHideElLoading();
    store.dispatch("publicStore/handSetErrorMessageState", {
      zh_tw: "交易不明，若為帳務性交易，請洽服務人員，勿重複操作！",
      en: "交易不明，若為帳務性交易，請洽服務人員，勿重複操作！",
    });
    return Promise.reject(error);
  }
);

export default nibRequset;
