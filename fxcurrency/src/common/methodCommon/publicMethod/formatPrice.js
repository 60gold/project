//台幣-將金額加上千分位逗號
export const formatPrice = (price) => {
  if (
    typeof price === "string" ||
    (typeof price === "number" && price !== "")
  ) {
    let str = price.toString();
    price = str.replace(/\b(?:0*(0\.\d+)|0+)/g, "$1");

    if (price === "" || price === "-") {
      price = "0";
    }

    if (price.indexOf(".") !== -1) {
      let arr = price.split(".");
      price = arr[0];
    }

    if (String(price).slice(0, 1) === "-") {
      price = String(price).slice(1, String(price).length);
      if (/^\d+$/.test(price)) {
        return "-" + price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        return "";
      }
    } else if (/^\d+$/.test(price)) {
      return String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return "";
    }
  } else {
    return "";
  }
};

//外幣-將金額加上千分位逗號，及小數點後兩位
export const formatPriceFx = (price, dotnum = 2) => {
  if (
    typeof price === "string" ||
    (typeof price === "number" && price !== "" && String(price).length > 2)
  ) {
    // let str = price.toString();
    // price = str.replace(/\b(?:0*(0\.\d+)|0+)/g, "$1");
    // if (price === "" || price === "-") {
    //   price = "0";
    // }
    price = priceProcesser(price);

    let hasDot = true;
    if (price.indexOf(".") === -1) {
      hasDot = false;
    }

    let price1 = "";
    let price2 = "";

    if (hasDot) {
      //本來price就有小數點
      // let arr = price.split(".");
      // price1 = arr[0];
      // price2 = String(Number("0." + arr[1]).toFixed(dotnum)).substring(2);
      // console.log(`price2:${price2}`);
      // if (String(price1).slice(0, 1) === "-") {
      //   price1 = String(price1).slice(1, String(price1).length);
      //   if (/^\d+$/.test(price1)) {
      //     return (
      //       "-" + price1.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + price2
      //     );
      //   } else {
      //     return "";
      //   }
      // } else if (/^\d+$/.test(price1)) {
      //   return (
      //     String(price1).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + price2
      //   );
      // } else {
      //   return "";
      // }
      return hasdotNumProcesser(price, dotnum);
    } else {
      //本來price沒有小數點，把後兩位當作小數點
      price1 = price.substr(0, price.length - dotnum);
      if (price1 === "") {
        price1 = "0";
      }
      price2 = price.substr(-dotnum);
      if (String(price1).slice(0, 1) === "-") {
        price1 = String(price1).slice(1, String(price1).length);
        if (/^\d+$/.test(price1)) {
          return (
            "-" + price1.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + price2
          );
        } else {
          return "";
        }
      } else if (/^\d+$/.test(price1)) {
        return (
          String(price1).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + price2
        );
      } else {
        return "";
      }
    }
  } else {
    return "";
  }
};
// 處理小數點數值四捨五入前面加上千分號，dotnum控制小數點第幾位，無小數點指加上千分號
export const formatHasdotPrice = (price, dotnum = 2) => {
  if (
    typeof price === "string" ||
    (typeof price === "number" && price !== "")
  ) {
    price = priceProcesser(price);

    let hasDot = true;
    if (price.indexOf(".") === -1) {
      hasDot = false;
    }

    if (hasDot) {
      return hasdotNumProcesser(price, dotnum);
    } else {
      return formatPrice(price);
    }
  } else {
    return "";
  }
};

function hasdotNumProcesser(price, dotnum) {
  let price1 = "";
  let price2 = "";
  let arr = price.split(".");
  price1 = arr[0];
  price2 = String(Number("0." + arr[1]).toFixed(dotnum)).substring(2);
  console.log(`price2:${price2}`);
  if (String(price1).slice(0, 1) === "-") {
    price1 = String(price1).slice(1, String(price1).length);
    if (/^\d+$/.test(price1)) {
      return "-" + price1.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + price2;
    } else {
      return "";
    }
  } else if (/^\d+$/.test(price1)) {
    return String(price1).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + price2;
  } else {
    return "";
  }
}

function priceProcesser(price) {
  let str = price.toString();
  price = str.replace(/\b(?:0*(0\.\d+)|0+)/g, "$1");

  if (price === "" || price === "-") {
    price = "0";
  }
  return price;
}

//電文回2位小數，去掉後面的00再做將金額加上千分位逗號
export const formatPriceSub00 = (price) => {
  if (
    typeof price === "string" ||
    (typeof price === "number" && price !== "")
  ) {
    let str = price.toString();
    price = str.replace(/\b(?:0*(0\.\d+)|0+)/g, "$1");

    if (price === "" || price === "-") {
      price = "0";
    }

    if (price.indexOf(".") !== -1) {
      let arr = price.split(".");
      price = arr[0];
    } else {
      price = price.substr(0, price.length - 2);
    }

    if (String(price).slice(0, 1) === "-") {
      price = String(price).slice(1, String(price).length);
      if (/^\d+$/.test(price)) {
        return "-" + price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        return "";
      }
    } else if (/^\d+$/.test(price)) {
      return String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return "";
    }
  } else {
    return "";
  }
};

//去掉電文數字前面所有的0
export const formatPriceRemove0 = (price) => {
  if (
    typeof price === "string" ||
    (typeof price === "number" && price !== "")
  ) {
    let str = price.toString();
    // let reg = new RegExp("([0]*)([1-9]+[0-9]+)", "g");
    // price = str.replace(reg, "$2");
    // price = str.replace(/\b0+/g, "");
    price = str.replace(/\b(?:0*(0\.\d+)|0+)/g, "$1");

    if (price === "" || price === "-") {
      price = "0";
    }

    return price;
  } else {
    return price;
  }
};

//顯示至小數點第四位(第五位四捨五入進到第四位)，如小數點後值有0僅顯示至有值部分
//EX: 25.33402顯示25.334 、25.110078顯示25.1101、25.00001顯示25、0.85761顯示0.8576
export const formatPriceFormatNum = (num) => {
  const rounderNumber = parseFloat(num.toFixed(4));
  const decimalStr = rounderNumber.toString().split(".")[1];
  const mathNumber = Math.floor(rounderNumber);
  const regNumber = mathNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (decimalStr === undefined || decimalStr === "0000") {
    return regNumber;
  } else {
    const rounderNumberFloat = parseFloat(
      rounderNumber.toFixed(decimalStr.length)
    );

    const regNumber = rounderNumberFloat
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return regNumber;
  }
};
