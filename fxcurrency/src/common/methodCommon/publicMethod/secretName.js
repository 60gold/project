//中文姓名隱碼：將姓名第二個字換成○符號
export const secretName = (sName) => {
  if (typeof sName === "string" && sName !== "" && sName.length > 1) {
    if (/^[\u4e00-\u9fa5]+$/.test(sName)) {
      sName = sName.replace(sName.charAt(1), "○");
      return sName;
    } else {
      return sName;
    }
  } else {
    return sName;
  }
};
