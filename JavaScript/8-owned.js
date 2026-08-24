'use strict';

class Resource {
  #name = '';

  constructor(name) {
    this.#name = name;
  }

  read() {
    console.log(`Read: ${this.#name}`);
  }

  [Symbol.dispose]() {
    console.log(`Dispose: ${this.#name}`);
  }
}

class Owned {
  #resource = null;
  #state = 'owned';

  constructor(resource) {
    this.#resource = resource;
  }

  use(operation) {
    if (this.#state !== 'owned') {
      throw new ReferenceError(`Resource is ${this.#state}`);
    }
    return operation(this.#resource);
  }

  [Symbol.dispose]() {
    if (this.#state !== 'owned') return;
    const resource = this.#resource;
    this.#resource = null;
    this.#state = 'disposed';
    resource?.[Symbol.dispose]?.();
  }
}

const main = () => {
  const resource = new Resource('socket');
  using owner = new Owned(resource);
  const read = (value) => value.read();
  owner.use(read);
};

main();
