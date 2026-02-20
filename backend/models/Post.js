import { Post as SelectedPost } from "./index.js";

const PostProxy = new Proxy(SelectedPost, {
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver);
  },
});

export default PostProxy;
