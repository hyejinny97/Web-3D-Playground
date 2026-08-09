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
import ButtonBase from "@jinni-labs/ui/ButtonBase";
import useProject from "@/hooks/useProject";

const ProjectAccordion = () => {
  const { selectedProjectId, onProjectSelect, projectsDisplayed } =
    useProject();

  return (
    <Accordion>
      {projectsDisplayed.map(({ domain, projects }) => (
        <AccordionItem key={domain} defaultExpanded>
          <AccordionSummary>
            <Stack className="justify-between items-center" direction="row">
              <Text className="typo-headline-small">{domain}</Text>
              <Chip
                className="h-5! [&>.JinniChipLabel]:mx-2!"
                variant="subtle-filled"
              >
                {projects.length}
              </Chip>
            </Stack>
          </AccordionSummary>
          <AccordionDetails className="pt-2!">
            <Stack spacing={12}>
              {projects.map(({ id, title, imageUrl, tags }) => (
                <Card
                  key={id}
                  as={ButtonBase}
                  className="bg-(--jinni-color-surface-bright)! overflow-hidden rounded-(--jinni-round-xs)!"
                  elevation={3}
                  onClick={() => onProjectSelect(id)}
                >
                  <CardBody className="p-0!">
                    <Box className="relative w-full h-30 bg-black">
                      <img
                        className="max-w-full h-full object-contain mx-auto"
                        src={imageUrl}
                        alt={title}
                        loading="lazy"
                      />
                      {selectedProjectId === id && (
                        <CheckmarkIcon className="absolute top-1.25 left-1.25 fill-white" />
                      )}
                    </Box>
                    <Stack className="px-3! py-2! items-start" spacing={3}>
                      <Text className="typo-title-medium">{title}</Text>
                      <Stack className="flex-wrap" direction="row" spacing={3}>
                        {tags.map(({ label, color }) => (
                          <Chip
                            key={label}
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
