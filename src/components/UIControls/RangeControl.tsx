import ControlGrid from "./ControlGrid";
import Text from "@jinni-labs/ui/Text";
import Slider from "@jinni-labs/ui/Slider";
import NumberInput from "@jinni-labs/ui/NumberInput";
import type { RangeControlType } from "@/types/controls";
import { useState } from "react";

const RangeControl = ({
  label,
  min = 1,
  max = 5,
  step = 1,
  marks = false,
  initValue = min,
  onChange,
}: RangeControlType) => {
  const [value, setValue] = useState<number>(initValue);

  return (
    <ControlGrid>
      <Text className="typo-label-medium wrap-break-word select-none">
        {label}
      </Text>
      <Slider
        value={value}
        onChange={(_, val) => {
          const newValue = val as number;
          setValue(newValue);
          onChange?.(newValue);
        }}
        min={min}
        max={max}
        step={step}
        size="md"
        marks={marks}
      />
      <NumberInput
        className="min-w-full! w-full! [&_input]:px-2.5!"
        value={value}
        onChange={(_, val) => {
          const newValue = val as number;
          setValue(newValue);
          onChange?.(newValue);
        }}
        min={min}
        max={max}
        step={step}
        size="sm"
      />
    </ControlGrid>
  );
};

export default RangeControl;
