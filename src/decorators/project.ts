interface ProjectConfigureProps {
  loop?: boolean;
}

export const ProjectConfigure = (props: ProjectConfigureProps = {}) => {
  const { loop = false } = props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function <T extends { new (...args: any[]): object }>(constructor: T) {
    return class extends constructor {
      loop = loop;
    };
  };
};
