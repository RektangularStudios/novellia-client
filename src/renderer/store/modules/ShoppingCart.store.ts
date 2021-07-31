import {State} from "./index";
import { OrderFulfillment } from "../helper_functions/NovelliaService";
import { Order } from "novellia-sdk";
import { OrderCreated, Status } from "novellia-sdk/dist/order_fulfillment/_generated";
const orderFullfillmentService = OrderFulfillment;

const initialState = () => ({
  cart : [],
  order: {orderId : "", orderTime : ""},
});

const state = initialState();

export interface ShoppingCartState {
  cart: Product[],
  order: {orderId: string, orderTime: string}
}

interface Product {
  productId: string,
  quantity: number
}

const getters = {
  getCart: (state : State) => {return state.cart;},
  getOrderId: (state : State) => {
    try {
      return state.order.orderId;
    } catch (e) {
      console.log(e);
      return "";
    }
  },
  getTotalItemsInCart(state : State) {
    const cart = state.cart;
    let items = 0;
    cart.forEach((product) => {
      items += product.quantity;
    });
    return items;
  },

  getItemFromCartById: (state : State) => id => {
    const index = state.cart.findIndex(product => product.productId == id);
    return state.cart[index];
  },
  getOrderTime(state : State){
    try {
      return state.order.orderTime;
    } catch (e) {
      console.log(e);
      return "";
    }
  }
};

const mutations = {
  RESET(state) {
    const newState = initialState();
    Object.keys(newState).forEach(key => {
      state[key] = newState[key];
    });
  },
  resetCart(state : State){
    state.cart = [];
  },
  updateCart(state : State, payload : {productId : string, quantity : number}) {
    if(typeof payload.productId !== "undefined"){
      const index = state.cart.findIndex(
        product => product.productId == payload.productId
      );
      if (index !== -1 && payload.quantity > 0) {
        state.cart[index].quantity = payload.quantity;
        return;
      }
      if (index === -1 && payload.quantity > 0) {
        state.cart.push({
          productId: payload.productId,
          quantity: payload.quantity
        });
        return;
      }
      if (index !== -1 && payload.quantity === 0) {
        state.cart.splice(index, 1);
        return;
      }
    }
  },
  updateOrderId(state : State, id : string) {
    state.order.orderId = id;
    state.order.orderTime = new Date().toISOString();
  },
    
};

const actions = {
  async getOrderByOrderId(state, orderId : string): Promise<Order>{
    if(typeof orderId === "string"){
      return await orderFullfillmentService.getOrder(orderId);
    }
    return Promise.reject("Order ID is not a string");
  },
  async getOrder({getters}): Promise<Order>{
    const orderId = getters.getOrderId;
    if(typeof orderId === "string"){
      return await orderFullfillmentService.getOrder(orderId);
    }
    return Promise.reject("Order ID is not a string");
  },
  async status(state): Promise<Status>{
    return await orderFullfillmentService.status();
  },
  async createOrder({ getters },payload : {deliveryAddress : string, total : {priceCurrencyId : string, priceAmount : number}[]}) : Promise<OrderCreated>{
    //todo make this work with a list of payloads
    if(typeof getters.getCart !== "undefined")
    {
      if(getters.getCart.length > -1){
        const cart = getters.getCart;
        const address = payload.deliveryAddress;
        const priceCurrencyId = payload.total[0].priceCurrencyId;
        const priceAmount = payload.total[0].priceAmount;
        return await orderFullfillmentService.createOrder({order:{items:cart,customer:{deliveryAddress:address},payment:{paymentAddress:"",priceCurrencyId:priceCurrencyId,priceAmount:priceAmount,paymentStatus:""},orderId:"",description:"",orderStatus:""}});  
      }
    }
    return Promise.reject(null);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};