import { Fragment } from "react";
import Select from "@jinni-labs/ui/Select";
import Option from "@jinni-labs/ui/Option";
import Stack from "@jinni-labs/ui/Stack";
import Chip from "@jinni-labs/ui/Chip";
import type { TagType } from "@/types/tag";

interface OptionType {
  value: string;
  tag: TagType;
}

interface TagSelectProps {
  options: OptionType[];
}

const TagSelect = ({ options }: TagSelectProps) => {
  return (
    <Select
      className="w-full!"
      multiple
      variant="underlined"
      placeholder="Select Tags"
      MenuProps={{ style: { width: "251px" } }}
      renderValue={(selectedOptions) => (
        <Stack
          direction="row"
          spacing={5}
          style={{
            width: "100%",
            overflow: "visible",
            flexWrap: "wrap",
          }}
        >
          {selectedOptions.map(({ value, label }) => (
            <Fragment key={value}>{label}</Fragment>
          ))}
        </Stack>
      )}
    >
      {options.map(({ value, tag: { label, color } }) => (
        <Option key={value} value={value}>
          <Chip
            className="typo-label-small"
            variant="filled"
            shape="rounded"
            size="sm"
            color={color}
          >
            {label}
          </Chip>
        </Option>
      ))}
    </Select>
  );
};

export default TagSelect;
