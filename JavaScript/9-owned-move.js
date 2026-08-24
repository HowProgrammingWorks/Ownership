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

  #assertOwned() {
    if (this.#state !== 'owned') {
      throw new ReferenceError(`Resource is ${this.#state}`);
    }
  }

  use(operation) {
    this.#assertOwned();
    return operation(this.#resource);
  }

  move() {
    this.#assertOwned();
    const next = new Owned(this.#resource);
    this.#resource = null;
    this.#state = 'moved';
    return next;
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
  using first = new Owned(resource);
  const read = (value) => value.read();
  first.use(read);

  using second = first.move();
  second.use(read);

  try {
    first.use(read);
  } catch (error) {
    console.log(error.message);
  }
};

main();
