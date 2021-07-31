import config from "../../config";
import Cookie from "js-cookie";
import store from "../index";

const initalCookieState = () => {
  Cookie.set("version", config.version, { expires: 180});
};

export default function resetStoreOnCondition(){
  
  let lastKnownVersion = Cookie.get("version");
  if(!lastKnownVersion){
    initalCookieState();
    lastKnownVersion = Cookie.get("version");
  }
  
  lastKnownVersion = JSON.parse(lastKnownVersion);

  if(config.version.version !== lastKnownVersion.version && config.version.resetCache){
    initalCookieState();
    try {
      store.dispatch("RESET__EXCLUDING",["AcceptCookies"]);
    } catch (e) {             
      console.error(e);
    }
  }
  else{
    store.commit("Wallet/RESETTOKENS");
  }
}
