import { Inquiry as SelectedInquiry } from "./index.js";

const InquiryProxy = new Proxy(SelectedInquiry, {
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver);
  },
});

export default InquiryProxy;
