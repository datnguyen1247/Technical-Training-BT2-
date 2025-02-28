import { CustomizationController } from "./controller/CustomizationController";
import { DiscountController } from "./controller/DiscountController";
import { ShopController } from "./controller/ShopController";
import { TranslationController } from "./controller/TranslationController";
import verifyHMAC from "./middlewares/verifyHmac.middleware";
import verifyHmacStorefront from "./middlewares/verifyHmacStorefront.middleware";
import verifySessionToken from "./middlewares/verifySessionToken";

export const Routes = [
  //SHOP
  {
    method: "post",
    route: "/shop",
    controller: ShopController,
    action: "save",
    middlewares: [verifyHMAC],
  },
  {
    method: "post",
    route: "/discount",
    controller: DiscountController,
    action: "updateDiscount",
    // middlewares: [verifyHmacStorefront],
  },
  {
    method: "patch",
    route: "/shop",
    controller: ShopController,
    action: "update",
  },
  {
    method: "get",
    route: "/shop",
    controller: ShopController,
    action: "one",
    // middlewares : [verifySessionToken]
  },
  {
    method: "get",
    route: "/shop",
    controller: ShopController,
    action: "all",
    middlewares: [verifySessionToken],
  },

  //FAKE LOGIN
  {
    method: "post",
    route: "/login",
    controller: ShopController,
    action: "fakeLogin",
  },
  //Customization
  {
    method: "put",
    route: "/customization",
    controller: CustomizationController,
    action: "save",
    middlewares: [verifySessionToken],
  },
  {
    method: "get",
    route: "/customization",
    controller: CustomizationController,
    action: "one",
    middlewares: [verifySessionToken],
  },
  //Translation
  {
    method: "get",
    route: "/translation",
    controller: TranslationController,
    action: "all",
    middlewares: [verifySessionToken],
  },
  {
    method: "get",
    route: "/translation/:locale",
    controller: TranslationController,
    action: "one",
    middlewares: [verifySessionToken],
  },
  {
    method: "post",
    route: "/translation",
    controller: TranslationController,
    action: "save",
    middlewares: [verifySessionToken],
  },
  {
    method: "post",
    route: "/translationAdd",
    controller: TranslationController,
    action: "add",
    middlewares: [verifySessionToken],
  },
  {
    method: "delete",
    route: "/translation/:locale",
    controller: TranslationController,
    action: "remove",
    middlewares: [verifySessionToken],
  },
];
