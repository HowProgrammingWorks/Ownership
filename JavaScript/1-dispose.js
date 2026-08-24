'use strict';

class Resource {
  #name = '';
  #closed = false;

  constructor(name) {
    this.#name = name;
    console.log(`Open: ${name}`);
  }

  use() {
    if (this.#closed) throw new ReferenceError('Resource is closed');
    console.log(`Use: ${this.#name}`);
  }

  [Symbol.dispose]() {
    if (this.#closed) return;
    this.#closed = true;
    console.log(`Dispose: ${this.#name}`);
  }
}

const main = () => {
  using resource = new Resource('socket');
  resource.use();
};

main();
