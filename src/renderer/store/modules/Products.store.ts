import LocalForageCustomSerialization from "../helper_functions/LocalForageCustomSerialization";
import { Novellia } from "../helper_functions/NovelliaService";
import data from "../../data";
import { ProductListElement } from "novellia-sdk";

const serialize = new LocalForageCustomSerialization("Products");
const novelliaService = Novellia;


const initialState = () => ({
  productIds: []
});

const state = initialState();

export interface ProductState {
  productIds: string[]
}

const getters = {

};

const mutations = {
  RESET(state) {
    serialize.clear();
    const newState = initialState();
    Object.keys(newState).forEach(key => {
      state[key] = newState[key];
    });
  },
};

const actions = {

  async getListProductsIDs(state): Promise<Array<string>>{
    const productListElements = await (await novelliaService.listProductIDs({})).products;
    const productIds = new Array<string>();
    productListElements.forEach(element => {
      productIds.push(element.productId);
    });
    state.productIds = productIds;

    const keys = await serialize.getListKeys();
    if(state.productIds){
      const getFromServer = state.productIds.filter(val => !keys.includes(val));
      if(getFromServer !== []){
        
        const productListElements = new Array<ProductListElement>();
        getFromServer.forEach(productId => {
          const elem = {
            productId: productId,
          };
          productListElements.push(elem);
        });

        const productsToCache = await novelliaService.getProductsByID({
          products: productListElements,
        });
        await productsToCache.forEach(async (product)=>{
          if (product.product.productId !== undefined) {
            const typeProduct = await data(product);
            await serialize.setItem(product.product.productId, typeProduct.getProduct());
          }
        });
      }
    }
    return state.productIds;
  },
  async loadProductById(state,productId : string): Promise<Object>{
    return await serialize.getItem(productId);
  },
  async updateProduct(state, product): Promise<boolean>{
    return await serialize.setItem(product.product.productId, product);
  },
  async getProductByproductId(state, productId : string){
    const product = await serialize.getItem(productId).then(
      async product => {
        if(product){
          return data(product);
        }
        return null;
      }
    ).catch(err => {
      console.log(err);
    });
    if(product){
      return product;
    }

    const productToCache = await novelliaService.getProductsByID({
      products: [{
        productId: productId,
      }],
    });
    const item = await data(productToCache[0]);
    if (productToCache[0].product.productId !== undefined) {
      await serialize.setItem(productToCache[0].product.productId, item.getProduct());
    }
    return item;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
