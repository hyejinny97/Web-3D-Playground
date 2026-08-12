import { ALL_PROJECTS, BASIC_PROJECT } from "@/constants/projects";
import useProject from "@/hooks/useProject";
import Autocomplete from "@jinni-labs/ui/Autocomplete";
import AutocompleteOption from "@jinni-labs/ui/AutocompleteOption";
import { useState } from "react";

const SearchInput = () => {
  const {
    searchValue,
    onSearchValueChange,
    searchInputValueCleared,
    onSearchInputValueChange,
  } = useProject();
  const [inputValue, setInputValue] = useState<string>("");

  return (
    <Autocomplete
      className="w-full!"
      mode="free"
      inputValue={searchInputValueCleared ? "" : inputValue}
      onInputChange={(_, inputValue) => {
        onSearchInputValueChange();
        setInputValue(inputValue);
      }}
      value={searchValue}
      onChange={(_, value) => onSearchValueChange(value as string | null)}
      onClose={(event) => {
        const { target } = event;
        if (!target) return;

        const isOptionClicked = !!(target as HTMLElement).closest(
          ".JinniAutocompleteOption",
        );
        if (isOptionClicked || inputValue === searchValue) return;

        onSearchValueChange(inputValue);
      }}
      placeholder="Search playground title"
      PopperProps={{ style: { width: "251px" } }}
    >
      {ALL_PROJECTS.map(
        ({ id, title }) =>
          id !== BASIC_PROJECT.id && (
            <AutocompleteOption key={id} label={title} value={title}>
              {title}
            </AutocompleteOption>
          ),
      )}
    </Autocomplete>
  );
};

export default SearchInput;
