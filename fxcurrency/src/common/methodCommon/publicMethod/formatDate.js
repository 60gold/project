import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
dayjs.extend(customParseFormat);

/* Date格式化
 * date: 日期，可傳入new Date()或string
 * changeFormat: 要顯示的日期格式，須為string，例如"YYYY/MM/DD"
 * originalFormat: [可空]，若date為string，須填入date的格式，須為string，例如"YYYY-MM-DD"、"MMDD"...等等
 *
 * example1: 若要new Date()顯示為"2022/01/01 15:01:01"
 * 使用方法即為=> fnFormatDate(new Date(), "YYYY/MM/DD HH:mm:ss");
 *
 * example2: 若日期字串"2022-1-1"要顯示為"2022/01/01"
 * 使用方法即為=> fnFormatDate("2022-1-1", "YYYY/MM/DD", "YYYY-M-D");
 */
export const formatDate = (date, changeFormat, originalFormat) => {
  try {
    if (originalFormat) {
      if (typeof originalFormat === "string" && originalFormat !== "") {
        if (
          typeof date === "string" &&
          date !== "" &&
          typeof changeFormat === "string" &&
          changeFormat !== ""
        ) {
          let myFormatDate = dayjs(date, originalFormat, true);
          return myFormatDate.format(changeFormat);
        } else {
          return "";
        }
      } else {
        return "";
      }
    } else if (date) {
      if (
        Object.prototype.toString.call(date) === "[object Date]" &&
        !isNaN(date)
      ) {
        if (typeof changeFormat === "string" && changeFormat !== "") {
          let myFormatDate = dayjs(date);
          return myFormatDate.format(changeFormat);
        } else {
          return "";
        }
      } else {
        return "";
      }
    } else {
      return "";
    }
  } catch (e) {
    return "";
  }
};

/* day.js常見日期格式縮寫索引
 * YYYY : 2022
 * M    : 1-12
 * MM   : 01-12
 * MMM  : Jan-Dec
 * D    : 1-31
 * DD   : 01-31
 * H    : 0-23
 * HH   : 00-23
 * h    : 1-12
 * hh   : 01-12
 * m    : 0-59
 * mm   : 00-59
 * s    : 0-59
 * ss   : 00-59
 * S    : 0-9
 * SS   : 00-99
 * SSS  : 000-999
 * A    : AM PM
 * a    : am pm
 */
