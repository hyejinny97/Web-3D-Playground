import useControl from "@/hooks/useControl";
import Box, { type BoxProps } from "@jinni-labs/ui/Box";
import Accordion from "@jinni-labs/ui/Accordion";
import AccordionItem from "@jinni-labs/ui/AccordionItem";
import AccordionSummary from "@jinni-labs/ui/AccordionSummary";
import AccordionDetails from "@jinni-labs/ui/AccordionDetails";
import List from "@jinni-labs/ui/List";
import ListItem from "@jinni-labs/ui/ListItem";
import type { ControlType } from "@/types/controls";
import RangeControl from "./RangeControl";
import CheckboxControl from "./CheckboxControl";
import PlainTextControl from "./PlainTextControl";

const UIControls = (props: BoxProps) => {
  const { controls } = useControl();

  const getControlByType = (control: ControlType) => {
    switch (control.type) {
      case "range":
        return <RangeControl {...control} />;
      case "checkbox":
        return <CheckboxControl {...control} />;
      case "plain-text":
        return <PlainTextControl {...control} />;
    }
  };

  if (controls.size === 0) return null;

  return (
    <Box
      className="absolute top-3.75 left-3.75 px-3 py-1.5 bg-(--jinni-color-surface-container-lowest)"
      round="sm"
      elevation={5}
      {...props}
    >
      <Accordion className="min-w-75 w-75 max-h-[80vh] overflow-y-auto">
        {[...controls].map(([groupName, controls]) => (
          <AccordionItem key={groupName} defaultExpanded>
            <AccordionSummary className="typo-title-small p-2!">
              {groupName}
            </AccordionSummary>
            <AccordionDetails className="p-0!">
              <List className="p-0!">
                {controls.map((control) => (
                  <ListItem key={control.label} className="p-1!">
                    {getControlByType(control)}
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export default UIControls;
