import { ProductType } from "../interface";

export default class NativeToken implements ProductType {
  token;
  constructor(token){
    this.token = token;
  }

  getNativeTokenId(){
    return this.token.policyId + "." + this.token.assetId;
  }

  loadCarousel(){
    return Promise.resolve([]);
  }

  getAccordionItemsInterface(): Promise<any[]> {
    let accordionItems : any[] = [];
    if(this.token.policyId && this.token.assetId){
      accordionItems.push(
        {
          data:{
            
            header: 
                  {
                    text: this.token.assetId,
                    open: (true)
                  },
            content: 
                  {
                    text: "# Policy Id\ " + this.token.policyId,
                    isComponent: false,
                    textFormat: "md"
                  }    
          },
          location : 0
        }
      );
    }

    return Promise.resolve(accordionItems);
  }

  getProductType(){
    return "NativeToken";
  }

  public getName(){
    return this.token.assetId;
  }
  
  public getPolicyId(){
    return this.token.policyId;
  }

  public fetchBlob() : Promise<string>{
    return Promise.resolve("");
  }
  public getListResources(){
    return [];
  }
  public async loadResource(): Promise<Array<any>> {
    return Promise.resolve([]);
  }
  public async loadDefaultResource():Promise<any>{
    return Promise.resolve("");
  }
}