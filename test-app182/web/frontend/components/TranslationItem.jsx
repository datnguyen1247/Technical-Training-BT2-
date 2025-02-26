import { Badge, HorizontalStack, Text, Button } from "@shopify/polaris";
import { Link } from "react-router-dom";
import DotAction from "./DotAction";

export default function TranslationItem({
  translationTitle,
  defaultTranslation,
  handleDelete,
}) {
  return (
    <div style={{ padding: "16px" }}>
      <HorizontalStack align="space-between">
        <HorizontalStack gap="2">
          <Text variant="headingSm" as="h6">
            {translationTitle}
          </Text>
          {defaultTranslation && <Badge size="small">Default</Badge>}
        </HorizontalStack>
        {defaultTranslation ? (
          <Link to={`/translation/${translationTitle}`}>
            <Button plain>Edit</Button>
          </Link>
        ) : (
          <DotAction
            locale={translationTitle}
            onDeleteTranslation={handleDelete}
          />
        )}
      </HorizontalStack>
    </div>
  );
}
