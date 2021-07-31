import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from "../store";
//import Home from "../views/Home.vue";
import Collection from "../views/Collection.vue";
import CollectionView from "../views/collection/CollectionProductView.vue";
import Marketplace from "../views/Marketplace.vue";
import ProductView from "../views/marketplace/ProductView.vue";
import ItemsView from "../views/marketplace/ItemsView.vue";
import OrderId from "../views/shopping/OrderId.vue";
/*
import Community from "../views/Community.vue";
import Organization from "../views/Organization.vue";
import Settings from "../views/Settings.vue";
import AddWallet from "../views/AddWallet.vue";
import WalletType from "../views/sync_wallet/WalletType.vue";
import Mnemonic from "../views/sync_wallet//Mnemonic.vue";
import Password from "../views/sync_wallet//SpendingPassword.vue";
import SyncWallet from "../views/sync_wallet/Sync.vue";
*/
import Shopping from "../views/shopping/Cart.vue";
import Payment from "../views/shopping/Payment.vue";
import FAQ from "../views/shopping/faq.vue";
import NotFound from "../views/NotFound.vue";
//import Test from "../views/test.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/marketplace"
  },
  /*
  {
    path: "/home",
    name: "home",
    component: Home
  },
  */
  {
    path: "/tokenviewer/:address?",
    name: "Token Viewer",
    component: Collection,
    props: true
  },
  {
    path: "/tokenviewer/:address?/token/:nativeTokenID",
    name: "Token Viewer - Tokens",
    component: CollectionView,
    props: true
  },
  {
    path: "/marketplace",
    name: "Marketplace",
    component: Marketplace,
    children: [
      {
        path: "",
        redirect: "/marketplace/items"
      },
        
      {
        path: "items",
        name: "Items",
        component: ItemsView
      },
      {
        path: "products/:id/:name",
        name: "Product View",
        component: ProductView,
        props: true
      }
    ]
  },
  /*
  {
    path: "/community",
    name: "Community",
    component: Community
  },
  {
    path: "/organization",
    name: "Organization",
    component: Organization
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings
  },
  {
    path:"/add-wallet",
    name:"Add Wallet",
    component: AddWallet
  },
  {
    path:"/sync",
    name:"Sync Wallet",
    component: SyncWallet,
    children:[
      {
          path: 'wallet-type',
          name: 'Wallet Type',
          component:WalletType,
          
      },
      {
          path: 'mnemonic',
          name: 'Mnemonic Phrase',
          component:Mnemonic,
          
      },
      {
        path: 'spending-password',
        name: 'Spending Password',
        component:Password, 
      }
    ]
  },
  {
    path: "/test",
    name: "test",
    component: Test
  },
  */
  
  {
    path: "/order/cart",
    name: "cart",
    component: Shopping
  },
  {
    path: "/order/payment",
    name: "Payment",
    component: Payment
  },
  {
    path: "/order/faq",
    name: "FAQ",
    component: FAQ
  },
  {
    path: "/order/orderid",
    name: "Order Id",
    component: OrderId,
  },
  {
    path: "/:pathMatch(.*)",
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes
});

const waitForStorageToBeReady = async (to, from,next) => {
  await (store as any).restored;
  next();
};
router.beforeEach(waitForStorageToBeReady);




export default router;
