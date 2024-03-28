import nibRequset from "@/api/axios/nibRequsetQS";

/* 檢核 */
export const apiPostFxCheck = (data) =>
  nibRequset.post("/tx/fxccyQuery?method=check", data);

/* 查詢 外幣現鈔申購
 * request: {
 *   Status: 交易狀態 0:全部; 1:未領鈔; 2:已領鈔; 3:逾期未取鈔; 4:逾期已回售; 5:回售交易處理中
 *   Kind: 交易類型 1:交易日期;2:預約領取日
 *   StartDate: 查詢起日
 *   EndDate: 查詢迄日
 * }
 */
export const apiPostFxQuery = (data) =>
  nibRequset.post("/tx/fxccyQuery?method=query", data);

/* 檢核交易時間 & 查詢 取鈔日 */
export const apiPostFxGetDate = (data) =>
  nibRequset.post("/tx/fxccyQuery?method=getDate", data);

/* 修改 領鈔日
 * request: {
 *   RefNo: 申請編號
 *   NewTakeDate: 預約領取日(ex:20220623)
 * }
 */
export const apiPostFxChange = (data) =>
  nibRequset.post("/tx/fxccyQuery?method=change", data);
