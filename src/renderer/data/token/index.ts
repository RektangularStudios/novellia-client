import { ProductType } from "./interface";
import Product from "../product/Product";
import TypeCheck from "./token_types";
import ResourceService from "../../service/ResourceService";

class Context extends Product{
    
    private token: ProductType;
    private tokenQuantity : number;

    constructor(payload : {data : any, token?: any,quantity?:any, tokenType? : String}) {
      super();
      this.product = payload.data ? payload.data.product ? payload.data.product : null : null;
      this.attribution = payload.data ? payload.data.attribution ? payload.data.attribution : null : null;
      this.market = payload.data ? payload.data.market ? payload.data.market : null : null;
      this.metadata = payload.data ? payload.data.metadata ? payload.data.metadata : null : null;
      this.organization = payload.data ? payload.data.organization ? payload.data.organization : null : null;
      this.pricing = payload.data ? payload.data.pricing ? payload.data.pricing : null : null;
      this.stock = payload.data ? payload.data.stock ? payload.data.stock : null : null;
      this.token = payload.tokenType && payload.data.token?.token ? this.getTokenByType(payload.data.token.token, payload.tokenType): payload.token ? TypeCheck(payload.token) : this.getTokenType();
      this.productName = this.token ? this.token.getName() : null;
      this.tokenQuantity = payload.data?.tokenQuantity && payload.data.tokenQuantity !== null ? payload.data?.tokenQuantity : payload.quantity ? payload.quantity : 0;
    }

    public getProduct(){
      return {
        attribution : this.attribution,
        market : this.market,
        metadata : this.metadata,
        organization : this.organization,
        pricing : this.pricing,
        product : this.product,
        stock : this.stock,
        productName : this.productName,
      };
    }

    public getProductType(){
      return this.token.getProductType();
    }
    public getTokenQuantity(){
      return this.tokenQuantity;
    }

    public getNativeTokenID(){
      return this.token.getNativeTokenId();
    }

    public getToken(){
      return this.token;
    }

    private getTokenByType(token : any, type : String){
      return TypeCheck(token,type);
    }

    private getTokenType(){
      const product = this.product;
      return TypeCheck(product);
    }

    public async getAccordianData(){
      let tokenAccordionItems = await this.token.getAccordionItemsInterface();
      let accordionItems : Array<any> = [];

      if(this.attribution){
        accordionItems.push(
          {
            header: 
                    {
                      text: "Artist Details",
                      open: true
                    }, 
            content: 
                    {
                      text:{
                        component : () => import("@/renderer/components/marketplace/ArtistAttribution.vue"), 
                        props : {
                          attribution : this.attribution,
                          
                        }
                      },
                      isComponent: true,
                      textFormat: "none"
                    }
          
          }
        );
      }
      if(this.market !== null ){
        if(typeof this.market.name !== "undefined"){
          accordionItems.push(
            { 
              header: 
                {
                  text: "About " + this.market.name,
                  open: false
                },
              content: 
                {
                  text: "Occulta Novellia is a surreal horror multiverse. Each new set of collectibles is minted on the Cardano blockchain to incorporate new stories, building up the many facets of it.",
                  isComponent: false,
                  textFormat: "none"
                }
            });
        }
      }

      if(this.organization !== null){
        if(typeof this.organization.name !== undefined){
          accordionItems.push(
            { 
              header: 
                      {
                        text: "About " + this.organization.name,
                        open: false
                      },
              content: 
                      {
                        text: "Rektangular Studios Inc. is a software development company working to bring new products to the Cardano ecosystem.",
                        isComponent: false,
                        textFormat: "none"
                      }
            }
          );
        }
      }

      for(var tokenItem of tokenAccordionItems){
        accordionItems.splice(tokenItem.location, 0, tokenItem.data);
      }

      return accordionItems;

    }
}

export default async function (data : any){
  if(data?.product && data?.type){
    if(data?.quantity){
      return new Context({data : data.product, tokenType : data.type, quantity : data.quantity});
    }
    return new Context({data : data.product, tokenType : data.type});
  }
  if(data?.nativeTokenId){
    const rawData = await parseRawData(data);
    if(rawData){  
      return new Context({data : null,token : rawData.token, quantity : rawData.quantity});
    }
    return new Context({data:null});
  }
  return new Context({data : data});
}

async function parseRawData(rawData : any){
  const quantity = rawData.amount;
  const tokenId = rawData.nativeTokenId;
  const mintTx = rawData.initialMintTxMetadata;
  if(tokenId && mintTx){
    try {
      const m721 = await ResourceService.parse721Metadata(tokenId,mintTx);
      if(m721 !== null){
        return {token : m721, quantity : quantity};
      }
    } catch (e) {
    } 
  }
  return null;
}