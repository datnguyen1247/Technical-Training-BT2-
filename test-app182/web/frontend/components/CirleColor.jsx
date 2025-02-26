import { ColorPicker, Popover, Text } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { hexToHsb, hsbToHex } from "../utils/color";
import { updateCustomize } from "../slices/customizeSlice";

export default function CircleBorder({ title, className = {}, type }) {
  const classStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    gap: "8px",
    ...className,
  };
  const styles = useSelector((state) => state.customize.style, shallowEqual);
  const dispatch = useDispatch();
  const [popoverActive, setPopoverActive] = useState(false);
  const [color, setColor] = useState(() => hexToHsb(styles[type]));

  const togglePopoverActive = useCallback(() => {
    setPopoverActive((popoverActive) => !popoverActive);
  }, []);
  const handleColorChange = (e) => {
    setColor(e);
    const resultColor = hsbToHex(e.hue, e.saturation, e.brightness);
    dispatch(updateCustomize({ [`${type}`]: resultColor }));
  };

  const activator = (
    <div style={classStyle}>
      <div
        style={{
          width: "34px",
          height: "34px",
          backgroundColor: `${styles[type]}`,
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: "#D3D2CD",
          borderRadius: "100%",
          position: "relative",
        }}
        onClick={togglePopoverActive}
      ></div>
      <Text tone="subdued" fontWeight="regular" as="p">
        <span style={{ color: "#303030" }}>{title}</span>
      </Text>
    </div>
  );

  return (
    <Popover
      active={popoverActive}
      activator={activator}
      autofocusTarget="first-node"
      onClose={togglePopoverActive}
      preferredAlignment="left"
    >
      <div style={{ padding: "10px" }}>
        <ColorPicker
          onChange={handleColorChange}
          color={color}
          allowAlpha={false}
        />
      </div>
    </Popover>
  );
}
