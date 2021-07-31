import VuexPersistence from "vuex-persist";
import localForage from "localforage";

function newTimeout(days : number){
  const now = new Date();
  const timeout = 60 * 60 * 24 * days * 1000;
  return now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + timeout; //x days in milliseconds where x = days
}

interface item{
  item : any,
  timeout : number
}

function setStoreTimeout(){
  localForage.setItem("timeout", newTimeout(30));
}

function newProduct(product){
  return {
    item : product,
    timeout : newTimeout(7),
  };
}

const persist = new VuexPersistence({
  storage: {
    getItem(key : string): Promise<any> {
      const value = localForage.getItem<item>(key).then(
        function(value){
          return value? value.item : Promise.reject(null);
        } 
      ).catch(
        function(err){
          return Promise.reject(err);
        }
      );
      return value;
    },
  
    setItem<T>(key: string, data: T): Promise<any>{
      const value = localForage.setItem(key, newProduct(data)).then(function (value) {
        return value? value : Promise.reject(null);
      }).catch(function (err) {
        return Promise.reject(err);
      });
      return value;
    },

    async removeItem(key: string): Promise<void>{
      return await localForage.removeItem(key);
    },

    async clear(): Promise<void>{
      localForage.clear();
      setStoreTimeout();
    },

    async length(): Promise<number>{
      return await localForage.length();
    },

    async key(keyIndex: number): Promise<string>{
      return localForage.key(keyIndex);
    }
  },
  asyncStorage: true,
  strictMode: true,
  modules : [],
});

export default persist.plugin;
