import {State} from "./index";

const initialState = () => ({
  acceptedPrivacyPolicy: false,
});

const state = initialState();

export interface AcceptCookiesState{
  acceptedPrivacyPolicy: boolean
}

const getters = {
  acceptedPrivacyPolicy(state : State){
    return state.acceptedPrivacyPolicy;
  }
};

const mutations = {
  RESET(state : State) {
    const newState = initialState();
    Object.keys(newState).forEach(key => {
      state[key] = newState[key];
    });
  },
  submitPrivacyPolicy(state : State) {
    state.acceptedPrivacyPolicy = true;
  },
};

const actions = {

};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

  