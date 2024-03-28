import { createStore } from "vuex";

import publicStore from "./publicStore"; //公用
import golden from "./golden/";
import foreignETFSummary from "./foreignETF/foreignETFSummary";
import foreignETFQAR from "./foreignETF/foreignETFQueryAndRevoke";
import foreignETFSell from "./foreignETF/foreignETFSell";
import foreignETFBuy from "./foreignETF/foreignETFBuy";
import familyShare from "./familyShare";

export default createStore({
  modules: {
    publicStore,
    golden,
    foreignETFSummary,
    foreignETFQAR,
    foreignETFSell,
    foreignETFBuy,
    familyShare,
  },
});
