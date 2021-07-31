import VuexPersistence from "vuex-persist";

export default class LocalStorage{
  modules: string[];

  constructor(modules : string[]) {
    this.modules = modules;
  }

  getLocalStorage(){
    return new VuexPersistence({
      storage: window.localStorage,  
      modules : this.modules,
    }).plugin;
  }

}



  
