import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import {
  Box,
  Button,
  Card,
  HorizontalStack,
  Text,
  TextField,
  VerticalStack,
} from "@shopify/polaris";
import { PlusIcon } from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import translationApi from "../../apis/translationApi";
import TranslationItem from "../../components/TranslationItem";
export default function TranslationPage() {
  const { t } = useTranslation();
  const shopify = useAppBridge();
  const [activeModal, setActiveModal] = useState(false);
  const [dataTranslation, setDataTranslation] = useState([]);
  const [translation, setTranslation] = useState("");
  useEffect(() => {
    const fetchGetDataTranslation = async () => {
      const result = await translationApi.getAll();
      setDataTranslation(result.data);
    };
    fetchGetDataTranslation();
  }, []);

  const handleChangeTranslation = useCallback(
    (value) => setTranslation(value),
    []
  );
  const handleAddTranslation = async () => {
    const response = await translationApi.save({
      locale: translation,
      translate: {
        button_text: "",
        placeholder_text: "",
      },
    });
    shopify.modal.hide("modalAddTranslation");
    setDataTranslation((prev) => [...prev, response.data]);
  };
  const handleDeleteTranslation = async (locale) => {
    const newTranslationData = dataTranslation.filter(
      (item) => item.locale !== locale
    );
    shopify.modal.hide("modalAddTranslation");
    setDataTranslation(newTranslationData);
    await translationApi.delete(locale);
  };
  return (
    <>
      <div className="transition-wrapper">
        <VerticalStack gap="6">
          <VerticalStack>
            <Text variant="headingLg" as="h5">
              Translations
            </Text>
            <Text as="p" fontWeight="regular">
              Edit and translate every texts into your desired language
            </Text>
          </VerticalStack>
          <VerticalStack>
            <Card>
              <div style={{ padding: "0 16px" }}>
                <VerticalStack align="start" gap="4">
                  <div style={{ paddingTop: "16px" }}>
                    <Text variant="headingSm" as="h6">
                      Languages
                    </Text>
                  </div>
                  <div>
                    <Card>
                      <VerticalStack>
                        {dataTranslation.map((item, index) => {
                          return (
                            <Box key={item.id}>
                              <TranslationItem
                                handleDelete={handleDeleteTranslation}
                                defaultTranslation={index === 0}
                                translationTitle={item.locale || ""}
                              />
                              {index !== dataTranslation.length - 1 && (
                                <div
                                  style={{
                                    height: "1px",
                                    width: "100%",
                                    backgroundColor: "#d9d9d9",
                                  }}
                                ></div>
                              )}
                            </Box>
                          );
                        })}
                      </VerticalStack>
                    </Card>
                  </div>
                  <div style={{ paddingBottom: "16px" }}>
                    <HorizontalStack>
                      <Button
                        onClick={() => {
                          shopify.modal.show("modalAddTranslation");
                        }}
                        plain
                        textAlign="left"
                        icon={PlusIcon}
                      >
                        Add locale
                      </Button>
                    </HorizontalStack>
                  </div>
                </VerticalStack>
              </div>
            </Card>
          </VerticalStack>
        </VerticalStack>
      </div>

      <>
        <Modal id="modalAddTranslation" variant="base">
          <div style={{ padding: "8px" }}>
            <TextField
              value={translation}
              onChange={handleChangeTranslation}
              label="Translation"
              type="email"
              autoComplete="email"
              helpText=""
            />
          </div>
          <TitleBar title="Add Translations">
            <button onClick={() => shopify.modal.hide("modalAddTranslation")}>
              Close
            </button>
            <button onClick={handleAddTranslation} variant="primary">
              Add
            </button>
          </TitleBar>
        </Modal>
      </>
    </>
  );
}
