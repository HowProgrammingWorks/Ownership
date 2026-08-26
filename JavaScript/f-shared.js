'use strict';

class Resource {
  #name = undefined;

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

class Shared {
  #resource = null;
  #count = 0;
  #closed = false;

  constructor(resource) {
    this.#resource = resource;
  }

  #tryDispose() {
    if (!this.#closed || this.#count !== 0) return;
    this.#resource[Symbol.dispose]();
    this.#resource = null;
  }

  acquire() {
    if (this.#closed) throw new ReferenceError('Shared owner is closed');
    this.#count++;
    let active = true;
    return {
      read: () => {
        if (!active) throw new ReferenceError('Reference expired');
        this.#resource.read();
      },
      [Symbol.dispose]: () => {
        if (!active) return;
        active = false;
        this.#count--;
        this.#tryDispose();
      },
    };
  }

  [Symbol.dispose]() {
    this.#closed = true;
    this.#tryDispose();
  }
}

const main = () => {
  using shared = new Shared(new Resource('cache'));
  using first = shared.acquire();
  using second = shared.acquire();

  first.read();
  second.read();
};

main();
