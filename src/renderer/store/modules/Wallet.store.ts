import {State} from "./index";
import { Novellia } from "../helper_functions/NovelliaService";
import TypeMapper from "../../data";
import { Context } from "vm";
import token from "@/renderer/data/token";
import isCardanoAddressOrStake from "../../helper_functions/isCardanoAddressOrStake";

const novelliaService = Novellia;
const initialState = () => ({
  searchParameters: "",
  tokens: [],
  processedTokens: [],
  connected: false
});

const state = initialState();

export interface WalletState{
  searchParameters: String,
  tokens: token[],
  processedTokens : {product : Context, type : String, quantity : number}[],
  connected: Boolean;
}

export interface token{
    asset_id : String,
    amount : Number,
    name? : String,
    description? : String,
    type? : String
}

const getters = {
  getTokens(state){
    return state.tokens;
  },
  getSearchParameters(state){
    return state.searchParameters;
  },
  getConnected(state){
    return state.connected;
  },
  getProcessedTokens(state){
    return state.processedTokens;
  }
};

const mutations = {
  RESET(state : State) {
    const newState = initialState();
    Object.keys(newState).forEach(key => {
      state[key] = newState[key];
    });
  },
  RESETTOKENS(){
    state.tokens = [];
    state.processedTokens = [];
  },
  setTokens(state,tokens : token[]){
    state.tokens = tokens;
  },
  setSearchParameters(state,searchParameters : String){
    state.searchParameters = searchParameters;
  },
  setConnected(state,connected : String){
    state.connected = connected;
  },
  resetTokens(){
    state.tokens = [];
    state.processedTokens = [];
  },
  pushProcessedTokens(state,payload : {tokens : Array<any>, start: number}){
    if(state.processedTokens.length - 1 <= payload.start){
      for(var token of payload.tokens){
        state.processedTokens.push(token);
      }
      return;
    }
  }
};

const actions = {
  async updateTokenBySearchParameters({commit,dispatch}) {
    const tokens = await dispatch("getTokens");
    commit("setConnected",true);
    commit("setToken",tokens);
  },
  async getTokens({commit,getters}){
    //this does not work with random, because you dont have a constant search list. Figure out way of making this constant, or better replace search with asset id

    var tokens = getters.getTokens;
    
    if(tokens?.tokens){
      if(tokens.tokens.length > 1){
        return tokens;
      }   
    }
    const searchParameters : Array<string> = [getters.getSearchParameters];
   
    if(isCardanoAddressOrStake(getters.getSearchParameters)){
      tokens = await novelliaService.wallet({cardanoIdentifiers:searchParameters}).catch(()=>{return [];});
    }
    else{
      tokens = await novelliaService.getTokens({cardanoIdentifiers :searchParameters}).catch(()=>{return [];});
    }
    commit("setConnected",true);
    commit("setTokens",tokens);
    return getters.getTokens;
  },
  async syncTokens({commit,dispatch}){
    commit("resetTokens");
    await dispatch("getTokens");
  },
  
  async getProcessedTokenByNativeTokenId({ dispatch }, nativeTokenId){
    const tokens = await dispatch("getTokens");
    const index = tokens.tokens.findIndex(token => token.nativeTokenId == nativeTokenId);
    const type = await TypeMapper(tokens.tokens[index]);
    return type;
  },

  async getProcessedTokens({dispatch,commit,getters},payload : {amount : number,scaleBy : number}){
    const searchParameters = getters.getSearchParameters;
    let tokens : any  = [];
    let tokenParse : Array<Context> = [];
    let processedTokensArray : Array<{product : Context, type : String, quantity : number}> = [];

    if(searchParameters){
      const processedTokens = getters.getProcessedTokens;
      if(processedTokens){  
        if(processedTokens.length >= payload.scaleBy + payload.amount){
          for(let i = payload.amount;i<processedTokens.length; i++){
            const context : Context = await TypeMapper(processedTokens[i]);
            tokenParse.push(context);
          }
          return tokenParse;
        }
      }
      
      tokens = await dispatch("getTokens");
      if(tokens.tokens){
        const amount = tokens.tokens.length - 1 < payload.scaleBy + payload.amount ? tokens.tokens.length : payload.scaleBy + payload.amount;
        for(let i = payload.amount; i<=amount; i ++){
          const item = await TypeMapper(tokens.tokens[i]);
          if(item){
            if(item.productName !== ""){
              const quantity = tokens.tokens[i].amount ? tokens.tokens[i].amount : 0;
              processedTokensArray.push({product : item, type : item.getProductType(),quantity : quantity});
              tokenParse.push(item);       
            }           
          }  
        }
        commit("pushProcessedTokens",{tokens : processedTokensArray, start: payload.amount});
      }  
      return tokenParse;
    }  
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

  