import ControlGrid from "./ControlGrid";
import type { PlainTextControlType } from "@/types/controls";
import Text from "@jinni-labs/ui/Text";

const PlainTextControl = ({ label, content }: PlainTextControlType) => {
  return (
    <ControlGrid>
      <Text className="typo-label-medium wrap-break-word select-none">
        {label}
      </Text>
      <Text className="col-span-2 typo-label-small text-(--jinni-color-gray-600)!">
        {content}
      </Text>
    </ControlGrid>
  );
};

export default PlainTextControl;
