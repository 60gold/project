import { fnFormatRate } from "@/common/methodCommon/publicMethod";

//匯率-格式化API取回匯率，小數點後留5位
export function directiveFormatRate(app) {
  app.directive("formatRate", (el, binding) => {
    const sNum = fnFormatRate(binding.value);
    el.innerHTML = sNum;
  });
  return {
    app,
  };
}
