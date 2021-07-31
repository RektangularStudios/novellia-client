import { State } from "./store/modules";
import { Store } from "vuex";
import { ComponentCustomProperties } from "vue";

declare module "@vue/runtime-core" {

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
