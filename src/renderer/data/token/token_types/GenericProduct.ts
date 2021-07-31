import Asset from "../../product/Asset";
import { ProductType } from "../interface";

export default class GenericProduct implements ProductType {
  token;
  media;
  constructor(token){
    this.token = token;
  }

  getProductType(){
    return "GenericProduct";
  }

  loadCarousel(){
    return Promise.resolve([]);
  }

  getNativeTokenId(){
    return "";
  }

  getAccordionItemsInterface(): Promise<any[]> {
    return Promise.resolve([]);
  }

  public getName(){
    return "";
  }

  public getListResources(){
    return [];
  }

  public async loadResource(): Promise<Array<any>> {
    return Promise.resolve([]);
  }

  public async loadDefaultResource():Promise<any> {
    return Promise.resolve("");
  }
 
  public getPolicyId(): string {
    return "";
  }

  public fetchOccultaNovelliaCharacter(): Promise<Asset> {
    return Promise.resolve({ type: "", asset: "" });
  }

  public fetchBlob() : Promise<string>{
    return Promise.resolve("");
  }

  public fetchCard(
    priority: number
  ): Promise<string> {
    return Promise.resolve("");
  }

  public fetchArtwork(
    priority: number
  ): Promise<string> {
    return Promise.resolve("");
  }

  public fetchVideo(
    priority: number
  ): Promise<string> {
    return Promise.resolve("");
  }
}
