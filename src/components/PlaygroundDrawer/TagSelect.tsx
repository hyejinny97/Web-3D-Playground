import { Fragment } from "react";
import Select from "@jinni-labs/ui/Select";
import Option from "@jinni-labs/ui/Option";
import type { OptionValueType } from "@jinni-labs/ui/Option";
import Stack from "@jinni-labs/ui/Stack";
import Chip from "@jinni-labs/ui/Chip";
import { TAGS } from "@/constants/tags";
import useProject from "@/hooks/useProject";
import type { TagType } from "@/types/tags";

const TagSelect = () => {
  const { selectedTags, onTagSelect } = useProject();

  const onChange = (
    _: Event | React.SyntheticEvent,
    value: OptionValueType[],
  ) => {
    onTagSelect(value as TagType[]);
  };

  return (
    <Select
      className="w-full!"
      value={selectedTags}
      onChange={onChange}
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
      {Object.entries(TAGS).map(([value, { label, color }]) => (
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
