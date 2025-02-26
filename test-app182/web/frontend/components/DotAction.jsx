import { ActionList, Icon, Popover } from "@shopify/polaris";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";

import { MenuHorizontalIcon } from "@shopify/polaris-icons";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function DotAction({ onDeleteTranslation, locale }) {
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const navigation = useNavigate();
  const shopify = useAppBridge();

  const handleClickDelete = () => {
    console.log(locale);
    onDeleteTranslation(locale);
    handleCloseModal();
  };
  const activator = (
    <div style={{ padding: "1px" }} onClick={toggleActive}>
      <Icon source={MenuHorizontalIcon} tone="base" />
    </div>
  );
  const handleCloseModal = () => {
    shopify.modal.hide("modalRemoveTranslation");
  };
  const navigateToEditPage = () => {
    navigation(`/translation/${locale}`);
  };
  return (
    <div>
      <Popover
        active={active}
        activator={activator}
        autofocusTarget="first-node"
        onClose={toggleActive}
      >
        <ActionList
          actionRole="menuitem"
          items={[
            { content: "Edit", onAction: navigateToEditPage },
            {
              content: "Delete",
              destructive: true,
              onAction: () => {
                shopify.modal.show("modalRemoveTranslation");
              },
            },
          ]}
        />
      </Popover>
      <Modal id="modalRemoveTranslation" variant="base">
        <div style={{ padding: "8px" }}>This can’t be undone.</div>
        <TitleBar title="Remove 1 translation?">
          <button onClick={handleCloseModal}>Cancel</button>
          <button onClick={handleClickDelete} variant="primary">
            Delete
          </button>
        </TitleBar>
      </Modal>
    </div>
  );
}
