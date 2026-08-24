'use strict';

class Resource {
  #name = undefined;

  constructor(name) {
    this.#name = name;
  }

  use() {
    console.log(`Use: ${this.#name}`);
  }
}

class Lease {
  #resource = null;
  #release = null;

  constructor(resource, release) {
    this.#resource = resource;
    this.#release = release;
  }

  use() {
    if (!this.#resource) throw new ReferenceError('Lease expired');
    this.#resource.use();
  }

  [Symbol.dispose]() {
    if (!this.#resource) return;
    const resource = this.#resource;
    this.#resource = null;
    this.#release(resource);
  }
}

const resource = new Resource('connection');
const release = () => console.log('Return to pool');

const main = () => {
  using lease = new Lease(resource, release);
  lease.use();
};

main();
