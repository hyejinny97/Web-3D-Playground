import ControlGrid from "./ControlGrid";
import type { SelectControlType } from "@/types/controls";
import Select from "@jinni-labs/ui/Select";
import Option from "@jinni-labs/ui/Option";
import Text from "@jinni-labs/ui/Text";

const SelectControl = ({
  label,
  options,
  initValue,
  onChange,
}: SelectControlType) => {
  return (
    <ControlGrid>
      <Text className="typo-label-medium wrap-break-word select-none">
        {label}
      </Text>
      <Select
        className="col-span-2 min-w-0! w-full!"
        defaultValue={initValue}
        onChange={(_, value) => {
          onChange?.(value as string);
        }}
        size="sm"
      >
        {options.map(({ label, value }) => (
          <Option key={value} value={value}>
            {label}
          </Option>
        ))}
      </Select>
    </ControlGrid>
  );
};

export default SelectControl;
