'use strict';

class Resource {
  #name = undefined;
  #closed = false;

  constructor(name) {
    this.#name = name;
    console.log(`Open: ${name}`);
  }

  use() {
    if (this.#closed) throw new ReferenceError('Resource is closed');
    console.log(`Use: ${this.#name}`);
  }

  close() {
    if (this.#closed) return;
    this.#closed = true;
    console.log(`Close: ${this.#name}`);
  }
}

const main = () => {
  let resource = null;
  try {
    resource = new Resource('socket');
    resource.use();
  } finally {
    resource?.close();
  }
};

main();
