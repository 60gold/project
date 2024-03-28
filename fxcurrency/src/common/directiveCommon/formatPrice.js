import {
  fnFormatPrice,
  fnFormatPriceFx,
  fnFormatHasdotPrice,
  fnFormatPriceSub00,
  fnFormatPriceRemove0,
} from "@/common/methodCommon/publicMethod";

//台幣-將金額加上千分位逗號
export function directiveFormatPrice(app) {
  app.directive("formatPrice", (el, binding) => {
    const sNum = fnFormatPrice(binding.value);
    el.innerHTML = sNum;
  });
  return {
    app,
  };
}

//外幣-將金額加上千分位逗號，及小數點後兩位
export function directiveFormatPriceFx(app) {
  app.directive("formatPriceFx", (el, binding) => {
    const sNum = fnFormatPriceFx(binding.value);
    el.innerHTML = sNum;
  });
  return {
    app,
  };
}

// 處理小數點數值四捨五入前面加上千分號，dotnum控制小數點第幾位，無小數點指加上千分號
export function directiveFormatHasdotPrice(app) {
  app.directive("formatHasdotPrice", (el, binding) => {
    const sNum = fnFormatHasdotPrice(binding.value);
    el.innerHTML = sNum;
  });
  return {
    app,
  };
}

//電文回2位小數，去掉後面的00再做將金額加上千分位逗號
export function directiveFormatPriceSub00(app) {
  app.directive("formatPriceSub00", (el, binding) => {
    const sNum = fnFormatPriceSub00(binding.value);
    el.innerHTML = sNum;
  });
  return {
    app,
  };
}

//去掉電文數字前面所有的0
export function directiveFormatPriceRemove0(app) {
  app.directive("formatPriceRemove0", (el, binding) => {
    const sNum = fnFormatPriceRemove0(binding.value);
    el.innerHTML = sNum;
  });
  return {
    app,
  };
}
