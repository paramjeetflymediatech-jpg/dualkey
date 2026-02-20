import { ProjectAccess as SelectedProjectAccess } from "./index.js";

const ProjectAccess = new Proxy(SelectedProjectAccess, {
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver);
  },
});

export default ProjectAccess;
