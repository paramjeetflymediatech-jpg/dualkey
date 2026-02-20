import { User as SelectedUser, dbType } from "./index.js";

const UserWrapper = {
  // Delegate all static properties
  ...SelectedUser,

  // Example wrapper method if strict compatibility is needed
  // specific methods would go here
};

// If we need to proxy everything
const UserProxy = new Proxy(SelectedUser, {
  get(target, prop, receiver) {
    // We could intercept calls here to normalize API
    // For now, we rely on the controllers being aware or using common subset/adapter
    // But since the user asked for "code for both", exposing the selected model is key.
    return Reflect.get(target, prop, receiver);
  },
});

export default UserProxy;
