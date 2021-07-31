import { NovelliaService, OrderFulfillmentService } from "novellia-sdk";
import notProduction from "./notProduction";


function getFinishedPath(path : String, isProduction? : Boolean){
  let base = getBasePath(isProduction);
  return base + path;
}

function getBasePath(isProduction? : Boolean){
  if(notProduction && (typeof isProduction == "undefined" || isProduction == false)){
    return "https://api-demo.rektangularstudios.com/";
  }
  return "https://api.rektangularstudios.com/";
}

export const Novellia = new NovelliaService(
  {
    basePath : getFinishedPath("novellia/v0", false)
  }
);

export const OrderFulfillment = new OrderFulfillmentService(
  {
    basePath : getFinishedPath("order-fulfillment/v0",true)
  }
);
