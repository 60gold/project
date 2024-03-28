import { fnFormatDate } from "@/common/methodCommon/publicMethod";

/* Date格式化
 * date: 日期，可傳入new Date()或string
 * changeFormat: 要顯示的日期格式，須為string，例如"YYYY/MM/DD"
 * originalFormat: [可空]，若date為string，須填入date的格式，須為string，例如"YYYY-MM-DD"、"MMDD"...等等
 *
 * example1: 若要new Date()顯示為"2022/01/01 15:01:01"
 * 使用方法即為=> <div v-formatDate="{ date: new Date(), changeFormat: 'YYYY/MM/DD HH:mm:ss' }"></div>
 *
 * example2: 若日期字串"2022-1-1"要顯示為"2022/01/01"
 * 使用方法即為=> <div v-formatDate="{ date: '2022-1-1', changeFormat: 'YYYY/MM/DD', originalFormat: 'YYYY-M-D' }"></div>
 */
export function directiveFormatDate(app) {
  app.directive("formatDate", (el, binding) => {
    const sDate = fnFormatDate(
      binding.value.date,
      binding.value.changeFormat,
      binding.value.originalFormat
    );
    el.innerHTML = sDate;
  });
  return {
    app,
  };
}
