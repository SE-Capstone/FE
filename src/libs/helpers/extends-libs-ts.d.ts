/* eslint-disable no-extend-native */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Array<T> {
    isEmpty(): boolean;
  }
}

if (!Array.prototype.isEmpty) {
  Object.defineProperty(Array.prototype, 'isEmpty', {
    enumerable: false,
    writable: false,
    configurable: false,
    value(): boolean {
      return !this || !Array.isArray(this) || this.length === 0;
    },
  });
}

export {};
