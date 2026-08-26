'use strict';

class Resource {
  #name = undefined;

  constructor(name) {
    this.#name = name;
  }

  read() {
    console.log(`Read: ${this.#name}`);
  }
}

const weak = (() => {
  const resource = new Resource('cache');
  const ref = new WeakRef(resource);
  ref.deref()?.read();
  return ref;
})();

console.log('WeakRef does not keep the resource alive');
console.log('Collection time is intentionally nondeterministic');
console.log('deref:', weak.deref() ? 'alive' : 'collected');
