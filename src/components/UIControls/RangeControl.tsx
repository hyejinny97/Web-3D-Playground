import Grid from "@jinni-labs/ui/Grid";
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
  initValue,
  onChange,
}: RangeControlType) => {
  const [value, setValue] = useState<number>(initValue ?? 0);

  return (
    <Grid
      className="w-full grid-cols-[1fr_minmax(120px,120px)_1fr]! items-center"
      columns={3}
      columnSpacing={8}
    >
      <Text className="typo-label-medium">{label}</Text>
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
        marks
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
    </Grid>
  );
};

export default RangeControl;
