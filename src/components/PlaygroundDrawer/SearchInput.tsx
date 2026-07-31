import Autocomplete from "@jinni-labs/ui/Autocomplete";
import AutocompleteOption from "@jinni-labs/ui/AutocompleteOption";
import type { AutocompleteOptionProps } from "@jinni-labs/ui/AutocompleteOption";

type OptionType = Pick<AutocompleteOptionProps, "children" | "label" | "value">;

interface SearchInputProps {
  options: OptionType[];
}

const SearchInput = ({ options }: SearchInputProps) => {
  return (
    <Autocomplete
      className="w-full!"
      placeholder="Search playground title"
      PopperProps={{ style: { width: "251px" } }}
    >
      {options.map(({ children, label, value }) => (
        <AutocompleteOption key={value} label={label} value={value}>
          {children}
        </AutocompleteOption>
      ))}
    </Autocomplete>
  );
};

export default SearchInput;
