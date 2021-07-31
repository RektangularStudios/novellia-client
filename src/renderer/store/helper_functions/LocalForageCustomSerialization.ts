import localForage from "localforage";
interface item{
    item : any,
    timeout : number
}

export default class LocalForageSerialization{
    private Store: LocalForage;

    constructor(storeName = "LocalForageStore") {
      this.Store = localForage.createInstance({
        name: storeName
      });
    }

    private newTimeout(days : number){
      const now = new Date();
      const timeout = 60 * 60 * 24 * days * 1000; //x days in milliseconds where x = days
      return now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + timeout;
    }
      
    private setStoreTimeout(){
      this.Store.setItem("timeout", this.newTimeout(180));
    }

    private async validateTimeouts(key, product){
      const now = new Date();
      const currentTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
      if(product){
        if(product.item.timeout <= currentTime){
          await this.removeItem(key);
        }  
      }
    }

    private newProduct(product){
      return {
        item : product,
        timeout : this.newTimeout(7),
      };
    }

    async getItem(key : string): Promise<any> {
      const value =  await this.Store.getItem<item>(key).then(
        function(value){
          return value? value : Promise.reject(null);
        } 
      ).catch(
        function(err){
          return Promise.reject(err);
        }
      );
      this.validateTimeouts(key,value);
      return value.item? value.item : Promise.reject(null);
    }
    
    setItem<T>(key: string, data: T): Promise<any>{
      const value = this.Store.setItem(key, this.newProduct(data)).then(
        function (value) {
          return value? true : Promise.reject(null);
        }).catch(function (err) {
        return Promise.reject(err);
      });
      return value;
    }

    removeItem(key: string): Promise<boolean>{
      const value = this.Store.removeItem(key).then(function() {
        return true;
      }).catch(function(err) {
        console.log(err);
        return false;
      });
      return value;
    }
  
    async clear(): Promise<void>{
      this.Store.clear();
    }
  
    async length(): Promise<number>{
      return await this.Store.length();
    }
  
    async key(keyIndex: number): Promise<string>{
      return this.Store.key(keyIndex);
    }

    async getListKeys(): Promise<Array<string>>{
      return this.Store.keys();
    }

      
  
      
}





    




  
  
  
  
  