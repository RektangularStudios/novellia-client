import { createStore, Store, useStore as baseUseStore, } from "vuex";
import { InjectionKey,ComponentCustomProperties } from "vue";

import modules from "./modules";
import {State} from "./modules";
import plugins from "./plugins";
import notProduction from "./helper_functions/notProduction";

export const key: InjectionKey<Store<State>> = Symbol();

export default createStore({
  modules,
  actions: {
    RESET({commit}){
      Object.keys(modules).forEach(moduleName => {
        commit(`${moduleName}/RESET`);
      });
    },
    RESET__EXCLUDING({commit},exclude? : string[]){
      Object.keys(modules).forEach(moduleName => {
        let shouldExclude = false;
        if(exclude){
          exclude.forEach((item : string) => {
            if(item === moduleName){
              shouldExclude = true;
            }
          });
        }
        if(!shouldExclude){
          commit(`${moduleName}/RESET`);
        }
      });
    }
  },
  plugins: plugins,
  strict: notProduction,
});

export function useStore () {
  return baseUseStore(key);
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}