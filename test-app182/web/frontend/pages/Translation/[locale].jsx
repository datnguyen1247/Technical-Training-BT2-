import {
  Button,
  Card,
  Divider,
  Frame,
  Icon,
  Text,
  TextField,
  HorizontalStack,
  VerticalStack,
  Grid,
} from "@shopify/polaris";
import { ArrowLeftIcon } from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Toast } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import translationApi from "../../apis/translationApi";

export default function EditTranslation() {
  const app = useAppBridge();
  const { locale } = useParams();
  const [transition, setTransition] = useState({});
  const [translate, setTranslate] = useState({
    placeholder_text: "",
    button_text: "",
  });
  const [activeToast, setActiveToast] = useState(false);
  const toggleActiveToast = useCallback(
    () => setActiveToast((activeToast) => !activeToast),
    []
  );
  useEffect(() => {
    const getTransition = async () => {
      if (locale) {
        const response = await translationApi.getOne(locale);
        setTransition(response.data);
        setTranslate(response.data.translate);
      }
    };
    getTransition();
  }, [locale]);
  const handelClickSave = async () => {
    const dataUpdate = { ...transition, translate: translate };
    await translationApi.save(dataUpdate);
    await fetch("/api/update-entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fieldKey: "translation",
        newValue: { ...dataUpdate },
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Updated metaobject:", data))
      .catch((err) => console.error("Error:", err));
    toggleActiveToast();
  };
  return (
    <div className="transition-wrapper">
      <VerticalStack gap="8">
        <VerticalStack>
          <HorizontalStack align="space-between">
            <HorizontalStack align="center" gap="1">
              <Link style={{ marginTop: "3px" }} to="/translation">
                <Icon source={ArrowLeftIcon} />
              </Link>
              <Text variant="headingLg" as="h5">
                Edit {locale} text
              </Text>
            </HorizontalStack>
            <HorizontalStack>
              <Button primary onClick={handelClickSave}>
                Save
              </Button>
            </HorizontalStack>
          </HorizontalStack>
          <Text as="p" fontWeight="regular">
            Edit and translate every texts into your desired language
          </Text>
        </VerticalStack>
        <VerticalStack>
          <Card>
            <VerticalStack gap="4">
              <div style={{ padding: "16px 16px 0 16px" }}>
                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 9, lg: 9, xl: 6 }}>
                    <Text as="h2" variant="headingSm">
                      Text
                    </Text>
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 6 }}>
                    <Button fullWidth plain textAlign="right">
                      Reset to default
                    </Button>
                  </Grid.Cell>
                </Grid>
              </div>
              <Divider />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "160px",
                  padding: "0 16px ",
                }}
              >
                <Text as="p" fontWeight="regular">
                  Discount box placeholder text
                </Text>
                <div style={{ flex: 1, maxWidth: "60%" }}>
                  <TextField
                    label="Gift cards expire after"
                    type="text"
                    labelHidden
                    autoComplete="off"
                    onChange={(e) => {
                      setTranslate((prev) => {
                        return { ...prev, placeholder_text: e };
                      });
                    }}
                    value={translate.placeholder_text}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "160px",
                  padding: "16px",
                }}
              >
                <div style={{ minWidth: "185px" }}>
                  <Text as="p" fontWeight="regular">
                    Button text
                  </Text>
                </div>
                <div style={{ flex: 1, maxWidth: "60%" }}>
                  <TextField
                    label="Gift cards expire after"
                    type="text"
                    labelHidden
                    autoComplete="off"
                    onChange={(e) => {
                      setTranslate((prev) => {
                        return { ...prev, button_text: e };
                      });
                    }}
                    value={translate.button_text}
                  />
                </div>
              </div>
            </VerticalStack>
          </Card>
        </VerticalStack>
      </VerticalStack>
      {activeToast ? (
        <>
          <Frame>
            <Toast
              content="Edit success"
              onDismiss={toggleActiveToast}
              duration={4500}
            />
          </Frame>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
