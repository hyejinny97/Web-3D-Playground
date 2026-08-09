import Drawer from "@jinni-labs/ui/Drawer";
import DrawerHeader from "@jinni-labs/ui/DrawerHeader";
import DrawerBody from "@jinni-labs/ui/DrawerBody";
import Text from "@jinni-labs/ui/Text";
import Stack from "@jinni-labs/ui/Stack";
import { DRAWER_WIDTH } from "@/constants/drawer";
import CloseDrawerButton from "./CloseDrawerButton";
import SearchInput from "./SearchInput";
import TagSelect from "./TagSelect";
import ProjectAccordion from "./ProjectAccordion";

interface PlaygroundDrawerProps {
  open: boolean;
  onClose: () => void;
}

const PlaygroundDrawer = ({ open, onClose }: PlaygroundDrawerProps) => {
  return (
    <Drawer
      open={open}
      variant="persistent"
      anchorOrigin="right"
      className="[&>.JinniDrawerContent]:bg-(--jinni-color-surface) [&>.JinniDrawerContent]:overflow-hidden"
      style={{
        width: `${DRAWER_WIDTH}px`,
      }}
    >
      <DrawerHeader className="flex items-center gap-2.5 px-4!">
        <CloseDrawerButton onClick={onClose} />
        <Text as="h1" className="typo-headline-medium">
          3D Playground
        </Text>
      </DrawerHeader>
      <DrawerBody className="py-2! overflow-hidden px-4!">
        <Stack className="h-full overflow-hidden" spacing={16}>
          <Stack className="px-2 py-1" spacing={8}>
            <SearchInput />
            <TagSelect />
          </Stack>
          <article className="flex-1 overflow-y-auto">
            <ProjectAccordion />
          </article>
        </Stack>
      </DrawerBody>
    </Drawer>
  );
};

export default PlaygroundDrawer;
