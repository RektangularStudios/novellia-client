import Asset from "../../product/Asset";
import ResourceService from "@/renderer/service/ResourceService";
import { ProductType } from "../interface";
export default class NovelliaStandardToken implements ProductType {
  token;
  character;
  constructor(token){
    this.token = token;
  }

  getProductType(){
    return "NovelliaStandardToken";
  }

  getNativeTokenId(){   
    return this.token.token.policyId + "." + this.token.token.assetId;
  }

  async getAccordionItemsInterface(): Promise<any[]> {
    if(typeof this.character === "undefined"){
      this.character = await this.fetchOccultaNovelliaCharacter().catch(() => {return;});
    }
    const accordionItems : Array<any> = [];
    let foundProduct = 0;

    if(this.character){
      accordionItems.push(
        {
          data:{  
            header: 
                      {
                        text: "Product Details",
                        open: true 
                      }, 
            content: 
                      {
                        text:{
                          component : () => import("@/renderer/components/marketplace/ProductDetails.vue"), 
                          props : {
                            assetType : this.character.type ? this.character.type : null,
                            asset : this.character.asset ? this.character.asset : null,
                          }
                        },
                        isComponent: true,
                        textFormat: "none"
                      }
          },
          location : foundProduct
        }
      );
      foundProduct+=1;
    }
    if(this.getDescription()){
      accordionItems.push(
        {
          data:{
            
            header: 
                  {
                    text: "Description",
                    open: (typeof this.character !== undefined)
                  },
            content: 
                  {
                    text: this.getDescription(),
                    isComponent: false,
                    textFormat: "md"
                  }    
          },
          location : foundProduct
        }
      );
      foundProduct+=1;
    }
    if(this.token.metadata){
      accordionItems.push(
        {
          data:{
            
            header: 
                  {
                    text: "Metadata",
                    open: false
                  },
            content: 
                  {
                    text:{
                      component : () => import("@/renderer/components/PrettyPrintJSON.vue"), 
                      props : {
                        json : JSON.stringify(this.token.metadata),
                      }
                    },
                    isComponent: true,
                    textFormat: "none"
                  }    
          },
          location : -1
        }
      );
    }
    return accordionItems;
  }

  public getDescription(){
    if(this.token.description?._long){
      return this.token.description._long;
    }
    if(this.token.details?.description?.long){
      return this.token.details.description.long;
    }
    return null;
  }

  public getName(){
    if(this.token.name){
      return this.token.name;
    }
    if(this.token.details?.name){
      return this.token.details.name;
    }
    return "";
  }

  public getListResources(priority : number){
    return this.getResource();
  }

  private getResource(){
    if(this.token.resource){
      return this.token.resource;
    }
    if(this.token.details?.resource){
      return this.token.details.resource;
    }
    return [];
  }

  public async loadResource(priority? : number): Promise<Array<any>> {
    const resource = this.getResource();
    let resourceList : Array<any> = [];
    for(let item of resource ){
      if(item.priority == priority || typeof priority === "undefined"){
        if(item.resourceId.indexOf(ResourceService.cardResourceId) > -1){
          const resource = await this.fetchBlob(
            item.resourceId,
            typeof priority === "undefined" ? 0 : priority
          );
          resourceList.push({resource : resource, resourceId : item.resourceId, contentType : item.contentType.split("/")[0].toLowerCase()});
        }
        if(item.resourceId.indexOf(ResourceService.thumbnailResourceId) > -1){
          const resource = await this.fetchBlob(
            item.resourceId,
            typeof priority === "undefined" ? 0 : priority
          );
          resourceList.push({resource : resource, resourceId : item.resourceId, contentType : item.contentType.split("/")[0].toLowerCase()});
        }
        if(item.resourceId.indexOf(ResourceService.artworkResourceId) > -1){
          const resource = await this.fetchBlob(
            item.resourceId,
            typeof priority === "undefined" ? 0 : priority
          );
          resourceList.push({resource : resource, resourceId : item.resourceId, contentType : item.contentType.split("/")[0].toLowerCase()});
        }
        if(item.resourceId.indexOf(ResourceService.animationResourceId) > -1){
          const resource = await this.fetchBlob(
            item.resourceId,
            typeof priority === "undefined" ? 0 : priority
          );
          resourceList.push({resource : resource, resourceId : item.resourceId, contentType : item.contentType.split("/")[0].toLowerCase()});
        }
        if(item.resourceId.indexOf(ResourceService.audioResourceId) > -1){
          const resource = await this.fetchBlob(
            item.resourceId,
            typeof priority === "undefined" ? 0 : priority
          );
          resourceList.push({resource : resource, resourceId : item.resourceId, contentType : item.contentType.split("/")[0].toLowerCase()});
        }
        if(item.resourceId.indexOf(ResourceService.videoResourceId) > -1){
          const resource = await this.fetchBlob(
            item.resourceId,
            typeof priority === "undefined" ? 0 : priority
          );
          resourceList.push({resource : resource, resourceId : item.resourceId, contentType : item.contentType.split("/")[0].toLowerCase()});
        }
      }
    }

    return resourceList;
  }
  
  public async loadCarousel(): Promise<Array<any>> {
    let thumbnail = await this.loadResource(0);
    let main = await this.loadResource(1);
    let galleryData : Array<any> = [];
    for(var i = 0; i<thumbnail.length;i++){
      const resourceI = main.findIndex(resource => resource.resourceId == thumbnail[i].resourceId);
      const data = {
        mediaSrc: resourceI > -1 ? main[resourceI].resource : thumbnail[i].resource,
        thumbnailSrc: thumbnail[i].resource,
        alt: thumbnail[i].resourceId,
        title: thumbnail[i].resourceId,
        mediaType: thumbnail[i].contentType,
      };
      if(data){
        galleryData.push(data);
      }
    }

    return galleryData;
  }

  public async loadDefaultResource(): Promise<any>{
    const cardLowRes = await this.fetchCard(0);
    return cardLowRes;
  }
  
  public getPolicyId(): string {
    if(this.token.nativeToken?.policyId){
      return this.token.nativeToken.policyId;
    }
    if(this.token.token?.policyId){
      return this.token.token.policyId;
    }
    return "";
  }

  public async fetchOccultaNovelliaCharacter(
  ): Promise<Asset> {
    const resourceType = ResourceService.occultaNovelliaCharacterResourceId;
    return await ResourceService
      .fetchResource(
        this.getResource(),
        resourceType,
        ResourceService.occultaNovelliaCharacterLoader,
        0
      )
      .then(character => {
        return { type: resourceType, asset: character };
      })
      .catch(e => {
        console.log(e);
        return Promise.reject("failed to fetch Occulta Novellia resource");
      });
  }

  public async fetchBlob(
    resourceId: string,
    priority: number
  ): Promise<string> {
    return await ResourceService
      .fetchResource(
        this.getResource(),
        resourceId,
        ResourceService.blobLoader,
        priority
      )
      .then(image => {
        return image;
      })
      .catch(e => {
        console.log(e);
        return Promise.reject("failed to fetch blob resource");
      });
  }

  public async fetchCard(
    priority: number
  ): Promise<string> {
    return await this.fetchBlob(
      ResourceService.cardResourceId,
      priority
    );
  }

 
  public async fetchArtwork(
    priority: number
  ): Promise<string> {
    return await this.fetchBlob(
      ResourceService.artworkResourceId,
      priority
    );
  }
  public async fetchVideo(
    priority: number
  ): Promise<string> {
    return await this.fetchBlob(
      ResourceService.videoResourceId,
      priority
    );
  }
}
