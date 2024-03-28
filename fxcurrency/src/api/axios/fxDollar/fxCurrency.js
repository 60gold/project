import nibRequset from "@/api/axios/nibRequsetQS";

/* 檢核 */
export const apiPostFxCheck = () =>
  nibRequset.post("/tx/fxccyApply?method=check");

/* 查詢 轉出帳號,預約領取日,目的地國別
 * request: {
 *   NoticeAgree: 外匯申報注意事項
 *   ApplyAgree: 外幣現鈔申購約定事項
 * }
 */
export const apiPostFxInit = (data) =>
  nibRequset.post("/tx/fxccyApply?method=init", data);

/* 查詢 領取分行
 * request: {
 *   Getccy: 申購現鈔幣別
 * }
 */
export const apiPostFxGetExchangeBranch = (data) =>
  nibRequset.post("/tx/fxccyApply?method=getExchangeBranch", data);

/* 查詢 重覆交易
 * request: {
 *   OrderDate: 預約領取日
 *   Getccy: 申購現鈔幣別
 *   Amount: 申購現鈔金額(後面要補小數點2位，Ex:1000美金 請帶100000)
 * }
 */
export const apiPostFxGetTrans = (data) =>
  nibRequset.post("/tx/fxccyApply?method=getTrans", data);

/* 資料確認(首段發送)
 * request: {
 *   Outccy: 轉出幣別
 *   Getccy: 申購現鈔幣別
 *   AcctNo: 轉出帳號
 *   TakeAmt: 申購現鈔金額
 *   Branch: 領取分行 (Ex: 0998)
 *   OrderDate: 預約領取日 (20220501)
 *   Denomination1: 面額1
 *   Denomination2: 面額2
 *   Denomination3: 面額3
 *   Denomination4: 面額4
 *   Denomination5: 面額5
 *   Denomination6: 面額6
 *   Sheet1: 面額1張數
 *   Sheet2: 面額2張數
 *   Sheet3: 面額3張數
 *   Sheet4: 面額4張數
 *   Sheet5: 面額5張數
 *   Sheet6: 面額6張數
 *   CBApplyCode: 交易性質 (Ex: 131)
 *   TradeCountry: 目的地國別 (Ex: US)
 *   Agree1: 同意事項1 (Y/N)
 *   Agree2: 同意事項2 (Y/N)
 * }
 */
export const apiPostFxConfirm = (data) =>
  nibRequset.post("/tx/fxccyApply?method=confirm", data);

/* 交易結果(次段發送)
 * request: {
 *   Birthday: 交易密碼
 * }
 */
export const apiPostFxResult = (data) =>
  nibRequset.post("/tx/fxccyApply?method=result", data);

/* 水單列印 */
export const apiPostFxPrint = () =>
  nibRequset.post("/tx/fxccyApply?method=print");

/* 幣轉
 * request: {
 *   amt: 金額
 *   iCcy: 新幣別
 *   oCcy: 舊幣別
 * }
 */
export const apiPostEquivFxTrans = (data) =>
  nibRequset.post("/tx/queryAction?method=doGetEquivFxTrans", data);

/* 查詢 可用餘額-台幣
 * request: {
 *   acctno: 台幣帳號
 * }
 */
export const apiPostAcctNoBalancsEx = (data) =>
  nibRequset.post("/tx/queryAction?method=doGetAcctNoBalancsEx", data);

/* 查詢 可用餘額-外幣
 * request: {
 *   acctno: 外幣帳號
 *   currency: 幣別
 * }
 */
export const apiPostAcctNoBalancsFmFxEx = (data) =>
  nibRequset.post("/tx/queryAction?method=doGetAcctNoBalancsFmFxEx", data);
