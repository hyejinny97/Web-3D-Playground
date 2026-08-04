export interface Project {
  loop?: boolean;
  render: () => void;
  renderLoop: () => void;
  dispose: () => void;
}
