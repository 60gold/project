import { directiveFocus } from "./focus.js";
import { directiveFormatDate } from "./formatDate";
import { directiveFormatPrice } from "./formatPrice.js";
import { directiveFormatPriceFx } from "./formatPrice.js";
import { directiveFormatHasdotPrice } from "./formatPrice.js";
import { directiveFormatPriceSub00 } from "./formatPrice.js";
import { directiveFormatPriceRemove0 } from "./formatPrice.js";
import { directiveFormatRate } from "./formatRate.js";
import { directiveSecretName } from "./secretName.js";
import { directiveReplaceSpanHtml } from "./replaceSpanHtml";

export function fnToDoDirective(app) {
  directiveFocus(app); //v-focus
  directiveFormatDate(app); //v-formatDate
  directiveFormatPrice(app); //v-formatPrice
  directiveFormatPriceFx(app); //v-formatPriceFx
  directiveFormatHasdotPrice(app); //v-formatHasdotPrice
  directiveFormatPriceSub00(app); //v-formatPriceSub00
  directiveFormatPriceRemove0(app); //v-formatPriceRemove0
  directiveFormatRate(app); //v-formatRate
  directiveSecretName(app); //v-secretName
  directiveReplaceSpanHtml(app); //v-replaceSpanHtml
  return {
    app,
  };
}
