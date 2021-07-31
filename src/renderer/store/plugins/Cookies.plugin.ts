import VuexPersistence from "vuex-persist";
import Cookies from "js-cookie";

export default class Cookie{
  modules: string[];
  days: number;

  constructor(days : number, modules : string[]) {
    this.days = days;
    this.modules = modules;
  }
  getCookie(){
    return new VuexPersistence({
      restoreState: (key, storage) => {
        return Cookies.getJSON(this.days);
      },
      saveState: (key, state, storage) =>
      {
        Cookies.set(this.days, state, {
          expires: this.days,
        });
      },
      modules : this.modules,
    }).plugin;
  }

}



  
