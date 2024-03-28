//匯率-格式化API取回匯率，小數點後留5位
export const formatRate = (rate) => {
  if (
    typeof rate === "string" ||
    (typeof rate === "number" && rate !== "" && String(rate).length > 7)
  ) {
    if (rate === "" || rate === "-") {
      rate = "0";
    }

    if (String(rate).slice(0, 1) === "-") {
      rate = String(rate).slice(1, String(rate).length);
    }

    if (/^\d+$/.test(rate)) {
      let rate1 = rate.substr(0, rate.length - 5);
      rate1 = rate1.replace(/\b(?:0*(0\.\d+)|0+)/g, "$1");
      if (rate1 === "") {
        rate1 = "0";
      }
      let rate2 = rate.substr(rate.length - 5);
      return rate1 + "." + rate2;
    } else {
      return String(rate);
    }
  } else {
    return String(rate);
  }
};
