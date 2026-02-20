import { Project as SelectedProject } from "./index.js";

const ProjectProxy = new Proxy(SelectedProject, {
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver);
  },
});

export default ProjectProxy;
