import { Divider } from "@shopify/polaris";
import { CaretDownIcon, CaretUpIcon } from "@shopify/polaris-icons";
import { useCallback, useState } from "react";
import Title from "./Title";

export default function Property({ children, title }) {
  const [popoverActive, setPopoverActive] = useState(true);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  const activator = (
    <div
      style={{
        cursor: "pointer",
        width: "100%",
        padding: `16px 16px ${popoverActive ? "0" : "16px"} 16px`,
      }}
      onClick={togglePopoverActive}
    >
      <Title title={title} icon={popoverActive ? CaretUpIcon : CaretDownIcon} />
    </div>
  );

  return (
    <>
      {activator}
      {popoverActive && (
        <div
          style={{
            padding: "16px",
          }}
        >
          {children}
        </div>
      )}
      <Divider />
    </>
  );
}
