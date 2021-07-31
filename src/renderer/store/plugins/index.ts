import Cookie from "./Cookies.plugin";
import { createLogger } from "vuex";
import notProduction from "../helper_functions/notProduction";
import LocalStorage from "./LocalStorage.plugin";

const cookie180Day = new Cookie(180,["AcceptCookies"]).getCookie();
const cookie3Day = new Cookie(3,["ShoppingCart"]).getCookie();
const localStorage = new LocalStorage(["Wallet"]).getLocalStorage();

const debugList = [createLogger()];
const bothList = [cookie180Day,cookie3Day,localStorage];

export default notProduction? debugList.concat(bothList) : bothList;