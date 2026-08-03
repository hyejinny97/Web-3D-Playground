export interface Project {
  render: () => void;
  renderLoop: () => void;
  dispose: () => void;
}
