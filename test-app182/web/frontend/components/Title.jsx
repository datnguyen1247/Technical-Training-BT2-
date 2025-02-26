import { Icon, Text } from "@shopify/polaris";

export default function Title({ title, icon }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text variant="headingMd" as="h4">
        {title}
      </Text>
      <div>
        <Icon source={icon} tone="base" />
      </div>
    </div>
  );
}
