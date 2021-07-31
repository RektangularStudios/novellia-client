import AcceptCookies from "./AcceptCookies.store";
import {AcceptCookiesState} from "./AcceptCookies.store";
import Products from "./Products.store";
import {ProductState} from "./Products.store";
import ShoppingCart from "./ShoppingCart.store";
import {ShoppingCartState} from "./ShoppingCart.store";
import Wallet from "./Wallet.store";
import {WalletState} from "./Wallet.store";

export default {
  Products : Products,
  AcceptCookies : AcceptCookies,
  ShoppingCart : ShoppingCart,
  Wallet : Wallet,
  TempWallet : Wallet,
};

export type State = ProductState & AcceptCookiesState & ShoppingCartState & WalletState;
