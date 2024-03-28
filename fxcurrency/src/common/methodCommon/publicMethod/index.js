import { formatDate } from "./formatDate";
import { formatPrice } from "./formatPrice.js";
import { formatPriceFx } from "./formatPrice.js";
import { formatHasdotPrice } from "./formatPrice.js";
import { formatPriceSub00 } from "./formatPrice.js";
import { formatPriceRemove0 } from "./formatPrice.js";
import { formatPriceFormatNum } from "./formatPrice.js";
import { formatRate } from "./formatRate.js";
import { secretName } from "./secretName.js";
import { showElLoading, hideElLoading } from "./elGlobalMethod.js";
import { replaceSpanHtml } from "./replaceSpanHtml.js";

export const fnFormatDate = formatDate; //日期格式化
export const fnFormatPrice = formatPrice; //台幣金額格式化：將金額加上千分位逗號
export const fnFormatPriceFx = formatPriceFx; //外幣金額格式化：將金額加上千分位逗號，及小數點後兩位
export const fnFormatHasdotPrice = formatHasdotPrice; // 處理小數點數值四捨五入前面加上千分號，dotnum控制小數點第幾位，無小數點指加上千分號
export const fnFormatPriceSub00 = formatPriceSub00; //電文回2位小數，去掉後面的00再做將金額加上千分位逗號
export const fnFormatPriceRemove0 = formatPriceRemove0; //去掉電文數字前面所有的0
export const fnFormatPriceFormatNum = formatPriceFormatNum; //電文顯示至小數點第四位(第五位四捨五入進到第四位)，如小數點後值有0僅顯示至有值部分
export const fnFormatRate = formatRate; //匯率格式化：API取回匯率，小數點後留5位
export const fnSecretName = secretName; //中文姓名隱碼：將姓名第二個字換成○符號
export const fnReplaceSpanHtml = replaceSpanHtml; //如果字串中有span標籤將其用空白取代
//elGlobalMethod
export const fnShowElLoading = showElLoading; //顯示全局loading
export const fnHideElLoading = hideElLoading; //關閉全局loading
