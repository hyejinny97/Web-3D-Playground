import { useState } from "react";
import ControlGrid from "./ControlGrid";
import type { CheckboxControlType } from "@/types/controls";
import Checkbox from "@jinni-labs/ui/Checkbox";
import Text from "@jinni-labs/ui/Text";

const CheckboxControl = ({
  label,
  initChecked,
  onChange,
}: CheckboxControlType) => {
  const [checked, setChecked] = useState<boolean>(initChecked ?? false);

  return (
    <ControlGrid>
      <Text className="typo-label-small">{label}</Text>
      <Checkbox
        className="col-span-2"
        checked={checked}
        onChange={(e) => {
          const { checked } = e.target;
          setChecked(checked);
          onChange?.(checked);
        }}
        size="sm"
      />
    </ControlGrid>
  );
};

export default CheckboxControl;
