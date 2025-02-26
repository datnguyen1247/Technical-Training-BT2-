import { TitleBar } from "@shopify/app-bridge-react";
import {
  Box,
  HorizontalStack,
  RadioButton,
  RangeSlider,
  VerticalStack,
  Select,
  TextField,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import CircleBorder from "../components/CirleColor";
import Property from "../components/Property";
import TextFieldNumber from "../components/TextFieldNumber";
import { DATA_BORDER_TYPE, DATA_BUTTON_TYPE } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataCustomize, updateCustomize } from "../slices/customizeSlice";
import Widget from "../components/Widget";
import customizationApi from "../apis/customizationApi.JS";

export default function CustomizationPage() {
  const styles = useSelector((state) => state.customize.style);
  const dispatch = useDispatch();
  const [activeToast, setActiveToast] = useState(false);
  const [inputBorderType, setInputBorderType] = useState(styles.input_border);
  const [btnBorderType, setBtnBorderType] = useState(styles.button_border);
  const [btnType, setBtnType] = useState(styles.button_variant);
  const [layout, setLayout] = useState(styles.direction);
  const [cssCustom, setCssCustom] = useState(styles.css);
  const [inputBorderRadius, setInputBorderRadius] = useState(
    () => styles.input_border_radius
  );
  const [buttonBorderWidth, setButtonBorderWidth] = useState(
    () => styles.input_border_radius
  );
  useEffect(() => {
    dispatch(fetchDataCustomize());
  }, []);
  useEffect(() => {
    setInputBorderType(styles.input_border);
    setBtnBorderType(styles.button_border);
    setInputBorderRadius(styles.input_border_radius);
    setButtonBorderWidth(styles.border_width);
    setBtnType(styles.button_variant);
    setLayout(styles.direction);
    setCssCustom(styles.css);
  }, [styles]);

  const handleSelectChange = useCallback(
    (value) => {
      const border = DATA_BORDER_TYPE.find((item) => item.title === value);
      if (border) {
        setInputBorderType(border.title);
        dispatch(updateCustomize({ input_border: border.value }));
      }
    },
    [dispatch]
  );

  const handleSelectChangeTypeBtn = useCallback(
    (value) => {
      const buttonType = DATA_BUTTON_TYPE.find((item) => item.title === value);
      if (buttonType) {
        setBtnType(buttonType.title);
        dispatch(updateCustomize({ button_variant: buttonType.value }));
      }
    },
    [dispatch]
  );
  const handleChangeLayout = useCallback(
    (_, newValue) => {
      console.log(newValue);
      setLayout(newValue);
      dispatch(updateCustomize({ direction: newValue }));
    },
    [dispatch]
  );
  const handleSelectChangeBtnBorder = useCallback(
    (value) => {
      const border = DATA_BORDER_TYPE.find((item) => item.title === value);
      if (border) {
        setBtnBorderType(border.title);
        dispatch(updateCustomize({ button_border: border.value }));
      }
    },
    [dispatch]
  );
  const handleSave = async () => {
    await fetch("/api/update-entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fieldKey: "customization",
        newValue: { ...styles },
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Updated metaobject:", data))
      .catch((err) => console.error("Error:", err));
    await customizationApi.save({ ...styles });
  };
  return (
    <>
      <TitleBar>
        <button onClick={handleSave} variant="primary">
          Save
        </button>
      </TitleBar>
      <HorizontalStack>
        <Box width="410px" paddingBlockEnd="300" background="bg-fill-active">
          {/* Discount box size */}
          <Property title="Discount box size">
            <HorizontalStack wrap={false} align="center" gap="2">
              <TextFieldNumber type="input_height" label="Box height" />
              <TextFieldNumber type="input_width" label="Box width" />
            </HorizontalStack>
          </Property>
          {/* Discount box border */}
          <Property title="Discount box border">
            {/* <CircleBorder title="Border color" /> */}
            <div
              style={{
                margin: "16px 0",
              }}
            >
              <Select
                label="Border style"
                options={DATA_BORDER_TYPE.map((item) => item.title)}
                value={
                  inputBorderType.charAt(0).toUpperCase() +
                  inputBorderType.slice(1)
                }
                onChange={handleSelectChange}
              />
            </div>
            <RangeSlider
              output
              label="Border radius"
              min={0}
              max={10}
              value={inputBorderRadius}
              onChange={(e) => {
                setInputBorderRadius(e);
                dispatch(updateCustomize({ input_border_radius: e }));
              }}
              suffix={
                <p
                  style={{
                    minWidth: "24px",
                    textAlign: "right",
                  }}
                >
                  10px
                </p>
              }
            />
          </Property>

          {/* Discount box color */}
          <Property title="Discount box color">
            <CircleBorder
              type="input_background_color"
              title="Discount box color"
            />
          </Property>

          {/* Button */}

          <Property title="Button">
            <Select
              label="Button type"
              onChange={handleSelectChangeTypeBtn}
              options={DATA_BUTTON_TYPE.map((item) => item.title)}
              value={btnType.charAt(0).toUpperCase() + btnType.slice(1)}
            />
            <div style={{ marginTop: "16px" }}>
              <HorizontalStack wrap={false} align="center" gap="4">
                <TextFieldNumber type="button_width" label="Button width" />
                <TextFieldNumber type="button_height" label="Button height" />
              </HorizontalStack>
            </div>
            <CircleBorder
              type="button_background_color"
              className={{ marginTop: "16px" }}
              title="Button color"
            />
            <CircleBorder
              type="button_text_color"
              className={{ marginTop: "16px" }}
              title="Text color"
            />
            <div
              style={{
                margin: "16px 0",
              }}
            >
              <Select
                label="Border style"
                options={DATA_BORDER_TYPE.map((item) => item.title)}
                onChange={handleSelectChangeBtnBorder}
                value={
                  btnBorderType.charAt(0).toUpperCase() + btnBorderType.slice(1)
                }
              />
            </div>
            <RangeSlider
              output
              label="Border width"
              min={0}
              max={10}
              value={buttonBorderWidth}
              onChange={(e) => {
                setButtonBorderWidth(e);
                dispatch(updateCustomize({ border_width: e }));
              }}
              suffix={
                <p
                  style={{
                    minWidth: "24px",
                    textAlign: "right",
                  }}
                >
                  10px
                </p>
              }
            />
            <CircleBorder
              type="border_color"
              className={{ marginTop: "16px" }}
              title="Border color"
            />
          </Property>

          {/* Layout */}
          <Property title="Layout">
            <VerticalStack align="start">
              <RadioButton
                label="Vertical"
                checked={layout === "vertical"}
                id="vertical"
                name="vertical"
                onChange={handleChangeLayout}
              />
              <RadioButton
                label="Horizontal"
                checked={layout === "horizontal"}
                id="horizontal"
                name="horizontal"
                onChange={handleChangeLayout}
              />
            </VerticalStack>
          </Property>

          {/* Custom CSS */}
          <Property title="Custom CSS">
            <div style={{ width: "100%" }}>
              <TextField
                value={cssCustom}
                label=""
                multiline={4}
                onChange={(e) => {
                  setCssCustom(e);
                  dispatch(updateCustomize({ css: e }));
                }}
                autoComplete="off"
              />
            </div>
          </Property>
        </Box>
        <Widget />
      </HorizontalStack>
    </>
  );
}
