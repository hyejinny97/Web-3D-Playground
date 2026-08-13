import ControlGrid from "./ControlGrid";
import type { TextInputControlType } from "@/types/controls";
import Input from "@jinni-labs/ui/Input";
import Text from "@jinni-labs/ui/Text";

const TextInputControl = ({
  label,
  initValue,
  onChange,
}: TextInputControlType) => {
  return (
    <ControlGrid>
      <Text className="typo-label-medium wrap-break-word select-none">
        {label}
      </Text>
      <Input
        className="col-span-2 min-w-0! w-full!"
        type="text"
        defaultValue={initValue}
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
        size="sm"
      />
    </ControlGrid>
  );
};

export default TextInputControl;
