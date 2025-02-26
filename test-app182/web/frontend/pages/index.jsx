import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { Page } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import translationApi from "../apis/translationApi";
import { DEFAULT_TRANSLATION } from "../constants";
export default function HomePage() {
  const [shopifyDomain, setShopifyDomain] = useState("dat-nt2.myshopify.com");
  const [shopOwner, setShopOwner] = useState("Dat NT2");
  const { t } = useTranslation();
  const shopify = useAppBridge();

  const dispatch = useDispatch();
  useEffect(async () => {
    const response = await translationApi.save(DEFAULT_TRANSLATION);
    console.log(response);
  }, []);
  // const handleLogin = async () => {
  //   const response = await shopApi.save({
  //     shopify_domain: shopifyDomain,
  //     shop_owner: shopOwner,
  //   });
  //   if (response) {
  //     dispatch(updateShopData(response.data));
  //     const fetchToken = async () => {
  //       const results = await authApi.fakeLogin({
  //         shopify_domain: shopifyDomain,
  //         shop_owner: shopOwner,
  //       });
  //       if (results) {
  //         localStorage.setItem("token", JSON.stringify(results.token));
  //         localStorage.setItem("shop", JSON.stringify(response.data));
  //       }
  //     };
  //     fetchToken();
  //   }
  // };
  return (
    <Page narrowWidth>
      <TitleBar title={t("HomePage.title")} />
    </Page>
  );
}
