export default function AutoBinding(
  _: any,
  _2: string,
  descriptor: PropertyDescriptor
) {
  const originalFn = descriptor.value;
  const newDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,

    get() {
      const boundFn = originalFn.bind(this);
      return boundFn;
    },
  };
  return newDescriptor;
}
