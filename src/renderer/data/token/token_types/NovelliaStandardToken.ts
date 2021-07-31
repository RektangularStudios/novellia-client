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
    
    if(this.token.nativeToken?.policyId && this.token.nativeToken?.assetId){
      return this.token.nativeToken.policyId + "." + this.token.nativeToken.assetId;
    }
    
    return "";
  }

  async getAccordionItemsInterface(): Promise<any[]> {
    if(typeof this.character === "undefined"){
      this.character = await this.fetchOccultaNovelliaCharacter().catch(() => {return;});
    }
    const accordionItems : Array<any> = [];
    let foundProduct = 0;

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

    if(this.getCompanyAttribution()){
      accordionItems.push(
        {
          data:{
            
            header: 
                  {
                    text: "Attribution",
                    open: (typeof this.character !== undefined)
                  },
            content: 
                  {
                    text: this.getCompanyAttribution(),
                    isComponent: false,
                    textFormat: "md"
                  }    
          },
          location : foundProduct
        }
      );
      foundProduct+=1;
    }
    if(this.token.otherData && Object.keys(this.token.otherData).length !== 0){
      accordionItems.push(
        {
          data:{
            
            header: 
                  {
                    text: "Properites",
                    open: true
                  },
            content: 
                  {
                    text:{
                      component : () => import("@/renderer/components/ExtraFields.vue"), 
                      props : {
                        json : JSON.stringify(this.token.otherData),
                      }
                    },
                    isComponent: true,
                    textFormat: "none"
                  }    
          },
          location : 1
        }
      );
    }

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
          location : foundProduct += 1
        }
      );
    }
    return accordionItems;
  }

  public getCompanyAttribution(){
    let publisherString = "#### " +  this.token.copyright;
    for (var publisher of this.token.publisher){
      let item = publisher;
      //todo make this work for decentralized urls
      if(item.indexOf("http") < 0 && item.indexOf("https") < 0){
        item = "https://" + item;
      }
      
      publisherString = publisherString + "\n" + "["+ item +"](" + item + ")";
    }
    return publisherString;
  }

  public getDescription(){
    if(this.token.description?._long && this.token.description?._long !== ""){
      return this.token.description._long;
    }
    if(this.token.description?.long && this.token.description?.long !== ""){
      return this.token.description.long;
    }
    if(this.token.description?._short && this.token.description?._short !== ""){
      return this.token.description._short;
    }
    if(this.token.description?.short && this.token.description?.short !== ""){
      return this.token.description.short;
    }
    return null;
  }

  public getName(){
    if(this.token.name){
      return this.token.name;
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
    return [];
  }

  public async loadResource(priority? : number): Promise<Array<any>> {
    const resource = this.getResource();
    let resourceList : Array<any> = [];
    for(let item of resource ){
      if(item.priority == priority || typeof priority === "undefined"){
        const resource = await this.fetchBlob(
          item.resourceId,
          typeof priority === "undefined" ? 0 : priority
        );
        resourceList.push({resource : resource, resourceId : item.resourceId, contentType : item.contentType.split("/")[0].toLowerCase()});
      }
    }
    return resourceList;
  }
  
  public async loadCarousel(): Promise<Array<any>> {
    const priorities = this.getMinMaxPriorityLevels();
    const unloadableResourceIds = [ResourceService.animationResourceId, ResourceService.occultaNovelliaCharacterResourceId];
    //todo this is dumb and doesnt work, I need the resource system to map to a resource type and load all of that type, but it works for current items so push for tonight
    let thumbnail = await this.loadResource(priorities.min);
    let main = await this.loadResource(priorities.max);
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
      if(data && !unloadableResourceIds.includes(thumbnail[i].resourceId)){
        galleryData.push(data);
      }
    }

    return galleryData;
  }

  public getMinMaxPriorityLevels(){
    const prod = this.getResource();
    var lowest = Number.POSITIVE_INFINITY;
    var highest = Number.NEGATIVE_INFINITY;
    var tmp;
    for (var i=prod.length-1; i>=0; i--) {
      tmp = prod[i].priority;
      if (tmp < lowest) lowest = tmp;
      if (tmp > highest) highest = tmp;
    }
    return ({min : lowest, max : highest});
  }

  public async loadDefaultResource(): Promise<any>{
    const priorities = this.getMinMaxPriorityLevels();
    const resources = 
    [ 
      ResourceService.cardResourceId,
      ResourceService.artworkResourceId,
      ResourceService.thumbnailResourceId,
    ];
    
    let itemType = "";
    for(var item of this.getResource()){
      if(resources.includes(item.resourceId) && item.priority == priorities.min && itemType == ""){
        itemType = item.resourceId;
      }
    }
    
    const art = await this.fetchBlob(
      itemType,
      priorities.min
    );

    return art;

  }
  
  public getPolicyId(): string {
    if(this.token.nativeToken?.policyId){
      return this.token.nativeToken?.policyId;
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
