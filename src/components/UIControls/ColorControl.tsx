import ControlGrid from "./ControlGrid";
import type { ColorControlType } from "@/types/controls";
import ColorPicker, {
  type HSBObject,
  hsbObjToHex,
} from "@jinni-labs/ui/ColorPicker";
import Text from "@jinni-labs/ui/Text";

const ColorControl = ({ label, initValue, onChange }: ColorControlType) => {
  return (
    <ControlGrid>
      <Text className="typo-label-medium wrap-break-word select-none">
        {label}
      </Text>
      <ColorPicker
        className="col-span-2"
        defaultValue={initValue}
        onChange={(_, value: HSBObject) => {
          const hex = hsbObjToHex(value);
          onChange?.(hex);
        }}
      />
    </ControlGrid>
  );
};

export default ColorControl;
