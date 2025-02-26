import {
  Button,
  ButtonGroup,
  Divider,
  HorizontalStack,
  SkeletonDisplayText,
  SkeletonThumbnail,
  Text,
  VerticalStack,
} from "@shopify/polaris";
import { DesktopIcon, MobileIcon } from "@shopify/polaris-icons";
import { useCallback, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import SkeletonText from "./SkeletonText";
export default function Widget() {
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  const styles = useSelector((state) => state.customize.style, shallowEqual);
  const {
    input_width,
    input_height,
    input_border,
    input_border_radius,
    border_width,
    button_border,
    button_height,
    button_width,
    button_variant,
    input_background_color,
    button_background_color,
    border_color,
    button_text_color,
  } = styles;
  const styleInput = {
    width: `${input_width}px`,
    height: `${input_height}px`,
    borderStyle: `${input_border}`,
    borderRadius: `${input_border_radius}px`,
    backgroundColor: input_background_color,
  };
  const styleButton = {
    borderWidth: `${border_width}px`,
    borderStyle: `${button_border}`,
    width: `${button_width}px`,
    height: `${button_height}px`,
    backgroundColor: button_background_color,
    color: button_text_color,
    borderColor: border_color,
    textTransform: "uppercase",
  };
  const handleButtonClick = useCallback(
    (index) => {
      if (activeButtonIndex === index) return;
      setActiveButtonIndex(index);
    },
    [activeButtonIndex]
  );
  return (
    <div
      style={{
        flex: 1,
        padding: "8px 32px",
      }}
    >
      <HorizontalStack align="center">
        <ButtonGroup segmented>
          <Button
            icon={DesktopIcon}
            pressed={activeButtonIndex === 0}
            onClick={() => handleButtonClick(0)}
          ></Button>
          <Button
            icon={MobileIcon}
            pressed={activeButtonIndex === 1}
            onClick={() => handleButtonClick(1)}
          ></Button>
        </ButtonGroup>
      </HorizontalStack>
      <div style={{ marginTop: "16px" }}>
        <div className="border-header"></div>

        <VerticalStack gap="8">
          <Text variant="headingXl" as="h4">
            Your cart
          </Text>
          <HorizontalStack gap="6">
            <HorizontalStack>
              <SkeletonThumbnail size="large" />
            </HorizontalStack>

            <div style={{ flex: 1 }}>
              <VerticalStack gap="3">
                <SkeletonText />
                <SkeletonDisplayText size="small" />
              </VerticalStack>
            </div>
          </HorizontalStack>
          <HorizontalStack gap="6">
            <HorizontalStack>
              <SkeletonThumbnail size="large" />
            </HorizontalStack>

            <div style={{ flex: 1 }}>
              <VerticalStack gap="3">
                <SkeletonText />
                <SkeletonDisplayText size="small" />
              </VerticalStack>
            </div>
          </HorizontalStack>
          <Divider />
          <VerticalStack inlineAlign="end" gap="8">
            {styles.direction === "horizontal" ? (
              <HorizontalStack gap="2" align="center">
                <input
                  type="text"
                  placeholder="Label"
                  className="input-discount"
                  style={{
                    ...styleInput,
                  }}
                />
                <button
                  style={{
                    ...styleButton,
                  }}
                  className="btn-discount"
                >
                  Label
                </button>
              </HorizontalStack>
            ) : (
              <VerticalStack gap="2" align="center">
                <input
                  type="text"
                  placeholder="Label"
                  className="input-discount"
                  style={{
                    ...styleInput,
                  }}
                />
                <button
                  style={{
                    ...styleButton,
                  }}
                  className="btn-discount"
                >
                  Label
                </button>
              </VerticalStack>
            )}
          </VerticalStack>
        </VerticalStack>
      </div>
    </div>
  );
}
