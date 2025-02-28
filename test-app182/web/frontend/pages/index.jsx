import { TitleBar } from "@shopify/app-bridge-react";
import { Page } from "@shopify/polaris";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import translationApi from "../apis/translationApi";
import { DEFAULT_TRANSLATION } from "../constants";
export default function HomePage() {
  const { t } = useTranslation();
  useEffect(async () => {
    const response = await translationApi.add(DEFAULT_TRANSLATION);
    console.log(response);
  }, []);
  return (
    <Page narrowWidth>
      <TitleBar title={t("HomePage.title")} />
    </Page>
  );
}
