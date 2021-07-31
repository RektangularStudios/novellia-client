import ResourceService from "@/renderer/service/ResourceService";
import { ProductType } from "../interface";

export default class Extended721Token implements ProductType {
  token;
  constructor(token){
    this.token = token;
  }

  getProductType(){
    return "Extended721Token";
  }

  getNativeTokenId(){
    return this.token.nativeToken.policyId + "." + this.token.nativeToken.assetId;
  }

  async loadCarousel(){
    const resources = this.getListResources();
    const loadSrcs = await this.loadResource();
    let data : Array<any> = [];
    for(var i = 0; i < loadSrcs.length;i++){
      let mediaType = resources[i].contentType;
      if(mediaType.indexOf("html")<0){
        mediaType = mediaType.split("/")[0];
      }
      
      mediaType = mediaType.toLowerCase();
      const r = {
        mediaSrc: loadSrcs[i],
        thumbnailSrc: loadSrcs[i],
        alt: resources[i].resourceId,
        title: resources[i].resourceId,
        mediaType: mediaType
      };
      data.push(r);
    }
    return data;
  }


  getAccordionItemsInterface(): Promise<any[]> {
    let accordionItems : any[] = [];
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
          location : 2
        }
      );
    }

    return Promise.resolve(accordionItems);
  }

  public getName(){
    return this.token.name;
  }

  public getPolicyId(){
    return this.token.nativeToken.policyId;
  }

  public fetchBlob() : Promise<string>{
    return Promise.resolve("");
  }

  public getListResources(){
    let resource : Array<any> = [];
    if ("files" in this.token){
      for(var file of this.token.files){
        const url = ResourceService.fixUrl(file.src);
        let fileType = {
          "contentType": file.mediaType ? file.mediaType : file.mime ? file.mime : "image/jpeg",
          "description": file.mediaType ? ResourceService.mimeTypeToAssetType(file.mediaType) : file.mime ? ResourceService.mimeTypeToAssetType(file.mime) : "Artwork" ,
          "hashSourceType": ResourceService.getHashSourceType(url),
          "multihash" : ResourceService.getMultihash(url),
          "priority": 0,
          "resourceId": file.mediaType ? ResourceService.mimeTypeToAssetType(file.mediaType) : file.mime ? ResourceService.mimeTypeToAssetType(file.mime) : "Artwork",
          "url": [url]
        };
        resource.push(fileType);
      }      
    };
    const url = ResourceService.fixUrl(this.token.image);

    const fileType = {
      "contentType": this.token.mediaType ? this.token.mediaType : this.token.mime ? this.token.mime : "image/jpeg",
      "description": this.token.mediaType ? ResourceService.mimeTypeToAssetType(this.token.mediaType) : this.token.mime ? ResourceService.mimeTypeToAssetType(this.token.mime) : "Artwork",
      "hashSourceType": ResourceService.getHashSourceType(url),
      "multihash" : ResourceService.getMultihash(url),
      "priority": 0,
      "resourceId": this.token.mediaType ? ResourceService.mimeTypeToAssetType(this.token.mediaType) : this.token.mime ? ResourceService.mimeTypeToAssetType(this.token.mime) : "Artwork",
      "url": [url]
    };
    resource.push(fileType);
   
    return resource;
  }

  public async loadDefaultResource(){
    const resource = await this.loadResource();
    return resource[resource.length - 1];
  }

  public async loadResource(): Promise<Array<any>> {
    const resources = this.getListResources();
    let art : Array<any> = [];
    for(var resource of resources ){
      if(resource.url[0].indexOf("data:") > -1){
        art.push(resource.url[0]);
      }
      else{
        const artwork = await ResourceService.fetchResourceInferLoader(resources,resource.resourceId,0);
        art.push(artwork);
      }
    }
    
    return art;
  }
}
