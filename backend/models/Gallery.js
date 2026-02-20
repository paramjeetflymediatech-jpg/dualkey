import { Gallery as SelectedGallery } from "./index.js";

const GalleryProxy = new Proxy(SelectedGallery, {
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver);
  },
});

export default GalleryProxy;
