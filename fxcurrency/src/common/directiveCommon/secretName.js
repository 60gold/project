//中文姓名隱碼：將姓名第二個字換成○符號
import { fnSecretName } from "@/common/methodCommon/publicMethod";

export function directiveSecretName(app) {
  app.directive("secretName", (el, binding) => {
    const sName = fnSecretName(binding.value);
    el.innerHTML = sName;
  });
  return {
    app,
  };
}
