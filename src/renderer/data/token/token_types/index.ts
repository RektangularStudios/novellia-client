import Extended721Token from "./Extended721Token";
import GenericProduct from "./GenericProduct";
import NovelliaProduct from "./NovelliaProduct";
import NovelliaStandard from "./NovelliaStandardToken";
import NativeToken from "./NativeToken";
import { ProductType } from "../interface";


export default function (product : any,type?:String) : ProductType{
  if(type){
    if(type == "Extended721Token"){
      return new Extended721Token(product);
    }
    if(type == "NativeToken"){
      return new NativeToken(product);
    }
    if(type == "NovelliaProduct"){
      return new NovelliaProduct(product);
    }
    if(type == "NovelliaStandardToken"){
      return new NovelliaStandard(product);
    }
    return new GenericProduct("");
  }
  if(!product){
    return new GenericProduct("");
  }
  if(typeof product.novelliaProduct !== "undefined"){
    return new NovelliaProduct(product.novelliaProduct);
  }
  if(typeof product.novelliaStandardToken !== "undefined"){
    return new NovelliaStandard(product.novelliaStandardToken);
  }
  if(typeof product.extended721Token !== "undefined"){
    return new Extended721Token(product.extended721Token);
  }

  if(typeof product.nativeToken !== "undefined"){ 
    return new NativeToken(product.nativeToken);
  }
  return new GenericProduct("");
}