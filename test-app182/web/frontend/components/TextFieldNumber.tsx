import { TextField } from "@shopify/polaris";
import getStyleValue from "../hooks/useTypedSelector";
import { useDispatch } from "react-redux";
import { updateCustomize } from "../slices/customizeSlice";

export default function TextFieldNumber({ label, type }) {
  const inputHeight = getStyleValue(type);
  const dispatch = useDispatch();
  return (
    <TextField
      label={label}
      onChange={(e) => {
        dispatch(updateCustomize({ [type]: e }));
      }}
      type="number"
      value={inputHeight}
      autoComplete="off"
    />
  );
}
