import { useState } from "react";
import type { CheckboxControlType } from "@/types/controls";
import Label from "@jinni-labs/ui/Label";
import Checkbox from "@jinni-labs/ui/Checkbox";
import Text from "@jinni-labs/ui/Text";

const CheckboxControl = ({
  label,
  initChecked,
  onChange,
}: CheckboxControlType) => {
  const [checked, setChecked] = useState<boolean>(initChecked ?? false);

  return (
    <Label content={<Text className="typo-label-small">{label}</Text>}>
      <Checkbox
        checked={checked}
        onChange={(e) => {
          const { checked } = e.target;
          setChecked(checked);
          onChange?.(checked);
        }}
        size="sm"
      />
    </Label>
  );
};

export default CheckboxControl;
