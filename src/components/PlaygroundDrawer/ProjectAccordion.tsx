import Chip from "@jinni-labs/ui/Chip";
import Accordion from "@jinni-labs/ui/Accordion";
import AccordionItem from "@jinni-labs/ui/AccordionItem";
import AccordionSummary from "@jinni-labs/ui/AccordionSummary";
import AccordionDetails from "@jinni-labs/ui/AccordionDetails";
import Box from "@jinni-labs/ui/Box";
import Card from "@jinni-labs/ui/Card";
import CardBody from "@jinni-labs/ui/CardBody";
import CheckmarkIcon from "@/components/icons/CheckmarkIcon";
import Text from "@jinni-labs/ui/Text";
import Stack from "@jinni-labs/ui/Stack";
import type { TagType } from "@/types/tag";
import { ButtonBase } from "@jinni-labs/ui";

interface ProjectType {
  id: number;
  title: string;
  imageUrl: string;
  tags: TagType[];
}

interface AccordionItemType {
  title: string;
  projects: ProjectType[];
}

interface ProjectAccordionProps {
  items: AccordionItemType[];
  selectedProjectId: number | null;
  onProjectClicked: (projectId: number) => void;
}

const ProjectAccordion = ({
  items,
  selectedProjectId,
  onProjectClicked,
}: ProjectAccordionProps) => {
  return (
    <Accordion>
      {items.map(({ title, projects }) => (
        <AccordionItem key={title}>
          <AccordionSummary>
            <Stack className="justify-between items-center" direction="row">
              <Text className="typo-headline-small">{title}</Text>
              <Chip
                className="h-[20px]! [&>.JinniChipLabel]:mx-[8px]!"
                variant="subtle-filled"
              >
                {projects.length}
              </Chip>
            </Stack>
          </AccordionSummary>
          <AccordionDetails className="pt-[8px]!">
            <Stack spacing={12}>
              {projects.map(({ id, title, imageUrl, tags }) => (
                <Card
                  key={id}
                  as={ButtonBase}
                  className="bg-(--jinni-color-surface-bright)! overflow-hidden rounded-(--jinni-round-xs)!"
                  elevation={3}
                  onClick={onProjectClicked}
                >
                  <CardBody className="p-0!">
                    <Box className="relative w-full h-[100px] bg-(--jinni-color-gray-900)">
                      <img src={imageUrl} alt={title} />
                      {selectedProjectId === id && (
                        <CheckmarkIcon className="absolute top-[5px] left-[5px] fill-white" />
                      )}
                    </Box>
                    <Stack
                      className="px-[12px]! py-[8px]! items-start"
                      spacing={3}
                    >
                      <Text className="typo-title-medium">{title}</Text>
                      <Stack className="flex-wrap" direction="row" spacing={3}>
                        {tags.map(({ label, color }) => (
                          <Chip
                            className="typo-label-small w-max"
                            size="sm"
                            variant="filled"
                            shape="rounded"
                            color={color}
                          >
                            {label}
                          </Chip>
                        ))}
                      </Stack>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </Stack>
          </AccordionDetails>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ProjectAccordion;
