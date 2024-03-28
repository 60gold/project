import { fnShowElLoading } from "@/common/methodCommon/publicMethod";
import store from "@/store/index";
const sNibUrl = store.getters["publicStore/getNibUrl"];

//跳回jsp提交表單
export const fnFormSubmit = (action, menuIcon = "") => {
  fnShowElLoading();
  let iconid = menuIcon === "" ? `menu_${action}` : menuIcon;
  document.mform.menutype.value = action;
  document.mform.iconid.value = iconid;
  document.mform.action = `${sNibUrl}/tx/${action}`;
  document.mform.submit();
};
//登出
export const fnGoLogout = () => {
  document.mform.action = `${sNibUrl}/tx/logout`;
  document.mform.submit();
};
//加入行事曆
export const fnAddNotice = (title) => {
  fnShowElLoading();
  document.mform.menutype.value = "notification";
  document.mform.action = `${sNibUrl}/tx/notification?method=transferNotice`;
  document.mform.title.value = title;
  document.mform.submit();
};
